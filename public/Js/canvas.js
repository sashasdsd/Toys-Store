
// Малювання

window.onload = () => {
	container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
};

// Встановлення активної кнопки

const hendButton = document.getElementById("draggingButton")

hendButton.addEventListener("click", () => {
	toggleActiveButton(hendButton, eraser, penButton, fillButton);
	isDragging = true; // Увімкнути режим переміщення
	isDrawing = false; // Увімкнути режим малювання
	isErasing = false; // Вимкнути стирачку
	isFilling = false;
	canvas.style.cursor = "grab"; // Міняємо курсор на "grab"

});



function toggleActiveButton(activeButton, inactiveButton, inactiveButton2, inactiveButton3) {
	activeButton.classList.add('active');
	inactiveButton.classList.remove('active');
	inactiveButton2.classList.remove('active');
	inactiveButton3.classList.remove('active');
}

function togglePen() {
	penButton.addEventListener('click', () => {
		toggleActiveButton(penButton, eraser, fillButton, hendButton);
		console.log('ручка активована');
		isDrawing = true; // Увімкнути режим малювання
		isErasing = false; // Вимкнути стирачку
		isFilling = false; // Вимкнути заливку
		isDragging = false;
		fillButton.textContent = isFilling ? 'Вимкнути заливку' : 'Вимкнута заливка';
		canvas.style.cursor = "	crosshair";
	});
}





// Стан для миші
function draw(e) {
	if (!isDrawing || isErasing || !isMouseDown || isDragging) return;
	if (isFilling) {
		isDrawing = false;
	}
	penButton.classList.add('active');
	ctx.strokeStyle = strokeColor; // Колір лінії
	ctx.lineWidth = lineWidth; // Товщина лінії
	ctx.lineCap = 'round'; // Круглі кінці
	ctx.lineJoin = 'round'; // Круглі з'єднання
	ctx.beginPath();
	ctx.moveTo(lastX, lastY); // Починаємо з попередньої точки
	ctx.lineTo(e.offsetX, e.offsetY); // Малюємо до нової точки
	ctx.stroke();
	[lastX, lastY] = [e.offsetX, e.offsetY]; // Оновлюємо координати
	togglePen();
}

// Малювання на сенсорному екрані
function drawTouch(e) {
	if (!isDrawing) return;

	const rect = canvas.getBoundingClientRect();
	const touch = e.touches[0];
	const currentX = touch.clientX - rect.left;
	const currentY = touch.clientY - rect.top;

	ctx.strokeStyle = strokeColor; // Колір лінії
	ctx.lineWidth = lineWidth; // Товщина лінії
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.beginPath();
	ctx.moveTo(lastPX, lastPY);
	ctx.lineTo(currentX, currentY);
	ctx.stroke();
	[lastPX, lastPY] = [currentX, currentY];

}

function erase(e) {
	if (!isErasing || !isMouseDown) return;// Стираємо тільки якщо активна стирачка і миша натиснута
	ctx.globalCompositeOperation = 'destination-out'; // Видалення
	ctx.lineWidth = lineWidth;
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.beginPath();
	ctx.moveTo(lastX, lastY);
	ctx.lineTo(e.offsetX, e.offsetY);
	ctx.stroke();
	ctx.globalCompositeOperation = 'source-over'; // Повертаємо нормальний режим
	[lastX, lastY] = [e.offsetX, e.offsetY];
	canvas.style.cursor = "	crosshair";

}
function eraseTouch(e) {

	const rect = canvas.getBoundingClientRect();  // Отримуємо розміри canvas
	const touch = e.touches[0];  // Отримуємо перший дотик
	const currentX = touch.clientX - rect.left;
	const currentY = touch.clientY - rect.top;

	if (!isErasing) return; // Стираємо тільки якщо активна стирачка і миша натиснута
	ctx.globalCompositeOperation = 'destination-out'; // Видалення
	ctx.lineWidth = lineWidth;
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.beginPath();
	ctx.moveTo(lastPX, lastPY);
	ctx.lineTo(currentX, currentY);
	ctx.stroke();
	ctx.globalCompositeOperation = 'source-over'; // Повертаємо нормальний режим
	[lastPX, lastPY] = [currentX, currentY];

}

function toggleEraser() {
	eraser.addEventListener('click', () => {

		toggleActiveButton(eraser, penButton, fillButton, hendButton);
		console.log('ручка не активована');
		isDrawing = false;
		isErasing = true; // Увімкнути режим стирання
		isFilling = false;
		isDragging = false;
		fillButton.textContent = isFilling ? 'Вимкнути заливку' : 'Вимкнута заливка';
	});
}




// Вибір кольору
colorPicker.addEventListener('input', (e) => {
	fillColor = e.target.value;
	strokeColor = e.target.value; // Встановлюємо новий колір для малювання
	isErasing = false; // Вимикаємо режим стирання
	isDragging = false;
	isDrawing = true; // Вмикаємо режим малювання
	if (isFilling) {
		isDrawing = false;
	}
	eraser.classList.remove('active'); // Забираємо візуальну індикацію активної стирачки
});

