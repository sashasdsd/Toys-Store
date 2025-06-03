import dotenv from "dotenv";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import mysql from "mysql2/promise";
import path from 'path';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = 3000;
const CLIENT_ID = process.env.CLIENT_ID

const client = new OAuth2Client(CLIENT_ID);
let db;

// Налаштування Multer для завантаження зображень
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, 'public', 'img', 'Shop-item')); // Використовуємо дефіс замість пробілу
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
		const sanitizedFileName = file.originalname.replace(/\s+/g, '_'); // Заміна пробілів на підкреслення
		cb(null, `${uniqueSuffix}-${sanitizedFileName}`);
	}
});

const upload = multer({
	storage: storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
	fileFilter: (req, file, cb) => {
		if (file.mimetype.startsWith('image/')) { // Виправлено MIME-тип
			cb(null, true);
		} else {
			cb(new Error('Дозволені тільки зображення!'), false);
		}
	}
});

// Middleware
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));


// Підключення до БД
async function connectToDb() {
	try {
		db = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
		});
		console.log("✅ Підключено до MySQL!");
	} catch (err) {
		console.error("❌ Помилка підключення до MySQL:", err);
		process.exit(1);
	}
}




// Google OAuth
app.post('/google-auth', async (req, res) => {
	const { token } = req.body;

	try {
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: CLIENT_ID,
		});

		const payload = ticket.getPayload();
		res.json({ success: true, user: payload });
	} catch (error) {
		console.error('Помилка автентифікації:', error);
		res.status(400).json({ success: false, message: 'Invalid token' });
	}
});



// Реєстрація та логін користувача
const SECRET_KEY = process.env.JWT_SECRET; // Переконайтеся, що SECRET_KEY встановлено в змінних оточення

// app.post('/login', async (req, res) => {

// 	const { login, password } = req.body;

// 	if (!login || !password) {
// 		return res.status(400).json({ message: 'Всі поля обов’язкові!' });
// 	}

// 	try {
// 		const [results] = await db.execute('SELECT * FROM users WHERE login = ?', [login]);

// 		if (results.length === 0) {
// 			// Якщо користувача не існує, хешуємо пароль і створюємо нового користувача
// 			const hashedPassword = bcrypt.hashSync(password, 10);
// 			const [insertResult] = await db.execute('INSERT INTO users (login, password) VALUES (?, ?)', [login, hashedPassword]);

// 			// Генеруємо токен для нового користувача
// 			const newUserId = insertResult.insertId;
// 			const token = jwt.sign({ userId: newUserId }, SECRET_KEY, { expiresIn: '1h' });

// 			return res.status(200).json({
// 				success: true,
// 				message: 'Користувач зареєстрований та успішно ввійшов!',
// 				token,
// 				user_id: newUserId
// 			});
// 		}

// 		const user = results[0];
// 		const isPasswordValid = bcrypt.compareSync(password, user.password);

// 		if (!isPasswordValid) {
// 			return res.status(401).json({ message: 'Невірний логін або пароль' });
// 		}

// 		const token = jwt.sign({ userId: user.user_id }, SECRET_KEY, { expiresIn: '1h' });

// 		res.status(200).json({
// 			success: true,
// 			message: 'Успішний вхід!',
// 			token,
// 			user_id: user.user_id
// 		});

// 	} catch (err) {
// 		console.error(err);
// 		res.status(500).json({ message: 'Помилка сервера', error: err.message });
// 	}
// });


// API для отримання user_id за login



// // Новий ендпоїнт для отримання малюнків (з перевіркою токена)
// app.get('/api/drawings', authenticateToken, async (req, res) => {
// 	try {
// 		const userId = req.user.userId; // Отримуємо з токена
// 		const [drawings] = await db.execute(
// 			'SELECT * FROM drawings WHERE user_id = ?',
// 			[userId]
// 		);
// 		res.json(drawings);
// 	} catch (err) {
// 		console.error(err);
// 		res.status(500).json({ message: 'Помилка завантаження малюнків' });
// 	}
// });

