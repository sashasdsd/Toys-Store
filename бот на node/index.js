const TelegramBot = require('node-telegram-bot-api');
const db = require('./db')
const fs = require('fs');
const { url } = require('inspector');


// Токен вашого бота
const token = process.env.TG_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

// Створюємо екземпляр бота
const bot = new TelegramBot(token, { polling: true });




// Команда /start
bot.onText(/\/start/, (msg) => {
	console.log(`Chat ID: ${msg.chat.id}`); // Виведе в консоль chat_id
	bot.sendMessage(msg.chat.id, "Твій Chat ID: " + msg.chat.id);
});

// Приклад запиту до бази даних
bot.onText(/\/getusers/, (msg) => {
	const chatId = msg.chat.id;

	db.query('SELECT * FROM users', (err, results) => {
		if (err) {
			bot.sendMessage(chatId, 'Помилка отримання даних з БД.');
			console.error(err);
			return;
		}

		let response = 'Список користувачів:\n';
		results.forEach((user) => {
			response += `${user.user_id}: ${user.login}\n`;
		});

		bot.sendMessage(chatId, response);
	});
});
let lastIdOrder = 0;
let lastIdDraw = 0;
let lastId = 0;
let lastIdOr = 0;
let waitingForPrice = {}; // Об'єкт для очікування введення ціни

function checkForNewDraw() {
	db.query('SELECT * FROM custom_toys ORDER BY id_toy DESC LIMIT 1', (err, results) => {

		if (err) {
			console.error('❌ Помилка отримання даних:', err);
			return;
		}

		if (results.length > 0) {
			const newDrawing = results[0];

			if (newDrawing.id_toy > lastId) {
				lastIdDraw = newDrawing.id_draw;
				lastId = newDrawing.id_toy;
				db.query('SELECT image_data FROM drawings WHERE id_draw = ?', [lastIdDraw], (err, imageResults) => {
					if (err) {
						console.error('❌ Помилка отримання зображення:', err);
						return;
					}

					if (imageResults.length > 0) {
						let base64Data = imageResults[0].image_data;

						if (base64Data.startsWith('data:image')) {
							base64Data = base64Data.split(',')[1];
						}

						const imageBuffer = Buffer.from(base64Data, 'base64');
						const imagePath = `./temp_image_${newDrawing.id_draw}.png`;

						fs.writeFileSync(imagePath, imageBuffer);

						// Кнопка "Ввести ціну"
						const inlineKeyboard = {
							reply_markup: {
								inline_keyboard: [
									[{ text: 'Ввести ціну', callback_data: `enter_price_${newDrawing.id_draw}` }]
								]
							}
						};

						bot.sendPhoto(ADMIN_CHAT_ID, fs.createReadStream(imagePath), {
							caption: `🖼️ Новий малюнок у базі!\n📌 Назва: ${newDrawing.label}\n🎀 Розмір: ${newDrawing.size}\n🧵 Тип ниток: ${newDrawing.thread_type}\n💰 Ціна: ??? грн`,
							...inlineKeyboard
						})
							.then((sentMessage) => {
								waitingForPrice[ADMIN_CHAT_ID] = { messageId: sentMessage.message_id, drawId: newDrawing.id_draw };
								fs.unlinkSync(imagePath);
							})
							.catch(err => console.error('❌ Помилка відправки фото:', err));
					}
				});
			}
		}
	});
}
function checkForNewOrder() {
	db.query('SELECT * FROM `order` ORDER BY id_order DESC LIMIT 1', (err, results) => {
		if (err) {
			console.error('❌ Помилка отримання даних:', err);
			return;
		}

		if (results.length > 0) {
			const newOrder = results[0];

			if (newOrder.id_order > lastIdOr) {
				lastIdOrder = newOrder.id_order;
				lastIdOr = newOrder.id_order;

				db.query('SELECT id_toy, quantity FROM order_toys WHERE id_order = ?', [lastIdOrder], (err, orderResults) => {
					if (err) {
						console.error('❌ Помилка отримання товарів:', err);
						return;
					}
					db.query('SELECT * FROM users WHERE user_id = ?', [newOrder.user_id], (err, userResult) => {
						if (err) {
							console.error('❌ Помилка отримання товарів:', err);
							return;
						}
						const users = userResult[0];

						if (orderResults.length > 0) {
							let UrlTg = 'https://t.me/' + newOrder.telegram;
							let formattedDate = new Date(newOrder.created_at).toLocaleString('uk-UA', {
								year: 'numeric',
								month: '2-digit',
								day: '2-digit',
								hour: '2-digit',
								minute: '2-digit'
							});

							// Отримуємо всі іграшки, що входять у замовлення
							let toyIds = orderResults.map(order => order.id_toy);
							let query = `SELECT id_toy, label, size, thread_type FROM custom_toys WHERE id_toy IN (${toyIds.join(',')})`;

							db.query(query, (err, toyResults) => {
								if (err) {
									console.error('❌ Помилка отримання інформації про товари:', err);
									return;
								}

								if (toyResults.length > 0) {
									let toysText = toyResults.map(toy => {
										// Знайдемо кількість цієї іграшки у замовленні
										let orderItem = orderResults.find(order => order.id_toy === toy.id_toy);
										let quantity = orderItem ? orderItem.quantity : 1;

										return `\n🧸 *${toy.label}*\n🎀 Розмір: ${toy.size}\n🧵 Тип ниток: ${toy.thread_type}\n🔢 Кількість: ${quantity}`;
									}).join('\n');

									// Кнопка "Написати"
									const inlineKeyboard = {
										reply_markup: {
											inline_keyboard: [
												[{ text: 'Написати', url: UrlTg }]
											]
										}
									};

									// Відправка повідомлення про замовлення
									bot.sendMessage(ADMIN_CHAT_ID,
										`🖼️ *Нове замовлення у базі!*\n` +
										`📦 *Список товарів:*\n${toysText}\n\n` +
										`💰 *Сума:* ${newOrder.suma} грн\n` +
										`📞 *Телефон:* ${users.phone}\n` +
										`✉️ *Пошта:* ${newOrder.post}\n` +
										`👤 *Ім'я, Прізвище:* ${users.name} ${users["last name"]}\n` +
										`🌆 *Населений пункт: ${users.town}, ${users.state}\n*` +
										`💌 *Телеграм:* @${users.telegram}\n` +
										`🕒 *Дата замовлення:* ${formattedDate}\n`,
										inlineKeyboard
									).then((sentMessage) => {
										waitingForPrice[ADMIN_CHAT_ID] = {
											messageId: sentMessage.message_id,
											drawId: newOrder.id_order
										};
									}).catch(err => console.error('❌ Помилка відправки повідомлення:', err));
								}

							});
						}
					});
				});
			}
		}
	});
}