// Вибір режиму стирання
eraser.addEventListener('click', () => {
	isErasing = true; // Активуємо режим стирання
	isDrawing = false; // Вимикаємо режим малювання
	isDragging = false;
	isFilling = false;
});



// Початок дії: малювання або стирання
canvas.addEventListener('mousedown', (e) => {
	isMouseDown = true; // Фіксуємо, що миша натиснута
	startX = e.pageX;
	scrollLeft = container.scrollLeft;

	if (isDragging) {
		canvas.style.cursor = "grabbing"; // Міняємо курсор
	} else {
		[lastX, lastY] = [e.offsetX, e.offsetY];
		redoStack = []; // Скидаємо redo, якщо починається нове малювання
	}


});

// Виконання дії при русі миші
canvas.addEventListener('mousemove', (e) => {
	if (!isMouseDown) return;

	if (isDragging) {
		e.preventDefault();
		const moveX = e.pageX - startX;
		container.scrollLeft = scrollLeft - moveX; // Коректний рух уліво-вправо
	} else if (isDrawing) {
		draw(e);
	} else if (isErasing) {
		erase(e);
	}
});

// Завершення дії
canvas.addEventListener('mouseup', () => {
	isMouseDown = false; // Знімаємо прапор натискання миші
	// Зберігаємо поточний стан у масив історії
	if (isDragging) {
		canvas.style.cursor = "grab";
		return
	}
	if (isDrawing || isErasing) {

		saveState(); // Додаємо новий стан у history
		history.push(canvas.toDataURL());
		console.log('Стан збережено, кількість записів:', history.length);
	}

});

canvas.addEventListener('mouseout', () => {
	if (isDragging) {
		canvas.style.cursor = "grab";
		return
	}
	if (isMouseDown) { // Якщо миша була натиснута, зберігаємо стан перед виходом
		if (isDrawing || isErasing) {
			saveState();
			history.push(canvas.toDataURL());
			console.log('Стан збережено через вихід за межі canvas, кількість записів:', history.length);
		}
	}
	isMouseDown = false;
});

container.addEventListener("mouseleave", () => {
	isMouseDown = false; // Вимикаємо натискання, коли курсор виходить за межі контейнера
});

// для сенсорів
canvas.addEventListener('touchstart', (e) => {
	const rect = canvas.getBoundingClientRect();
	const touch = e.touches[0]; // Отримуємо перший дотик

	if (isDragging) {
		startX = touch.clientX; // Відносно екрана
		scrollLeft = container.scrollLeft;
		return
	}
	if (isFilling) {
		isDrawing = false;
	}
	if (isDrawing) {
		penButton.classList.add('active');
		togglePen();  // Активуємо інструмент малювання (ручку)
	} else {
		penButton.classList.remove('active');  // Видаляємо клас active, якщо це не ручка
	}


	// Визначаємо початкові координати для малювання
	lastPX = touch.clientX - rect.left;
	lastPY = touch.clientY - rect.top;

	redoStack = [];
});

canvas.addEventListener('touchmove', (e) => {
	if (!isDragging && !isDrawing) return;

	e.preventDefault();
	const touch = e.touches[0];

	if (isDragging) {
		const moveX = touch.clientX - startX; // Вираховуємо зміщення
		container.scrollLeft = scrollLeft - moveX; // Міняємо scrollLeft
		return;
	}
	if (isDrawing) drawTouch(e);
	if (isErasing) eraseTouch(e);
});

canvas.addEventListener('touchend', (e) => {
	if (isDragging) {
		isTouchStart = false;
		return
	}
	isTouchStart = false;
	if (isDrawing) {
		saveState(); // Додаємо новий стан у history
	}
	history.push(canvas.toDataURL());
	console.log('Стан збережено, кількість записів:', history.length);
});

canvas.addEventListener('touchcancel', () => {
	isTouchStart = false;
});

// Оновлення товщини лінії
lineWidthInput.addEventListener('input', (e) => {
	lineWidth = parseInt(e.target.value, 10); // Зберігаємо нове значення товщини
});
// Оновлюємо текст при зміні значення шкали
lineWidthInput.addEventListener('input', function () {
	lineWidthValue.textContent = lineWidthInput.value;
});


function toggleSave() {
	SaveName.classList.add('active');
}