app.post('/register', async (req, res) => {
	const { login, password, phone } = req.body;

	// Перевірка, чи всі поля були заповнені
	if (!login || !password || !phone) {
		return res.status(400).json({ message: 'Всі поля обов’язкові!' });
	}
	if (!/^\+380\d{9}$/.test(phone.trim())) {
		return res.status(400).json({ message: 'Невірний формат номера телефону' });
	}
	try {
		// Перевіряємо, чи є користувач з таким логіном
		const [results] = await db.execute('SELECT * FROM users WHERE login = ?', [login]);

		if (results.length > 0) {
			return res.status(400).json({ message: 'Користувач з таким логіном вже існує' });
		}
		// Перевіряємо, чи є користувач з таким телефоном
		const [resultsPhone] = await db.execute('SELECT * FROM users WHERE phone = ?', [phone]);

		if (resultsPhone.length > 0) {
			return res.status(400).json({ message: 'Користувач з таким телефоном вже існує' });
		}

		// Хешуємо пароль
		const hashedPassword = bcrypt.hashSync(password, 10);

		// Вставляємо нового користувача в базу даних
		const [insertResult] = await db.execute(
			'INSERT INTO users (login, password, phone) VALUES (?, ?, ?)',
			[login, hashedPassword, phone]
		);

		// Генерація токену для нового користувача
		const newUserId = insertResult.insertId;
		const token = jwt.sign({ userId: newUserId }, SECRET_KEY, { expiresIn: '5h' });

		// Встановлюємо токен у cookie з HttpOnly флагом
		res.cookie('token', token, {
			httpOnly: true, // Захищає від доступу через JavaScript
			secure: process.env.NODE_ENV === 'production', // Встановлюється тільки на HTTPS в продакшн середовищі
			maxAge: 3600 * 1000 // Тривалість токену (1 година)
		});

		// Повертаємо успішну відповідь без токену в тілі
		res.json({
			success: true,
			message: 'Користувач успішно зареєстрований!',
			login: login
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Помилка сервера', error: err.message });
	}
});

// Вхід користувача
app.post('/login', async (req, res) => {
	const { login, password } = req.body;

	// Перевірка наявності обов'язкових полів
	if (!login || !password) {
		return res.status(400).json({ message: 'Всі поля обов’язкові!' });
	}

	try {
		// Перевірка наявності користувача в базі даних
		const [results] = await db.execute('SELECT * FROM users WHERE login = ?', [login]);

		if (results.length === 0) {
			return res.status(401).json({ message: 'Користувача не знайдено' });
		}

		const user = results[0];
		const isPasswordValid = bcrypt.compareSync(password, user.password);

		if (!isPasswordValid) {
			return res.status(401).json({ message: 'Невірний логін або пароль' });
		}

		// Генерація токену для користувача
		const token = jwt.sign({ userId: user.user_id }, SECRET_KEY, { expiresIn: '5h' });

		// Встановлюємо токен у cookie з HttpOnly флагом
		res.cookie('token', token, {
			httpOnly: true, // Захищає від доступу через JavaScript
			secure: process.env.NODE_ENV === 'production', // Встановлюється тільки на HTTPS в продакшн середовищі
			maxAge: 5 * 60 * 60 * 1000// Тривалість токену (1 година)
		});

		// Повертаємо успішну відповідь
		res.json({
			success: true,
			message: 'Успішний вхід!',
			login: login
		});

	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Помилка сервера', error: err.message });
	}
});

app.use(cookieParser()); // Додаємо middleware для парсингу кук

// Створюємо маршрут для перевірки токена
app.get('/check-token', (req, res) => {
	// Отримуємо токен з кук
	const token = req.cookies.token;

	if (!token) {
		return res.status(401).json({ message: 'Токен не знайдено' });
	}

	// Перевіряємо токен
	jwt.verify(token, SECRET_KEY, (err, decoded) => {
		if (err) {
			return res.status(401).json({ message: 'Невірний токен' });
		}

		// Токен правильний, повертаємо дані користувача або підтвердження
		res.status(200).json({ message: 'Токен валідний', userId: decoded.userId });
	});
});

app.post('/get-user-id', async (req, res) => {
	const { login } = req.body;
	console.log('Received login:', login); // Логування отриманих даних

	if (!login) {
		return res.json({ success: false, message: 'Логін не надано' });
	}

	try {
		const [results] = await db.execute('SELECT user_id FROM users WHERE login = ?', [login]);
		console.log('Database results:', results); // Логування результатів запиту

		if (results.length > 0) {
			return res.json({
				success: true,
				user_id: results[0].user_id
			});
		} else {
			return res.json({ success: false, message: 'Користувача не знайдено' });
		}
	} catch (err) {
		console.error('Помилка при запиті до бази даних:', err);
		res.status(500).json({ success: false, message: 'Помилка бази даних' });
	}
});
// API для збереження малюнка
app.post('/save-drawing', async (req, res) => {
	const { image_data, label, user_id } = req.body;

	if (!user_id || !image_data) {
		return res.json({ success: false, message: 'Відсутні необхідні дані' });
	}

	try {
		// Перевірка існування користувача
		const [userResults] = await db.execute('SELECT user_id FROM users WHERE user_id = ?', [user_id]);
		if (userResults.length === 0) {
			return res.json({ success: false, message: 'Користувача не знайдено' });
		}

		// Генерація SHA-256 хешу для image_data
		const imageHash = crypto.createHash('sha256').update(image_data).digest('hex');

		// Перевіряємо, чи вже є зображення з таким хешем
		const [existingImage] = await db.execute('SELECT id_draw FROM drawings WHERE image_hash = ?', [imageHash]);

		if (existingImage.length > 0) {
			return res.json({ success: true, message: 'Зображення вже існує', drawning_id: existingImage[0].id_draw });
		}

		// Збереження малюнка з хешем
		const [results] = await db.execute(
			'INSERT INTO drawings (user_id, image_data, label, image_hash) VALUES (?, ?, ?, ?)',
			[user_id, image_data, label || 'Без назви', imageHash]
		);

		res.json({
			success: true,
			drawning_id: results.insertId,
			imageData: image_data,
			imageHash: imageHash // Повертаємо хеш для перевірки
		});
	} catch (err) {
		console.error('Помилка при збереженні малюнка:', err);
		res.status(500).json({ success: false, message: 'Помилка збереження' });
	}
});

// Отримання ідентифікатора малюнка
app.post('/get-draw-id', async (req, res) => {
	const { image_data } = req.body;

	if (!image_data) {
		return res.status(400).json({ success: false, message: 'Зображення не надано' });
	}

	// Генерація SHA-256 хешу для image_data
	const imageHash = crypto.createHash('sha256').update(image_data).digest('hex');
	console.log('Створений хеш зображення:', imageHash);
	try {
		// Виконання запиту до бази даних для отримання id_draw
		const [results] = await db.execute('SELECT id_draw FROM drawings WHERE image_hash = ?', [imageHash]);

		// Якщо зображення знайдено, перевіряємо його evaluation
		if (results.length > 0) {
			// Виконуємо другий запит для отримання evaluation
			const [evaluationResults] = await db.execute(
				'SELECT evaluation FROM drawings WHERE id_draw = ? AND (evaluation = "оцінюється" OR evaluation = "оцінено")',
				[results[0].id_draw]
			);
			const [sizeResults] = await db.execute(
				'SELECT size FROM custom_toys WHERE id_draw = ?',
				[results[0].id_draw]
			);
			const [typeResults] = await db.execute(
				'SELECT thread_type FROM custom_toys WHERE id_draw = ?',
				[results[0].id_draw]
			);

			// Формуємо відповідь
			let response = {
				success: true,
				id_draw: results[0].id_draw
			};
			if (sizeResults.length > 0) {
				response.size = sizeResults[0].size;
			}
			if (typeResults.length > 0) {
				response.type = typeResults[0].thread_type;
			}
			// Додаємо evaluation, якщо воно є
			if (evaluationResults.length > 0) {
				response.evaluation = evaluationResults[0].evaluation;
			}

			console.log('Результати запиту:', results); // Виведення результатів запиту
			return res.json(response); // Відправка відповіді
		} else {
			res.status(404).json({ success: false, message: 'Зображення не знайдено в базі' });
		}
	} catch (err) {
		console.error('Помилка при отриманні малюнків:', err);
		res.status(500).json({ success: false, message: 'Помилка бази даних' });
	}
});


app.post('/get-user-drawings', async (req, res) => {
	const { user_id } = req.body;

	if (!user_id) {
		return res.json({ success: false, message: 'Відсутній user_id' });
	}

	try {
		const [results] = await db.execute('SELECT * FROM drawings WHERE user_id = ?', [user_id]);
		res.json({
			success: true,
			drawings: results // Повертаємо всі малюнки користувача
		});
	} catch (err) {
		console.error('Помилка при отриманні малюнків:', err);
		res.status(500).json({ success: false, message: 'Помилка бази даних' });
	}
});


app.post('/get-label', async (req, res) => {
	const { id_draw } = req.body;

	if (!id_draw) {
		return res.json({ success: false, message: 'Відсутній id_draw' });
	}

	try {
		// Об'єднуємо всі необхідні поля в один запит за допомогою LEFT JOIN
		const [results] = await db.execute(
			`SELECT d.label, c.size, c.thread_type 
				FROM drawings d
				LEFT JOIN custom_toys c ON d.id_draw = c.id_draw
				WHERE d.id_draw = ?`,
			[id_draw]
		);

		if (results.length === 0) {
			return res.json({ success: false, message: 'Зображення не знайдено' });
		}

		// Отримуємо перший (і єдиний) рядок результату
		const { label, size, thread_type } = results[0];

		res.json({
			success: true,
			label,
			size: size || null, // Якщо нема значення, повертаємо null
			thread_type: thread_type || null
		});

	} catch (err) {
		console.error('Помилка при отриманні label:', err);
		res.status(500).json({ success: false, message: 'Помилка бази даних' });
	}
});

app.put('/update-drawing', async (req, res) => {
	const { image_data, label, id_draw } = req.body;
	// Перевірка на наявність всіх необхідних даних
	const base64String = image_data;
	const buffer = Buffer.from(base64String.split(",")[1], "base64");



	if (!image_data || !id_draw) {
		return res.status(400).json({ success: false, message: 'Відсутні необхідні дані' });
	}

	try {
		// Перевірка, чи існує малюнок з таким id_draw в базі
		const [existingDrawing] = await db.execute('SELECT * FROM drawings WHERE id_draw = ?', [id_draw]);

		// Якщо малюнок не знайдено, повертаємо помилку
		if (existingDrawing.length === 0) {
			return res.status(404).json({ success: false, message: 'Малюнок не знайдено' });
		}
		const imageHash = crypto.createHash('sha256').update(image_data).digest('hex');
		// Оновлення малюнка в базі даних
		const [results] = await db.execute(
			'UPDATE drawings SET image_data = ?, label = ?, image_hash = ? WHERE id_draw = ?',
			[image_data, label || existingDrawing[0].label, imageHash, id_draw]// якщо label не переданий, залишити старий
		);

		if (results.affectedRows === 0) {
			return res.status(404).json({ success: false, message: 'Малюнок не оновлено' });
		}

		res.json({
			success: true,
			message: 'Малюнок успішно оновлено'
		});
		let num = buffer.length / (1024 * 1024);
		console.log("Розмір :", num.toFixed(5) + " Mb");
	} catch (err) {
		console.error('Помилка при оновленні малюнка:', err);
		res.status(500).json({ success: false, message: 'Помилка оновлення малюнка' });
	}
});


app.post('/delete-drawing', async (req, res) => {
	const { drawing_id } = req.body;

	if (!drawing_id) {
		return res.status(400).json({ success: false, message: 'ID малюнка не вказано' });
	}

	try {
		// Починаємо транзакцію
		await db.beginTransaction();

		// Видаляємо всі пов'язані записи з custom_toys
		await db.execute('DELETE FROM custom_toys WHERE id_draw = ?', [drawing_id]);

		// Видаляємо сам малюнок з drawings
		const [result] = await db.execute('DELETE FROM drawings WHERE id_draw = ?', [drawing_id]);

		if (result.affectedRows === 0) {
			await db.rollback();
			return res.status(404).json({ success: false, message: 'Малюнок не знайдено' });
		}

		// Фіксуємо транзакцію
		await db.commit();

		return res.json({ success: true, message: 'Малюнок успішно видалено' });
	} catch (err) {
		await db.rollback();
		console.error('Помилка при видаленні малюнка:', err);
		return res.status(500).json({ success: false, message: 'Не вдалося видалити малюнок' });
	}
});


app.put('/put-id-draw', async (req, res) => {
	const { id_draw, size, thread_type } = req.body;

	if (!id_draw) {
		console.error('Помилка: Відсутній id_draw');
		return res.status(400).json({ success: false, message: 'Відсутні необхідні дані' });
	}


	try {
		// Отримуємо запис з таблиці drawings за id_draw
		const [drawing] = await db.execute(
			'SELECT * FROM drawings WHERE id_draw = ?',
			[id_draw]
		);

		if (drawing.length === 0) {
			console.error('Помилка: Малюнок не знайдено в drawings');
			return res.status(404).json({ success: false, message: 'Малюнок не знайдено в базі drawings' });
		}

		// Отримуємо label з запису
		const label = drawing[0].label || 'Без назви';

		// Оновлюємо статус у таблиці drawings
		await db.execute(
			'UPDATE drawings SET evaluation = ? WHERE id_draw = ?',
			["оцінюється", id_draw]
		);
		console.log('Малюнок оновлено в drawings');

		// Перевіряємо, чи вже існує запис у custom_toys
		const [existingToy] = await db.execute(
			'SELECT id_draw FROM custom_toys WHERE id_draw = ?',
			[id_draw]
		);

		if (existingToy.length > 0) {
			console.log('Малюнок вже існує в custom_toys');
			return res.json({
				success: true,
				message: 'Малюнок вже існує в базі custom_toys',
				inserted: false
			});
		}

		// Вставляємо новий запис у custom_toys
		const [insertResult] = await db.execute(
			'INSERT INTO custom_toys (id_draw, label, size, thread_type) VALUES (?, ?, ?, ?)',
			[id_draw, label, size, thread_type]
		);

		console.log('Малюнок додано до custom_toys');
		return res.json({
			success: true,
			message: 'Малюнок успішно додано до бази custom_toys',
			insertedId: insertResult.insertId
		});

	} catch (err) {
		console.error('Помилка при обробці малюнка:', err);
		res.status(500).json({ success: false, message: 'Помилка обробки малюнка' });
	}
});


app.post("/check-data", async (req, res) => {
	const { id_draw } = req.body; // Отримуємо id_draw з тіла запиту
	console.log("Отримано запит на перевірку ціни для id_draw:", id_draw);

	// Перевірка наявності id_draw
	if (!id_draw) {
		console.error("Відсутній параметр id_draw");
		return res.status(400).json({ success: false, message: 'Відсутній параметр id_draw' });
	}

	try {
		// Виконання запиту до БД
		console.log("Виконується запит до БД...");

		const [results] = await db.execute("SELECT price FROM custom_toys WHERE id_draw = ?", [id_draw]);

		// Перевірка на наявність результатів
		if (results.length === 0) {
			console.log("Ціна не знайдена для id_draw:", id_draw);
			return res.status(404).json({ success: false, message: 'Ціна не знайдена' });
		}

		// Якщо ціна знайдена, повертаємо її
		let price = results[0].price;
		console.log("Результат запиту до БД:", price);
		res.json({ price: price });

	} catch (error) {
		// Обробка помилок запиту
		console.error("Помилка при виконанні запиту до БД:", error);
		res.status(500).json({ success: false, message: 'Помилка при виконанні запиту до БД' });
	}
});



//order
app.post("/saveOrder", async (req, res) => {
	const { telegram, name, last_name, phone, post, toys, suma, user_id, town, state } = req.body;

	try {
		// 1. Створюємо замовлення
		const [orderResult] = await db.execute(
			"INSERT INTO `order` (user_id, post, suma) VALUES (?, ?, ?)",
			[user_id, post, suma]
		);

		const orderId = orderResult.insertId;
		await db.execute(
			"UPDATE users SET telegram = ?, name = ?,`last name` = ?, phone = ?, town = ?, state = ? WHERE user_id = ?",
			[telegram, name, last_name, phone, town, state, user_id]
		);
		// 2. Додаємо іграшки до `order_toys`
		for (let toy of toys) {
			// Перевіряємо, чи в нас є id_draw
			if (!toy.id_draw) {
				console.error("Помилка: id_draw не передано для іграшки", toy);
				continue;
			}

			// Отримуємо id_toy по id_draw
			const [resultsId] = await db.execute(
				"SELECT id_toy FROM custom_toys WHERE id_draw = ?", [toy.id_draw]
			);

			if (resultsId.length === 0) {
				console.error("Помилка: Не знайдено id_toy для id_draw:", toy.id_draw);
				continue;
			}

			const toy_id = resultsId[0].id_toy;

			// Записуємо іграшку у `order_toys`
			await db.execute(
				"INSERT INTO `order_toys` (id_order, id_toy, quantity) VALUES (?, ?, ?)",
				[orderId, toy_id, toy.quantity]
			);
		}

		res.json({ success: true, message: "Замовлення збережено!" });
	} catch (error) {
		console.error("Помилка збереження замовлення:", error);
		res.status(500).json({ success: false, message: "Помилка сервера" });
	}
});

// Отримання списку областей
app.get("/states", async (req, res) => {
	try {
		console.log("Отримано запит на /states");

		const sql = "SELECT * FROM locations WHERE type = 'STATE'";
		// console.log("Виконується SQL-запит:", sql);

		const [states] = await db.query(sql);
		// console.log("Отримані області:", states);

		if (states.length === 0) {
			return res.status(404).json({ error: "Області не знайдено" });
		}

		res.json(states);
	} catch (err) {
		console.error("❌ Помилка при отриманні областей:", err);
		res.status(500).json({ error: "Не вдалося завантажити області" });
	}
});

// Отримання населених пунктів за ID області
app.get("/settlements/:stateId", async (req, res) => {
	try {
		const stateId = req.params.stateId;
		// console.log("Отримано запит на /settlements/:stateId", stateId);

		if (isNaN(stateId)) {
			return res.status(400).json({ error: "Невірний ID області" });
		}

		// Формуємо SQL-запит вручну, підставляючи stateId
		const sql = `
	SELECT * FROM locations
      WHERE parent_id IN (
        SELECT id FROM locations
        WHERE parent_id IN (
          SELECT id FROM locations
          WHERE parent_id = ${stateId}
          AND type = 'DISTRICT'
        )
        AND type = 'COMMUNITY'
      )
      AND type IN ('CITY', 'URBAN', 'SETTLEMENT', 'VILLAGE')
	
	  `;
		// console.log("Виконується SQL-запит:", sql);

		// Використовуємо pool.query замість db.query
		const [settlements] = await db.query(sql);
		// console.log("Отримані населені пункти:", settlements);

		if (settlements.length === 0) {
			return res.status(404).json({ error: "Населені пункти не знайдено" });
		}

		res.json(settlements);
	} catch (err) {
		console.error("❌ Помилка при отриманні населених пунктів:", err);
		res.status(500).json({ error: "Не вдалося завантажити населені пункти" });
	}
});


//SHOP

// Маршрути для товарів
const createProductsRouter = (db) => {
	const router = express.Router();

	// Отримання товарів
	router.get('/', async (req, res) => {
		try {
			const {
				category_id,
				thread_type,
				size,
				color,
				search
			} = req.query;

			let query = `
			SELECT DISTINCT p.*, c.name AS category_name
			FROM Products p
			JOIN Categories_toys c ON p.category_id = c.category_id
			LEFT JOIN product_sizes ps ON p.product_id = ps.product_id
			LEFT JOIN ProductColors pc ON p.product_id = pc.product_id
			LEFT JOIN Colors col ON pc.color_id = col.color_id
			WHERE 1=1
		`;
			const params = [];

			if (category_id) {
				query += ` AND p.category_id = ?`;
				params.push(category_id);
			}

			if (thread_type) {
				query += ` AND p.thread_type = ?`;
				params.push(thread_type);
			}

			if (size) {
				query += ` AND ps.size = ?`;
				params.push(size);
			}

			if (color) {
				query += ` AND col.name = ?`;
				params.push(color);
			}

			if (search) {
				query += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
				const like = `%${search}%`;
				params.push(like, like);
			}

			const [products] = await db.query(query, params);
			res.json(products);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Помилка при фільтрації товарів' });
		}
	});


	// Додавання товару з зображенням
	router.post('/', upload.single('image'), async (req, res) => {
		try {
			const { name, description, price, category_id, size, thread_type, stock } = req.body;
			const image_url = req.file
				? `/img/Shop-item/${req.file.filename}` // Оновлений шлях
				: null;

			const [result] = await db.query(
				`INSERT INTO Products 
			(name, description, price, category_id, size, thread_type, image_url, stock)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
				[name, description, price, category_id, size, thread_type, image_url, stock]
			);

			res.status(201).json({
				id: result.insertId,
				image_url,
				message: 'Товар успішно додано!'
			});
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Помилка при додаванні товару' });
		}
	});
	router.get('/:productId', async (req, res) => {
		try {
			const productId = parseInt(req.params.productId);

			if (isNaN(productId)) {
				return res.status(400).json({ error: 'Невірний ID товару' });
			}

			const [rows] = await db.query(
				`SELECT 
    p.*,
    c.name AS category_name,
    COALESCE(GROUP_CONCAT(DISTINCT col.name ORDER BY col.name SEPARATOR ', '), '') AS colors,
    COALESCE(GROUP_CONCAT(DISTINCT CONCAT(ps.size, ':', ps.price_s) ORDER BY ps.size SEPARATOR ', '), '') AS product_sizes
FROM Products p
LEFT JOIN Categories_toys c ON p.category_id = c.category_id
LEFT JOIN ProductColors pc ON p.product_id = pc.product_id
LEFT JOIN Colors col ON pc.color_id = col.color_id
LEFT JOIN product_sizes ps ON p.product_id = ps.product_id
WHERE p.product_id = ?
GROUP BY p.product_id`,
				[productId]
			);

			if (rows.length === 0) {
				return res.status(404).json({ error: 'Товар не знайдено' });
			}

			const formattedProduct = {
				...rows[0],
				price: parseFloat(rows[0].price)
			};

			res.json(formattedProduct);

		} catch (error) {
			console.error('Помилка бази даних:', error);
			res.status(500).json({ error: 'Внутрішня помилка сервера' });
		}
	});

	return router;
};
app.post("/api/category", async (req, res) => {
	const { category } = req.body;
	console.log("Категорія, що прийшла:", category); // 👈

	if (!category) {
		return res.status(400).json({ success: false, message: "Категорія не вказана" });
	}

	try {
		const [results] = await db.execute('SELECT * FROM products WHERE category_id = ?', [category]);
		res.json({ success: true, products: results });
	} catch (err) {
		console.error('Помилка при отриманні іграшок:', err);
		res.status(500).json({ success: false, message: 'Помилка бази даних' });
	}
});

// Обробка помилок Multer
app.use((err, req, res, next) => {
	if (err instanceof multer.MulterError) {
		res.status(400).json({
			error: err.code === 'LIMIT_FILE_SIZE'
				? 'Файл занадто великий (макс. 5MB)'
				: err.message
		});
	} else if (err) {
		res.status(500).json({ error: err.message });
	}
	next();
});





// Запуск сервера
async function startServer() {
	await connectToDb();
	app.use('/api/products', createProductsRouter(db));

	app.listen(PORT, () => {
		console.log(`🚀 Сервер запущено на http://localhost:${PORT}`);
	});
}

startServer();