// Обробка натискання кнопки "Ввести ціну"
bot.on('callback_query', (callbackQuery) => {
	const chatId = callbackQuery.message.chat.id;
	const messageId = callbackQuery.message.message_id;
	const drawId = callbackQuery.data.split('_')[2]; // Отримуємо ID малюнка

	if (callbackQuery.data.startsWith('enter_price')) {
		bot.sendMessage(chatId, 'Будь ласка, введіть ціну у вигляді числа:');
		waitingForPrice[chatId] = { messageId, drawId };
	}
});

// Обробка введення ціни користувачем
bot.on('message', (msg) => {
	const chatId = msg.chat.id;

	if (waitingForPrice[chatId]) {
		const price = parseFloat(msg.text);

		if (isNaN(price)) {
			bot.sendMessage(chatId, '❌ Будь ласка, введіть коректне число.');
			return;
		}

		const drawId = waitingForPrice[chatId].drawId;

		// Отримуємо назву малюнка перед оновленням ціни
		db.query('SELECT label, size, thread_type FROM custom_toys WHERE id_draw = ?', [drawId], (err, results) => {
			if (err || results.length === 0) {
				bot.sendMessage(chatId, '❌ Помилка отримання даних з бази.');
				console.error(err);
				return;
			}

			const drawingLabel = results[0].label; // Назва малюнка
			const drawingSize = results[0].size;
			const drawingType = results[0].thread_type;
			// Оновлюємо ціну та статус "оцінено" в БД
			db.query(
				'UPDATE custom_toys SET price = ? WHERE id_draw = ?',
				[price, drawId],
				(err) => {
					if (err) {
						bot.sendMessage(chatId, '❌ Помилка збереження в базі custom_toys.');
						console.error(err);
						return;
					}

					db.query(
						'UPDATE drawings SET evaluation = ? WHERE id_draw = ?',
						['оцінено', drawId],
						(err) => {
							if (err) {
								bot.sendMessage(chatId, '❌ Помилка збереження в базі drawings.');
								console.error(err);
								return;
							}

							// Надсилаємо повідомлення про успішне збереження
							bot.sendMessage(chatId, `✅ Ціна успішно збережена: ${price} грн`);

							// Оновлюємо повідомлення з малюнком
							bot.editMessageCaption(
								`🖼️ Новий малюнок у базі!\n📌 Назва: ${drawingLabel}\n🎀 Розмір: ${drawingSize}\n🧵 Тип ниток: ${drawingType}\n💰 Ціна: ${price} грн`,
								{
									chat_id: chatId,
									message_id: waitingForPrice[chatId].messageId,
									reply_markup: {
										inline_keyboard: [
											[
												{
													text: 'Ввести нову ціну',
													callback_data: `enter_price_${drawId}`
												}
											]
										]
									}
								}
							);

							// Очищаємо стан очікування ціни
							delete waitingForPrice[chatId];
						}
					);
				}
			);
		});
	}
});



// ✅ Перевіряємо наявність нових малюнків кожні 5 секунд
setInterval(checkForNewDraw, 5000);
setInterval(checkForNewOrder, 5000);