saveButton.addEventListener('click', () => {
	const input = document.getElementById("nameInput");
	const newName = input.value.trim();
	const error = document.querySelector('.error-save');

	// Видаляємо повідомлення про помилку, якщо воно існує
	if (error) {
		error.remove();
	}

	// Перевіряємо, чи редагуємо існуючий малюнок
	if (editingImage && newName !== "") {

		editingDrawing().then(() => {
			// Якщо оновлення успішне, оновлюємо назву в DOM




			// Прибираємо активний клас і очищуємо інпут
			SaveName.classList.remove('active');


			history.push(canvas.toDataURL());

		})


	} else if (newName !== "") {
		// Якщо не редагуємо, зберігаємо новий малюнок
		saveNewDrawing();
		SaveName.classList.remove('active');
		editingImage = true;
	} else if (newName) {


	}

	else {
		// Якщо поле вводу порожнє, показуємо помилку
		const errorMessage = document.createElement('p');
		errorMessage.classList.add('error-save');
		errorMessage.innerText = "Треба написати назву!";

		// Видаляємо попередні повідомлення про помилки
		const existingError = block.querySelector('.error-save');
		if (existingError) {
			existingError.remove();
		}

		// Додаємо нове повідомлення про помилку
		block.appendChild(errorMessage);
	}
});
let block = document.getElementById('block-name');
// Функція для створення мітки
function createLabel() {
	const input = document.getElementById("nameInput");
	const text = input.value.trim();

	// Якщо поле порожнє, повертаємо помилку
	if (text === "") {
		const error = document.createElement('p');
		error.classList.add('error-save'); // Клас для стилізації
		error.innerText = "Треба написати назву!";

		// Видаляємо попередні повідомлення про помилки
		const existingError = block.querySelector('.error-save');
		if (existingError) {
			existingError.remove();
		}

		// Додаємо нове повідомлення про помилку
		block.appendChild(error);

		// Повертаємо об'єкт з помилкою
		return { success: false, message: "Треба написати назву!" };
	}

	// Якщо поле не порожнє, створюємо мітку
	const label = document.createElement('p');
	label.classList.add('drawing-label'); // Клас для стилізації
	label.textContent = text;

	// Повертаємо об'єкт з міткою
	return { success: true, label: label, text: text };
}
document.addEventListener('click', (e) => {
	if (SaveName.classList.contains('active') && SaveName.contains(e.target) && !block.contains(e.target)) {
		SaveName.classList.remove('active');
	}

});

function toggleNewDraw() {
	const input = document.getElementById("nameInput");
	localStorage.removeItem('draw_id');

	// Очистка canvas після збереження
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	input.value = "";
	history = [];
	redoStack = [];
	editingImage = false;

	const priceInput = document.getElementById("toyPrice");
	const newPrice = 0;

	// Оновлюємо атрибут і значення
	priceInput.setAttribute("data-price", newPrice);
	priceInput.value = `${newPrice} грн`;
	document.querySelector(".go-to-cart").classList.remove('active');
	document.getElementById('order__btn').classList.remove('no-active');
	document.querySelector(".add-to-cart").classList.add('no-active');
	document.querySelector(".processing-price").classList.add('no-active');
	blockedScale.classList.remove('active');
}

function saveNewDrawing() {
	const imageData = canvas.toDataURL('image/png');  // Отримуємо Base64-дані з canvas
	const login = localStorage.getItem('login');  // Отримуємо login з локального сховища

	if (!login) {
		console.error('Немає login користувача!');
		alert('Будь ласка, увійдіть в систему для збереження малюнка.');
		return;
	}

	// Створення мітки
	const labelResult = createLabel();

	// Якщо мітку не вдалося створити (порожнє поле), припиняємо виконання
	if (!labelResult.success) {
		console.error(labelResult.message); // Виводимо повідомлення про помилку
		return;
	}

	const labelText = labelResult.text; // Отримуємо текст мітки

	// Відправка login на сервер для отримання user_id
	fetch('http://localhost:3000/get-user-id', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ login: login })
	})
		.then(response => {
			if (!response.ok) {
				throw new Error('Помилка мережі або сервера');
			}
			return response.json();
		})
		.then(userResponse => {
			if (!userResponse.success) {
				console.error('Не вдалося отримати user_id:', userResponse.message);
				alert('Не вдалося отримати user_id. Спробуйте ще раз.');
				return;
			}

			const user_id = userResponse.user_id; // Отримуємо user_id

			const data = {
				image_data: imageData, // Base64-кодоване зображення
				label: labelText, // Мітка малюнка
				user_id: user_id // Отриманий user_id
			};

			// Відправка запиту на сервер
			return fetch('http://localhost:3000/save-drawing', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data)
			});
		})
		.then(response => {
			if (!response.ok) {
				throw new Error('Помилка мережі або сервера');
			}
			return response.json();
		})
		.then(saveDrawResponse => {
			if (!saveDrawResponse.success) {
				console.error('Помилка збереження малюнка:', saveDrawResponse.message);
				alert('Помилка збереження малюнка. Спробуйте ще раз.');
				return;
			}

			alert('Малюнок успішно збережено!');

			// Додаємо малюнок на сторінку
			const savedItem = document.createElement('div');
			savedItem.style.textAlign = 'center';
			savedItem.style.backgroundColor = "rgb(202, 62, 20)";
			savedItem.style.borderRadius = '5px';
			savedItem.style.width = '160px';

			const img = document.createElement('img');
			img.src = imageData; // Використовуємо Base64-дані
			img.style.border = '1px solid #ccc';
			img.style.borderRadius = '5px';
			img.style.width = '150px';
			img.style.height = 'auto';
			img.style.backgroundColor = "white";

			savedItem.appendChild(labelResult.label);
			savedItem.appendChild(img);


			// Додавання кнопок редагування та видалення
			const editButton = createEditButton(img, labelResult.label);
			const deleteButton = createDeleteButton(savedItem);

			const buttonContainer = document.createElement('div');
			buttonContainer.style.display = 'flex';
			buttonContainer.appendChild(editButton);
			buttonContainer.appendChild(deleteButton);

			savedItem.appendChild(buttonContainer);

			if (savedImagesContainer) {
				savedImagesContainer.appendChild(savedItem);
			} else {
				console.error('Елемент savedImagesContainer не знайдено!');
			}

			// Отримуємо draw_id після збереження малюнка
			return fetch('http://localhost:3000/get-draw-id', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ image_data: img.src }) // Відправляємо Base64
			});
		})
		.then(response => {
			if (!response.ok) {
				throw new Error(`Помилка: ${response.status} ${response.statusText}`);
			}
			return response.json();
		})
		.then(getDrawResponse => {
			console.log('Сервер відповів:', getDrawResponse);

			if (getDrawResponse.success && getDrawResponse.id_draw) {
				const draw_id = getDrawResponse.id_draw;
				console.log('Отримано draw_id:', draw_id);

				// Зберігаємо draw_id у localStorage
				localStorage.setItem('draw_id', draw_id);

				alert('Отримано draw_id: ' + draw_id);
			} else {
				alert('Не вдалося знайти зображення у базі даних.');
			}
		})
		.catch(error => {
			console.error('Помилка при відправленні на сервер:', error);
			alert('Помилка при відправленні на сервер. Спробуйте ще раз.');
		});
}

async function editingDrawing() {
	const user_id = localStorage.getItem('user_id');
	const newInput = document.getElementById("nameInput");
	const newText = newInput.value.trim();
	const imageData = canvas.toDataURL('image/png');
	const id_draw = localStorage.getItem('draw_id');
	const data = {
		image_data: imageData, // Base64-кодоване зображення
		label: newText, // Мітка малюнка
		id_draw: id_draw // Отриманий draw_id
	};

	try {
		const response = await fetch(`http://localhost:3000/update-drawing`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data)
		});

		if (response.ok) {
			const responseData = await response.json();
			console.log('Малюнок успішно оновлений:', responseData);
		} else {
			console.error('Помилка оновлення малюнка:', response.statusText);
		}
	} catch (error) {
		console.error('Помилка при запиті:', error);
	}

	loadUserDrawings(user_id);

}


function createEditButton() {
	const editButton = document.createElement('button');
	editButton.classList.add('_icon-edit');
	editButton.style.backgroundColor = "transparent";
	editButton.style.color = 'white';
	editButton.style.display = 'inline-block';
	editButton.style.padding = '10px';
	editButton.style.fontSize = '1.2rem';
	editButton.style.borderRight = '1px solid white';
	editButton.style.borderTopRightRadius = '0';
	editButton.style.borderBottomRightRadius = '0';
	editButton.style.width = "50%";


	editButton.addEventListener('click', async () => { // Додаємо async
		editingImage = true;

		const buttonContainer = editButton.closest('div'); // Найближчий div, що містить кнопку

		// Знаходимо батьківський блок, що містить зображення
		const imageContainer = buttonContainer.parentNode; // Отримуємо батьківський div, що містить img

		// Тепер знаходимо зображення всередині цього контейнера
		const img = imageContainer.querySelector('img');


		// Перевіряємо, чи є Base64-дані в src
		let base64Image = img.src;




		try {
			const response = await fetch('http://localhost:3000/get-draw-id', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ image_data: base64Image }) // Відправляємо Base64
			});

			if (!response.ok) {
				throw new Error(`Помилка: ${response.status} ${response.statusText}`);
			}
			const minSize = document.querySelector('.size__min');
			const middleSize = document.querySelector('.size__middle');
			const maxSize = document.querySelector('.size__large');
			const commonType = document.querySelector('.common');
			const puffinessType = document.querySelector('.puffiness');

			const responseData = await response.json();
			console.log('Сервер відповів:', responseData);

			if (responseData.success && responseData.id_draw) {
				const draw_id = responseData.id_draw;
				console.log('Отримано draw_id:', draw_id);

				// Зберігаємо draw_id у localStorage або використовуємо далі
				localStorage.setItem('draw_id', draw_id);
				if (responseData.evaluation) {
					if (responseData.evaluation === "оцінюється") {
						document.querySelector(".go-to-cart").classList.remove('active');
						document.getElementById('order__btn').classList.add('no-active');
						document.querySelector(".add-to-cart").classList.add('no-active');
						document.querySelector(".processing-price").classList.remove('no-active');
						blockedScale.classList.add('active');
						checkPrice();
					} else if (responseData.evaluation === "оцінено") {
						document.querySelector(".go-to-cart").classList.remove('active');
						document.querySelector(".processing-price").classList.add('no-active');
						document.getElementById('order__btn').classList.add('no-active');
						document.querySelector(".add-to-cart").classList.remove('no-active');
						blockedScale.classList.add('active');

						checkPrice();

					}
				} else {
					document.querySelector(".go-to-cart").classList.remove('active');
					document.getElementById('order__btn').classList.remove('no-active');
					document.querySelector(".add-to-cart").classList.add('no-active');
					document.querySelector(".processing-price").classList.add('no-active');
					commonType.classList.remove('active')
					puffinessType.classList.remove('active')
					minSize.classList.remove('active')
					middleSize.classList.remove('active')
					maxSize.classList.remove('active')

					blockedScale.classList.remove('active');
				}
				if (responseData.size) {

					if (responseData.size == "Маленька") {
						minSize.classList.add('active')
						middleSize.classList.remove('active')
						maxSize.classList.remove('active')
					} else if (responseData.size == "Середня") {
						minSize.classList.remove('active')
						middleSize.classList.add('active')
						maxSize.classList.remove('active')
					} else if (responseData.size == "Велика") {
						minSize.classList.remove('active')
						middleSize.classList.remove('active')
						maxSize.classList.add('active')
					}
				}
				if (responseData.type) {

					if (responseData.type == "Звичайні нитки") {
						commonType.classList.add('active')
						puffinessType.classList.remove('active')
					} else if (responseData.type == "Пухнасті нитки") {
						commonType.classList.remove('active')
						puffinessType.classList.add('active')
					}
				}
				alert('Отримано draw_id: ' + draw_id);
			} else {
				alert('Не вдалося знайти зображення у базі даних.');
			}
		} catch (error) {
			console.error('Помилка відправки зображення на сервер:', error);
			alert('Виникла помилка при пошуку зображення.');
		}
		// Завантажуємо зображення на canvas
		const imgToEdit = new Image();
		imgToEdit.src = img.src;
		console.log('Стан збережено, кількість записів:', history.length);
		imgToEdit.onload = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(imgToEdit, 0, 0, canvas.width, canvas.height);
			history = [];
			redoStack = [];

			history.push(canvas.toDataURL());
		};

		// Оновлюємо поле введення мітки
		const input = document.getElementById("nameInput");
		if (input) {
			input.value = img.dataset.label || '';
		}

		const priceInput = document.getElementById("toyPrice");
		const newPrice = 0;

		// Оновлюємо атрибут і значення
		priceInput.setAttribute("data-price", newPrice);
		priceInput.value = `${newPrice} грн`;

	});

	return editButton;
}


// function loadUserDrawings(user_id) {
// 	const token = localStorage.getItem('token');
// 	if (!token) {
// 		console.error('Токен не знайдено');
// 		redirectToLogin();
// 		return;
// 	}
// 	fetch('http://localhost:3000/get-user-drawings', {
// 		method: 'POST',
// 		headers: {
// 			'Content-Type': 'application/json',
// 		},
// 		body: JSON.stringify({ user_id: user_id })
// 	})
// 		.then(response => {
// 			if (!response.ok) {
// 				throw new Error('Помилка мережі або сервера');
// 			}
// 			return response.json();
// 		})
// 		.then(responseData => {
// 			if (responseData.success) {
// 				const drawings = responseData.drawings;

// 				// Очистити контейнер перед додаванням нових малюнків
// 				savedImagesContainer.innerHTML = '';

// 				// Додати кожен малюнок на сторінку
// 				drawings.forEach(drawing => {
// 					const savedItem = document.createElement('div');
// 					savedItem.style.textAlign = 'center';
// 					savedItem.style.backgroundColor = "rgb(202, 62, 20)";
// 					savedItem.style.borderRadius = '5px';
// 					savedItem.style.width = '160px';

// 					const img = document.createElement('img');
// 					if (drawing.image_data.startsWith('data:image/png;base64,')) {
// 						img.src = drawing.image_data;  // Якщо у базі вже є префікс, використовуємо як є
// 					} else {
// 						img.src = `data:image/png;base64,${drawing.image_data}`;  // Додаємо префікс, якщо його немає
// 					}
// 					img.dataset.label = drawing.label;
// 					img.style.border = '1px solid #ccc';
// 					img.style.borderRadius = '5px';
// 					img.style.width = '150px';
// 					img.style.height = 'auto';
// 					img.style.backgroundColor = "white";

// 					const label = document.createElement('div');
// 					label.textContent = drawing.label;
// 					label.style.color = 'white';
// 					label.style.marginBottom = '5px';
// 					label.style.marginTop = '5px';

// 					savedItem.appendChild(label);
// 					savedItem.appendChild(img);

// 					// Додавання кнопок редагування та видалення
// 					const editButton = createEditButton();
// 					const deleteButton = createDeleteButton(savedItem, drawing.id_draw);

// 					const buttonContainer = document.createElement('div');
// 					buttonContainer.style.display = 'flex';
// 					buttonContainer.appendChild(editButton);
// 					buttonContainer.appendChild(deleteButton);

// 					savedItem.appendChild(buttonContainer);
// 					savedImagesContainer.appendChild(savedItem);

// 				});
// 			} else {
// 				console.error('Не вдалося завантажити малюнки:', responseData.message);
// 			}
// 		})
// 		.catch(error => {
// 			console.error('Помилка при завантаженні малюнків:', error);
// 		});
// }

function loadUserDrawings() {
	// Перевірка токена
	fetch('http://localhost:3000/check-token', {
		method: 'GET',
		credentials: 'same-origin'  // Додає куки до запиту
	})
		.then(response => response.json())
		.then(data => {
			if (data.message === 'Токен валідний') {


				// Тепер використовуємо токен і userId для завантаження малюнків
				fetch('http://localhost:3000/get-user-drawings', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${data.token}`  // Додаємо токен до заголовків
					},
					body: JSON.stringify({ user_id: data.userId })  // Використовуємо user_id з токена
				})
					.then(response => {
						if (!response.ok) {
							throw new Error('Помилка мережі або сервера');
						}
						return response.json();
					})
					.then(responseData => {
						if (responseData.success) {
							const drawings = responseData.drawings;

							// Очистити контейнер перед додаванням нових малюнків
							savedImagesContainer.innerHTML = '';

							// Додати кожен малюнок на сторінку
							drawings.forEach(drawing => {
								const savedItem = document.createElement('div');
								savedItem.style.textAlign = 'center';
								savedItem.style.backgroundColor = "rgb(202, 62, 20)";
								savedItem.style.borderRadius = '5px';
								savedItem.style.width = '160px';

								const img = document.createElement('img');
								if (drawing.image_data.startsWith('data:image/png;base64,')) {
									img.src = drawing.image_data;
								} else {
									img.src = `data:image/png;base64,${drawing.image_data}`;
								}
								img.dataset.label = drawing.label;
								img.style.border = '1px solid #ccc';
								img.style.borderRadius = '5px';
								img.style.width = '150px';
								img.style.height = 'auto';
								img.style.backgroundColor = "white";

								const label = document.createElement('div');
								label.textContent = drawing.label;
								label.style.color = 'white';
								label.style.marginBottom = '5px';
								label.style.marginTop = '5px';

								savedItem.appendChild(label);
								savedItem.appendChild(img);

								// Додавання кнопок редагування та видалення
								const editButton = createEditButton();
								const deleteButton = createDeleteButton(savedItem, drawing.id_draw);

								const buttonContainer = document.createElement('div');
								buttonContainer.style.display = 'flex';
								buttonContainer.appendChild(editButton);
								buttonContainer.appendChild(deleteButton);

								savedItem.appendChild(buttonContainer);
								savedImagesContainer.appendChild(savedItem);
							});
						} else {
							console.error('Не вдалося завантажити малюнки:', responseData.message);
						}
					})
					.catch(error => {
						console.error('Помилка при завантаженні малюнків:', error);
					});
			} else {
				console.log('Токен не валідний:', data.message);
			}
		})
		.catch(error => {
			console.error('Помилка при перевірці токена:', error);
		});
}

function createDeleteButton(savedItem, drawingId) {
	const deleteButton = document.createElement('button');
	deleteButton.classList.add('_icon-trash');
	deleteButton.style.width = "50%";
	deleteButton.style.backgroundColor = "transparent";
	deleteButton.style.color = 'white';
	deleteButton.style.display = 'inline-block';
	deleteButton.style.padding = '10px';
	deleteButton.style.fontSize = '1.2rem';

	deleteButton.addEventListener('click', () => {
		if (confirm('Ви впевнені, що хочете видалити цей малюнок?')) {
			savedItem.remove();
			// Перевіряємо, чи drawingId має значення
			if (!drawingId) {
				console.error('Помилка: drawingId не визначений');
				return;
			}

			// Надсилаємо запит на сервер для видалення малюнка з бази даних
			fetch('http://localhost:3000/delete-drawing', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ drawing_id: drawingId }) // Відправляємо ID малюнка
			})
				.then(response => {
					if (!response.ok) {
						throw new Error('Не вдалося видалити малюнок з бази даних');
					}
					return response.json();
				})
				.then(responseData => {
					if (responseData.success) {
						// Якщо сервер успішно видалив малюнок, видаляємо його з UI
						savedItem.remove();
					} else {
						console.error('Не вдалося видалити малюнок:', responseData.message);
					}
				})
				.catch(error => {
					console.error('Помилка при видаленні малюнка:', error);
				});
		}
	});

	return deleteButton;
}



function updateUndoRedoButtons() {
	document.getElementById('undo').disabled = history.length <= 0; // Блокуємо, якщо немає станів для скасування
	document.getElementById('redo').disabled = redoStack.length === 0; // Блокуємо, якщо немає станів для повторення
}

history.push(canvas.toDataURL());
updateUndoRedoButtons();

// Додавання нового стану в історію
function saveState() {


	// Якщо ліміт перевищено, видаляємо найстаріший стан
	if (history.length > undoLimit) {
		history.shift();
	}

	redoStack = []; // Очищаємо стек повторення
	updateUndoRedoButtons(); // Оновлюємо кнопки
}

// Скасування (Undo)
function undoAction() {
	if (history.length > 1) { // Має бути хоча б один стан для повернення
		redoStack.push(history.pop()); // Переміщаємо поточний стан до redoStack
		const img = new Image();
		img.src = history[history.length - 1]; // Відновлюємо попередній стан
		img.onload = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаємо canvas
			ctx.drawImage(img, 0, 0); // Малюємо попередній стан
		};
	}
	updateUndoRedoButtons(); // Оновлюємо стан кнопок
}

// Обробка комбінації клавіш Ctrl + Z для Undo
document.addEventListener('keydown', function (event) {
	if (event.ctrlKey && event.key === 'z') {
		event.preventDefault(); // Перешкоджаємо стандартній поведінці браузера
		undoAction(); // Викликаємо одну й ту саму функцію для скасування дії
	}
});

// Додавання слухача події для кнопки Undo (тільки один раз)
document.getElementById('undo').addEventListener('click', undoAction);


// Кнопка "Вперед" (Redo)
function redoAction() {
	if (redoStack.length > 0) {
		// Відновлюємо стан зі стеку повторення
		const nextState = redoStack.pop();
		history.push(nextState);

		console.log('Повернуто, кількість записів:', history.length);

		// Очищаємо полотно і малюємо відновлений стан
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		const img = new Image();
		img.src = nextState;
		img.onload = () => ctx.drawImage(img, 0, 0);
	}
}

// Кнопка "Вперед" (Redo) викликає redoAction()
document.getElementById('redo').addEventListener('click', () => {
	redoAction(); // Викликаємо одну й ту саму функцію для кнопки "Вперед"
});
// непрацюють undo redo якщо немає куди повторювати, чи повертати


// Очищення Canvas
clearButton.addEventListener('click', () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	history.push(canvas.toDataURL()); // Зберігаємо новий стан
	redoStack = []; // Очищаємо redoStack
	updateUndoRedoButtons();
});


// Заливка

function toggleFill() {
	fillButton.addEventListener('click', () => {
		console.log('включена заливка')
		toggleActiveButton(fillButton, eraser, penButton, hendButton);
		isDrawing = false;
		isErasing = false;
		isFilling = true;
		fillButton.textContent = 'Увімкнута заливка';
		canvas.style.cursor = "	crosshair";
	});
}

// Перевірка збігу кольорів з урахуванням толерантності
const isColorMatch = (r, g, b, a, tr, tg, tb, ta, tolerance = 20) =>
	Math.abs(r - tr) <= tolerance &&
	Math.abs(g - tg) <= tolerance &&
	Math.abs(b - tb) <= tolerance &&
	Math.abs(a - ta) <= tolerance;


// Алгоритм заливки (flood-fill) на основі черги
function floodFill(x, y, targetColor, newColor) {
	// Перевірка: якщо цільовий колір збігається з новим
	if (targetColor.join() === newColor.join()) {
		console.log("Цільовий колір збігається з новим кольором. Заливка не потрібна.");
		return;
	}
	isFillingInProgress = true;
	const queue = [{ x, y }]; // Використовуємо чергу замість стеку
	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	const data = imageData.data;

	const pixelIndex = (x, y) => (y * canvas.width + x) * 4;

	// Масив для відстеження відвіданих пікселів
	const visited = new Set();

	while (queue.length) {
		const { x, y } = queue.shift(); // Беремо елемент із початку черги

		// Перевіряємо межі canvas
		if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;

		const idx = pixelIndex(x, y);

		// Унікальний ключ для збереження пікселя в `visited`
		const pixelKey = `${x},${y}`; // Правильний варіант

		if (visited.has(pixelKey)) continue; // Пропускаємо, якщо піксель уже оброблено
		visited.add(pixelKey);

		// Перевіряємо, чи збігається колір пікселя з цільовим
		if (isColorMatch(data[idx], data[idx + 1], data[idx + 2], data[idx + 3], ...targetColor)) {
			// Змінюємо колір пікселя
			data[idx] = newColor[0];
			data[idx + 1] = newColor[1];
			data[idx + 2] = newColor[2];
			data[idx + 3] = newColor[3];

			// Додаємо сусідні пікселі в чергу
			queue.push({ x: x + 1, y });
			queue.push({ x: x - 1, y });
			queue.push({ x, y: y + 1 });
			queue.push({ x, y: y - 1 });

		}
	}


	ctx.putImageData(imageData, 0, 0);
	isFillingInProgress = false;



}


function dualFloodFill(x, y, targetColor, newColor) {
	// Перший етап: звичайна заливка
	floodFill(x, y, targetColor, newColor, 50);

	// Другий етап: обробка межових областей
	floodFill(x, y, targetColor, newColor, 250); // Вищий рівень толерантності
}

canvas.addEventListener('click', (e) => {
	if (isFilling && !isFillingInProgress) { // Перевіряємо, що заливка ще не виконується
		const x = e.offsetX;
		const y = e.offsetY;

		// Отримуємо поточний колір пікселя під курсором
		const imageData = ctx.getImageData(x, y, 1, 1);
		const targetColor = Array.from(imageData.data);

		// Формуємо новий колір заливки
		const newColor = [
			parseInt(fillColor.slice(1, 3), 16), // R
			parseInt(fillColor.slice(3, 5), 16), // G
			parseInt(fillColor.slice(5, 7), 16), // B
			255                                // A
		];
		dualFloodFill(x, y, targetColor, newColor);
		// Логування для діагностики
		console.log("Цільовий колір при кліку:", targetColor);
		console.log("Новий колір:", newColor);

		// Перевіряємо, чи піксель вже має колір заливки
		if (targetColor.join() === newColor.join()) {
			console.log("Цей піксель вже залито цим кольором. Нічого не змінюємо.");
			return; // Зупиняємо функцію
		}

		history.push(canvas.toDataURL());
		console.log("Заливка збережена у стеку, записів в історії:", history.length);

	}
});

// Початкова заливка полотна білим кольором

ctx.fillStyle = 'transparent';
ctx.fillRect(0, 0, canvas.width, canvas.height);
togglePen();
toggleEraser();
toggleFill();


const BtnInfo = document.getElementById('btn-common');

// Функції для відкриття меню
function InfoCommon() {
	MenuInfoFirst.classList.add('active');
	MenuInfoSecond.classList.remove('active');
}

function InfoPuffiness() {
	MenuInfoSecond.classList.add('active');
	MenuInfoFirst.classList.remove('active');
}

document.addEventListener('click', (e) => {
	if (MenuInfoFirst.classList.contains('active') && MenuInfoFirst.contains(e.target) && !BtnInfo.contains(e.target)) {
		MenuInfoFirst.classList.remove('active');

	}
});
document.addEventListener('click', (e) => {
	if (MenuInfoFirst.classList.contains('active') && !MenuInfoFirst.contains(e.target) && !BtnInfo.contains(e.target)) {
		MenuInfoFirst.classList.remove('active');

	}
});
document.addEventListener('click', (e) => {
	if (MenuInfoSecond.classList.contains('active') && !MenuInfoSecond.contains(e.target) && !BtnInfo.contains(e.target)) {
		MenuInfoSecond.classList.remove('active');
	}
});
document.addEventListener('click', (e) => {
	if (MenuInfoSecond.classList.contains('active') && MenuInfoSecond.contains(e.target) && !BtnInfo.contains(e.target)) {
		MenuInfoSecond.classList.remove('active');
	}
});


const sliderTrack = document.getElementById("slider-track");
const slides = document.querySelectorAll(".examples__small");

// Отримуємо ширину слайда + його margin
const slideWidth = slides[0].offsetWidth
	+ parseInt(window.getComputedStyle(slides[0]).marginRight);

let currentIndex = 0;
let autoScroll;

function moveSlider() {
	sliderTrack.style.transform = `translateX(-${currentIndex * 281}px)`;
	sliderTrack.style.transition = "transform 0.5s ease-in-out"; // Плавний перехід
}

// Автоматична прокрутка
function startAutoScroll() {
	autoScroll = setInterval(() => {
		currentIndex++;

		// Правильне обнулення при досягненні кінця (без стрибків)
		if (currentIndex >= slides.length) {
			setTimeout(() => {
				sliderTrack.style.transition = "none"; // Вимикаємо анімацію, щоб уникнути стрибка
				currentIndex = 0;
				sliderTrack.style.transform = `translateX(0px)`;

				// Через 50 мс знову вмикаємо плавний перехід
				setTimeout(() => {
					sliderTrack.style.transition = "transform 0.5s ease-in-out";
				}, 50);
			}, 500); // Час має відповідати анімації (0.5s)
		} else {
			moveSlider();
		}
	}, 3000);
}

// Запуск анімації з правильного положення
moveSlider();
startAutoScroll();


ZoomBtn.forEach(ZoomBtn => {
	ZoomBtn.addEventListener('click', () => {
		clearInterval(autoScroll);
		const container = ZoomBtn.closest('.conteiner-imagen'); // Знаходимо контейнер
		const image = container.querySelector('img'); // Отримуємо відповідне зображення

		if (image) {
			largeImage.src = image.src; // Встановлюємо його у модальному вікні
			modal.classList.add('active'); // Додаємо клас для анімації
		}
	});
});

// Закриття модального вікна при натисканні кнопки
closeButtonModal.addEventListener('click', () => {
	startAutoScroll();
	modal.classList.remove('active');

});

// Закриття при кліку поза модальним вікном
document.addEventListener('click', (e) => {
	if (modal.classList.contains('active') && !e.target.closest('.modal-content') && !e.target.closest('._icon-increase')) {
		modal.classList.remove('active');
		startAutoScroll();
	}

});


