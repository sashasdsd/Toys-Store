const observer = new MutationObserver(() => {
	//переклад
	const langToggle = document.getElementById('lang-toggle');
	const langOptions = document.getElementById('lang-options');

	if (!langToggle || !langOptions) return;

	const translations = {
		uk: {
			title: 'Супер Іграшки',
			home: 'Головна',
			shop: 'Магазин',
			constructor: 'Конструктор',
			faq: 'Про нас',
			cleans: 'Очистити',
			savedraw: 'Зберегти',
			savetex: 'Збережені малюнки',
			eras: 'Стирачка',
			undo: 'Назад',
			tooltipUndo: 'Скасовує останню дію',
			redo: 'Вперед',
			tooltipRedo: 'Повторює останню скасовану дію'
		},
		en: {
			title: 'Super Toys',
			home: 'Home',
			shop: 'Shop',
			constructor: 'Designer',
			faq: 'About Us',
			cleans: "Cleanse ",
			savedraw: 'Save ',
			savetex: 'Saved drawings',
			eras: 'Eraser',
			undo: 'Undo',
			tooltipUndo: 'Undoes the last action',
			redo: 'Redo',
			tooltipRedo: 'Repeats the last undone action',
		}
	};

	let currentLang = 'uk';

	// переклад
	translatePage(currentLang);

	// Функція для перекладу ОДНОГО елемента
	function translateElement(element, lang) {
		const key = element.dataset.lang;
		if (translations[lang] && translations[lang][key]) {
			const translatedText = translations[lang][key];

			// Знаходимо ТЕКСТОВИЙ ВУЗОЛ всередині елемента
			const textNode = Array.from(element.childNodes).find(node => node.nodeType === Node.TEXT_NODE);

			if (textNode) {
				textNode.textContent = translatedText; // Змінюємо ТІЛЬКИ текст
			}
		} else {
			console.warn(`Translation for key '${key}' in language '${lang}' not found.`);
		}
	}

	// Функція для перекладу ВСІЄЇ сторінки (використовує translateElement)
	function translatePage(lang) {
		const elements = document.querySelectorAll('[data-lang]');
		elements.forEach(element => {
			translateElement(element, lang); // Перекладаємо кожен елемент окремо
		});

		document.documentElement.lang = lang;

		// Переклад атрибуту data-tooltip
		const undoButton = document.getElementById('undo');
		const redoButton = document.getElementById('redo');
		if (redoButton) {
			redoButton.setAttribute('data-tooltip', translations[lang].tooltipRedo);
		}
		if (undoButton) {
			undoButton.setAttribute('data-tooltip', translations[lang].tooltipUndo);
		}
	}

	// Обробник для відкриття/закриття меню мов
	langToggle.addEventListener('click', () => {
		langOptions.classList.toggle('hidden');
	});

	// Обробник вибору мови
	langOptions.addEventListener('click', (e) => {
		if (e.target.tagName === 'BUTTON') {
			const selectedLang = e.target.dataset.langChoice;
			if (selectedLang && translations[selectedLang]) {
				currentLang = selectedLang;
				translatePage(currentLang);
				langOptions.classList.add('hidden');
			}
		}
	});





	//Кошик
	updateCartUI()


	document.getElementById("view-cart").addEventListener("click", function () {
		showCart();
	});


	// Бургер
	const burgerMenu = document.getElementById('burger-menu');
	const menuBody = document.querySelector('.menu_body');
	const closeButton = document.getElementById('close-button');
	const contMenu = document.getElementById('conteiner-menu');

	function toggleMenu() {

		menuBody.classList.toggle('open');
		contMenu.classList.toggle('open');

	}
	if (!burgerMenu || !menuBody || !closeButton || !contMenu) return;

	// Показ/приховування меню
	burgerMenu.addEventListener('click', () => {
		console.log('Burger menu clicked');
		burgerMenu.classList.add('active');
		menuBody.classList.add('active');
		contMenu.classList.add('active');
	});

	// Закриття через кнопку
	closeButton.addEventListener('click', () => {
		console.log('Close button clicked');
		menuBody.classList.remove('active');
		burgerMenu.classList.remove('active');
		contMenu.classList.remove('active');
	});

	// Закриття при кліку поза меню
	document.addEventListener('click', (e) => {
		if (
			menuBody.classList.contains('active') &&
			!menuBody.contains(e.target) &&
			!burgerMenu.contains(e.target)
		) {
			console.log('Click outside, closing menu');
			menuBody.classList.remove('active');
			burgerMenu.classList.remove('active');
			contMenu.classList.remove('active');
		}
	});

	// Реєстрація

	const BtnReg = document.getElementById('btn-reg')
	const BtnRegBurg = document.getElementById('btn-reg2')

	document.addEventListener('click', (e) => {
		// Всі кнопки, які відкривають SignUp
		const buttons = [BtnReg, BtnRegBurg];

		// Перевіряємо, чи натискання було на одну з них
		const isButtonClick = buttons.some(button => button.contains(e.target));

		// Перевірка, чи SignUp відкрите, і чи не натиснули на його вміст або на кнопки відкриття
		if ((SignUp.classList.contains('active') || SignUp2.classList.contains('active')) &&
			!SignUp.contains(e.target) &&
			!SignUp2.contains(e.target) &&
			!isButtonClick) {
			console.log('Click outside, closing menu');
			// Закриваємо всі активні вікна
			SignUp.classList.remove('active');
			SignUp2.classList.remove('active');
			document.querySelector('.all_conteiner_reg').classList.remove('active');
		}
	})

	observer.disconnect(); // більше не потрібно спостерігати

});

observer.observe(document.getElementById('header-container'), { childList: true, subtree: true });

fetch('/header.html')
	.then(res => res.text())
	.then(html => {
		document.getElementById('header-container').innerHTML = html;


	});

const BlockedBlock = document.getElementById("blocked-block");
// Отримуємо елементи
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

//малювання
const saveButton = document.getElementById('saveDrawing');
const clearButton = document.getElementById('clearCanvas');
const savedImagesContainer = document.getElementById('savedImages');
const fillButton = document.getElementById('fillButton');
const penButton = document.getElementById('penButton');
const colorPicker = document.getElementById('colorPicker');
const eraser = document.getElementById('eraser');
const lineWidthInput = document.getElementById('lineWidth');
const lineWidthValue = document.getElementById('lineWidthValue');
const container = document.querySelector('.drawing-container1');
//Реєстрація
const SignUp = document.getElementById('sign-up-first')
const SignUp2 = document.getElementById('sign-up')
const closeButtonReg = document.getElementById('close-button-reg-first')
const closeButtonReg2 = document.getElementById('close-button-reg')
const togglePassword = document.getElementById('togglePassword-first');
const togglePassword2 = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password-input-first');
const passwordInput2 = document.getElementById('password-input');
const eye = document.getElementById('eye-first');
const eye2 = document.getElementById('eye');
//Підказка
const MenuInfoFirst = document.getElementById('menu-info-first');
const MenuInfoSecond = document.getElementById('menu-info-second');
//велика картинка
const ZoomBtn = document.querySelectorAll('._icon-increase');
const modal = document.getElementById('imageModal');
const largeImage = document.getElementById('largeImage');
const closeButtonModal = document.getElementById('close-button-modal')
//назва збереження
const SaveName = document.getElementById("saveName");
//корзина
const cartModal = document.querySelector(".cart-modal");
const closeButtonCart = document.getElementById("close-btn-cart");
//Купівля
const orderBtn = document.getElementById("order__btn");
const priceInput = document.getElementById("toyPrice");
//Блокування розміру і типу ниток
const blockedScale = document.getElementById('blocked_scale');
blockedScale.classList.remove('active');
// Ліміт на кількість скасувань
const undoLimit = 25; // Максимальна кількість станів у history

// Налаштовуємо розмір canvas
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// Змінні для малювання
let saveCounter = 0;
let isDrawing = true;
let isErasing = false;
let isDragging = false;
let startX, scrollLeft;
let lastX = 0;
let lastY = 0;
let lastPX = 0;
let lastPY = 0;
let strokeColor = 'rgb(0, 0, 0)'; // Початковий колір
let isFilling = false;
let isFillingInProgress = false; // Відповідає за поточний процес заливки
let fillColor = " ";
let lineWidth = 5; // Початкова товщина лінії
let isMouseDown = false; // Контролює, чи натиснута миша
let isTouchStart = false;
let editingImage = false; // Змінна для редагованого малюнка
let editingLabel = null;

// Масиви для історії дій
let history = [];
let redoStack = [];


// let user_id = localStorage.getItem("user_id") || null;





const sizeButtons = document.querySelectorAll('.size__btn');

// Додаємо обробник події для кожної кнопки
sizeButtons.forEach((button) => {

	button.addEventListener('click', () => {
		// Видаляємо активний стан у всіх кнопок
		sizeButtons.forEach((btn) => btn.classList.remove('active'));
		sizeButtons.forEach((btn) => btn.classList.remove('red-line'));
		// Додаємо активний стан до натиснутої кнопки
		button.classList.add('active');

	});

});



const typeButtons = document.querySelectorAll('.type__btn');

// Додаємо обробник події для кожної кнопки
typeButtons.forEach((button) => {
	button.addEventListener('click', () => {
		// Видаляємо активний стан у всіх кнопок
		typeButtons.forEach((btn) => btn.classList.remove('active'));
		typeButtons.forEach((btn) => btn.classList.remove('red-line'));
		// Додаємо активний стан до натиснутої кнопки
		button.classList.add('active');
	});
});





const isMobile = {
	Android: function () {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerr/i);
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function () {
		return (
			isMobile.Android() ||
			isMobile.BlackBerry() ||
			isMobile.iOS() ||
			isMobile.Opera() ||
			isMobile.Windows());
	}
};

if (isMobile.any()) {
	document.body.classList.add('_touch');
}
else {
	document.body.classList.add('pc');
}

// Виклик вікна реєстрації
function RegMenu() {
	// if (menuBody.classList.contains('active')) {
	// 	menuBody.classList.remove('active');
	// 	burgerMenu.classList.remove('active'); 
	// 	contMenu.classList.remove('active');
	// }

	SignUp2.classList.add('active');
	SignUp.classList.remove('active');
	document.querySelector('.all_conteiner_reg').classList.add('active');
	console.log('Реєстрація');

}

document.getElementById("switch-to-register").addEventListener("click", function () {
	document.getElementById("sign-up").classList.remove('active'); // Сховати форму входу
	document.getElementById("sign-up-first").classList.add('active'); // Показати форму реєстрації
	document.querySelector('.all_conteiner_reg').classList.add('active');

});

// Перехід до входу
document.getElementById("switch-to-login").addEventListener("click", function () {
	document.getElementById("sign-up").classList.add('active'); // Показати форму входу
	document.getElementById("sign-up-first").classList.remove('active'); // Сховати форму реєстрації

});


closeButtonReg.addEventListener('click', () => {
	console.log('Close button clicked');
	SignUp.classList.remove('active');
	document.querySelector('.all_conteiner_reg').classList.remove('active');
});
closeButtonReg2.addEventListener('click', () => {
	console.log('Close button clicked');
	SignUp2.classList.remove('active');
	document.querySelector('.all_conteiner_reg').classList.remove('active');
});



togglePassword2.addEventListener('click', () => {
	const currentType = passwordInput2.getAttribute('type');
	const newType = currentType === 'password' ? 'text' : 'password';
	passwordInput2.setAttribute('type', newType);

	// Змінюємо іконку залежно від типу
	eye2.src = newType === 'password' ? 'img/eye-crossed.svg' : 'img/eye.svg';
});

togglePassword.addEventListener('click', () => {
	const currentType = passwordInput.getAttribute('type');
	const newType = currentType === 'password' ? 'text' : 'password';
	passwordInput.setAttribute('type', newType);

	// Змінюємо іконку залежно від типу
	eye.src = newType === 'password' ? 'img/eye-crossed.svg' : 'img/eye.svg';
});



// Відкрити корзини
function CartMenu() {
	console.log('Cart Button clicked');
	cartModal.classList.add("active");
}


// Закрити корзину
closeButtonCart.addEventListener("click", () => {
	cartModal.classList.remove('active');
});

// Закриття при кліку за межі вікна
window.addEventListener("click", (event) => {
	if (event.target === cartModal) {
		cartModal.classList.remove('active');
	}
});







const cart = JSON.parse(localStorage.getItem("cart")) || [];

document.querySelector(".add-to-cart").classList.add('no-active');
document.querySelector(".processing-price").classList.add('no-active');


document.getElementById('order__btn').addEventListener("click", function () {
	document.querySelector('.conteiner-confirm').classList.add('active');
});
function CloseConfirm() {
	document.querySelector('.conteiner-confirm').classList.remove('active');
}
document.getElementById('order__btn_confirm').addEventListener("click", function () {
	const idDraw = localStorage.getItem('draw_id');
	const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;




	const minSize = document.querySelector('.size__min');
	const middleSize = document.querySelector('.size__middle');
	const maxSize = document.querySelector('.size__large');

	const commonType = document.querySelector('.common');
	const puffinessType = document.querySelector('.puffiness');

	let size = 0;
	let type = 0;

	if (minSize.classList.contains('active')) {

		size = "Маленька";
	} else if (middleSize.classList.contains('active')) {

		size = "Середня";
	}
	else if (maxSize.classList.contains('active')) {

		size = "Велика";
	} else {
		minSize.classList.add('red-line');
		middleSize.classList.add('red-line');
		maxSize.classList.add('red-line');
		if (!commonType.classList.contains('active') && !puffinessType.classList.contains('active')) {
			commonType.classList.add('red-line');
			puffinessType.classList.add('red-line');
		}
		alert("Треба вибрати розмір!");
		document.querySelector('.conteiner-confirm').classList.remove('active');
		return;
	}

	if (commonType.classList.contains('active')) {

		type = "Звичайні нитки";
	} else if (puffinessType.classList.contains('active')) {

		type = "Пухнасті нитки";
	}
	else {
		commonType.classList.add('red-line');
		puffinessType.classList.add('red-line');
		if (!maxSize.classList.contains('active') && !middleSize.classList.contains('active') && !minSize.classList.contains('active')) {
			minSize.classList.add('red-line');
			middleSize.classList.add('red-line');
			maxSize.classList.add('red-line');
		}
		alert("Треба вибрати тип ниток!");
		document
		document.querySelector('.conteiner-confirm').classList.remove('active');
		return;
	}

	if (!pixels.some(channel => channel !== 0)) {
		alert("Треба намалювати");
		document.querySelector('.conteiner-confirm').classList.remove('active');
		return;
	}


	if (idDraw == null) {
		alert("Треба зберегти малюнок");
		document.querySelector('.conteiner-confirm').classList.remove('active');
		return;
	} else {
		async function sendDrawId(idDraw) {
			try {
				const response = await fetch('http://localhost:3000/put-id-draw', {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ id_draw: idDraw, size: size, thread_type: type })
				});

				if (response.ok) {
					const responseData = await response.json();
					alert('Малюнок відправлено на розгляд, почекайте декілька хвилин)');
					console.log('Дані передані на обробку:', responseData);
				} else {
					console.error('Помилка передачі даних:', response.statusText);
				}
			} catch (error) {
				console.error('Помилка мережі:', error);
			}
		}

		sendDrawId(idDraw)
		document.getElementById('order__btn').classList.add('no-active');
		document.querySelector(".processing-price").classList.remove('no-active');
		document.querySelector('.conteiner-confirm').classList.remove('active');
		blockedScale.classList.add('active');
	}
});

async function checkPrice(maxAttempts = 1, delay = 2000) {
	const id_draw = localStorage.getItem('draw_id');

	if (!id_draw) {
		alert('id_draw не знайдено в localStorage!');
		return;
	}

	let attempts = 0;
	while (attempts < maxAttempts) {
		try {
			// Відправка POST-запиту з id_draw у тілі
			const response = await fetch(`http://localhost:3000/check-data`, {
				method: 'POST', // Використовуємо POST-запит
				headers: {
					'Content-Type': 'application/json', // Вказуємо тип вмісту
				},
				body: JSON.stringify({ id_draw: id_draw }), // Передаємо id_draw у тілі
			});

			// Перевірка статусу відповіді
			if (!response.ok) {
				throw new Error(`Помилка: ${response.status} ${response.statusText}`);
			}

			const data = await response.json();
			if (data && data.price !== null) {
				updateUI(data);

				document.querySelector(".processing-price").classList.add('no-active');
				document.querySelector(".add-to-cart").classList.remove('no-active');

				return;
			} else {
				alert('Зачекайте, ще не оцінили');
			}
			attempts++;
			await new Promise(resolve => setTimeout(resolve, delay));

		} catch (err) {
			console.error('Помилка при отриманні даних:', err);
			alert('Сталася помилка при отриманні ціни. Спробуйте пізніше.');
			return;
		}

	}
}
document.getElementById('processing-price').addEventListener("click", function () {
	checkPrice();
});

function updateUI(data) {
	const priceInput = document.getElementById("toyPrice");
	const newPrice = data.price; // Припускаємо, що ціна міститься в полі "price"

	// Оновлюємо атрибут і значення
	priceInput.setAttribute("data-price", newPrice);
	priceInput.value = `${newPrice} грн`;

}



// Додавання в кошик
document.querySelector(".add-to-cart").addEventListener("click", async function () {
	const idDraw = localStorage.getItem('draw_id');

	// Перевірка, чи щось намальовано на canvas (закоментовано у вашому коді)
	// if (!pixels.some(channel => channel !== 0)) {
	// 	alert("Треба намалювати");
	// 	return;
	// }

	// Перевірка, чи збережено малюнок
	// if (idDraw == null) {
	// 	alert("Треба зберегти малюнок");
	// 	return;
	// }


	try {
		const response = await fetch(`http://localhost:3000/get-label`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id_draw: idDraw })
		});

		if (!response.ok) {
			throw new Error(`Помилка: ${response.status} ${response.statusText}`);
		}

		const responseData = await response.json();
		console.log('Сервер відповів:', responseData);

		let name = "Невідома назва"; // Значення за замовчуванням
		let size = null;
		let thread_type = null;
		if (responseData.success && responseData.label) {
			name = responseData.label;
			size = responseData.size;
			thread_type = responseData.thread_type;
			console.log('Отримано назву:', name);
			alert('Отримано назву: ' + name);
		} else {
			alert('Не вдалося знайти зображення у базі даних.');
		}

		// Додавання в кошик
		addToCart(name, size, thread_type);
		showCart();
		CartMenu(); // Показуємо кошик

		// Зміна стану кнопок
		document.querySelector(".add-to-cart").classList.add('no-active');
		document.querySelector(".go-to-cart").classList.add('active');

	} catch (error) {
		console.error('Помилка відправки запиту на сервер:', error);
		alert('Виникла помилка при пошуку назви.');
	}
});




function addToCart(name, size, thread_type) {
	let cart = JSON.parse(localStorage.getItem("cart") || "[]");
	// Отримуємо ціну з елементу priceInput
	let price = priceInput.getAttribute("data-price");
	let id_draw = localStorage.getItem('draw_id');

	// Шукаємо товар з таким самим name у кошику
	const existingItem = cart.find(item => item.name === name);

	if (!existingItem) {
		// Якщо товару немає в кошику, додаємо його
		cart.push({ name, price, quantity: 1, type: 2, size, thread_type, id_draw });
		// , size, thread_type
	} else {
		// Якщо товар вже є в кошику, збільшуємо його кількість
		existingItem.quantity += 1;
	}

	// Зберігаємо оновлений кошик у localStorage
	localStorage.setItem("cart", JSON.stringify(cart));

	// Оновлюємо інтерфейс кошика
	updateCartUI();
}


function updateCartUI() {
	document.getElementById("cart-container").innerHTML = `У кошику: ${cart.length} товарів`;

	document.querySelector(".counted").innerHTML = `${cart.length}`;
	if (document.querySelector(".counted").innerHTML == 1) {
		document.querySelector(".counted").classList.add('active');
	}
	if (document.querySelector(".counted").innerHTML > 1) {
		document.querySelector(".counted").classList.add('active');
	}
}

// відкриття посилання на кошик
document.getElementById("link-to-cart").addEventListener("click", function () {
	showCart();
	CartMenu();
});

const cartContainer = document.getElementById("cart-container");
function showCart() {
	const cart = JSON.parse(localStorage.getItem("cart") || "[]");
	cartContainer.innerHTML = "<h2>Кошик</h2>"; // Очищення перед оновленням
	cartContainer.style.fontSize = "1.5rem";
	cartContainer.style.margin = "40px 0";

	if (cart.length === 0) {
		cartContainer.innerHTML += "<p>Кошик порожній 😞</p>";
		return;
	}

	cart.forEach((item, index) => {
		if (item && item.id_draw) {
			cartContainer.innerHTML += `
	<div class="item-buy-cart">
		<div class="menu-container-cart">
			<p>Кастомна іграшка (${item.name}), ${item.size}, ${item.thread_type}</p>
			<div class="menu-btn-cart">
				<button class="menu-button-cart" onclick="toggleMenuCart(${index})">⋮</button>
				<div class="menu-options-cart" id="menu-${index}">
					<button class="btn-cart-item-remove" onclick="removeFromCart(${index})">Видалити</button>
				</div> 
			</div> 
		</div>
		<div class="quantity-price">
			<button aria-label="Видалити один товар" class="minus-cart" data-index="${index}"><span class="_icon-minus"></span></button>
			<input type="number" value="${item.quantity}" min="0" max="99" step="1" class="inpt-quantity" data-index="${index}">
			<button aria-label="Додати ще один товар" class="plus-cart" data-index="${index}"><span class="_icon-plus"></span></button>
			<p class="price-cart">${(item.quantity * item.price).toFixed(2)}</p><span >₴</span>
		</div>
	</div>
	`;
		}
		else {
			cartContainer.innerHTML += `
		<div class="item-buy-cart">
			<div class="menu-container-cart">
				<p>Магазинна іграшка (${item.name}), ${item.size}, ${item.thread_type}</p>
				<div class="menu-btn-cart">
					<button class="menu-button-cart" onclick="toggleMenuCart(${index})">⋮</button>
					<div class="menu-options-cart" id="menu-${index}">
						<button class="btn-cart-item-remove" onclick="removeFromCart(${index})">Видалити</button>
					</div> 
				</div> 
			</div>
			<div class="quantity-price">
				<button aria-label="Видалити один товар" class="minus-cart" data-index="${index}"><span class="_icon-minus"></span></button>
				<input type="number" value="${item.quantity}" min="0" max="99" step="1" class="inpt-quantity" data-index="${index}">
				<button aria-label="Додати ще один товар" class="plus-cart" data-index="${index}"><span class="_icon-plus"></span></button>
				<p class="price-cart">${(item.quantity * item.price).toFixed(2)}</p><span >₴</span>
			</div>
		</div>
		`;
		}
	});

	// Оновлення кількості і ціни товарів
	document.querySelectorAll(".inpt-quantity").forEach(input => {
		input.addEventListener("input", function () {
			let value = parseInt(this.value) || 0;
			if (value > 99) value = 99;
			if (value < 1) value = 1;
			this.value = value;
			const index = this.getAttribute("data-index");
			cart[index].quantity = value;
			localStorage.setItem("cart", JSON.stringify(cart));
			updatePrice(index);
		});
	});

	// Кнопка "-"
	document.querySelectorAll(".minus-cart").forEach(button => {
		button.addEventListener("click", function () {
			const index = this.getAttribute("data-index");
			let value = cart[index].quantity || 1;
			if (value > 1) {
				cart[index].quantity = value - 1;
				document.querySelectorAll(".inpt-quantity")[index].value = cart[index].quantity;
				localStorage.setItem("cart", JSON.stringify(cart));
				updatePrice(index);
			}
		});
	});

	// Кнопка "+"
	document.querySelectorAll(".plus-cart").forEach(button => {
		button.addEventListener("click", function () {
			const index = this.getAttribute("data-index");
			let value = cart[index].quantity || 1;
			if (value < 99) {
				cart[index].quantity = value + 1;
				document.querySelectorAll(".inpt-quantity")[index].value = cart[index].quantity;
				localStorage.setItem("cart", JSON.stringify(cart));
				updatePrice(index);

			}
		});
	});

}

// Оновлення ціни для кожного товару
function updatePrice(index) {
	const cart = JSON.parse(localStorage.getItem("cart") || "[]");
	const item = cart[index];
	const priceElement = document.querySelectorAll(".price-cart")[index];
	if (item && priceElement) {
		priceElement.textContent = (item.quantity * item.price).toFixed(2);
	}
}


// Функція для видалення товару
window.removeFromCart = function (index) {
	cart.splice(index, 1);
	localStorage.setItem("cart", JSON.stringify(cart));
	showCart();
	if (!orderBtn.classList.contains('no-active')) {
		document.querySelector(".go-to-cart").classList.remove('active');
		document.querySelector(".add-to-cart").classList.remove('active')
		alert('Видаляє');

	} else {
		document.querySelector(".add-to-cart").classList.remove('no-active')
		document.querySelector(".go-to-cart").classList.remove('active');
	}
	document.querySelector(".counted").innerHTML = `${cart.length}`;
	if (document.querySelector(".counted").innerHTML == 0) {
		document.querySelector(".counted").classList.remove('active');
	}
};

// Toggle меню
window.toggleMenuCart = function (index) {
	document.getElementById(`menu-${index}`).classList.toggle("active");
};

// Закриття меню при кліку поза ним
document.addEventListener('click', (event) => {
	const menuOptionCart = document.querySelectorAll('.menu-options-cart');
	const buttonMenuCart = document.querySelectorAll('.menu-button-cart');
	let isClickInside = false;

	buttonMenuCart.forEach((button, index) => {
		if (button.contains(event.target)) {
			isClickInside = true;
		}
	});

	menuOptionCart.forEach((menu) => {
		if (menu.contains(event.target)) {
			isClickInside = true;
		}
	});

	if (!isClickInside) {
		menuOptionCart.forEach((menu) => {
			menu.classList.remove("active");
		});
	}
});

document.getElementById("checkout-btn").addEventListener("click", function () {
	// Отримуємо список товарів з кошика
	const cart = JSON.parse(localStorage.getItem("cart")) || [];

	if (cart.length === 0) {
		alert("Кошик порожній! Додайте товари перед оформленням замовлення.");
		return;
	}    // Зберігаємо в localStorage для сторінки замовлення


	// Переходимо на сторінку оформлення замовлення
	window.location.href = "order.html";
});



// document.getElementById('sign-in').addEventListener('click', async function (event) {
// 	event.preventDefault(); // Запобігає перезавантаженню сторінки

// 	// Отримуємо введені дані з полів форми
// 	const login = document.getElementById('name-input').value;
// 	const password = document.getElementById('password-input').value;

// 	// Створюємо об'єкт з даними для відправки на сервер
// 	const loginData = {
// 		login: login, // Логін користувача
// 		password: password // Пароль користувача
// 	};

// 	try {
// 		// Відправляємо POST запит на сервер для входу
// 		const response = await fetch('http://localhost:3000/login', {
// 			method: 'POST',
// 			headers: {
// 				'Content-Type': 'application/json'
// 			},
// 			body: JSON.stringify(loginData) // Відправляємо дані в JSON форматі
// 		});

// 		const data = await response.json();

// 		if (response.ok) {
// 			document.querySelector('.all_conteiner_reg').classList.remove('active');
// 			// Якщо успішно, зберігаємо токен і закриваємо модальне вікно
// 			alert(data.message); // Виводимо повідомлення про успішний вхід
// 			console.log('Токен:', data.token); // Виводимо токен у консоль для налагодження

// 			// Зберігаємо токен у localStorage
// 			localStorage.setItem('token', data.token);
// 			localStorage.setItem('login', login);
// 			localStorage.setItem('user_id', data.user_id);
// 			loadUserDrawings(data.user_id);
// 			if (!data.token) {
// 				alert('Токен не отримано. Спробуйте ще раз.');
// 				return;
// 			}



// 			// Знімаємо клас active з модального вікна
// 			SignUp.classList.remove('active');
// 			BlockedBlock.classList.add('active');

// 			// Завантажуємо дані користувача


// 		} else {
// 			document.querySelector('.all_conteiner_reg').classList.add('active');
// 			// Якщо помилка
// 			alert(data.message); // Виводимо повідомлення про помилку
// 			BlockedBlock.classList.remove('active');
// 		}
// 	} catch (error) {
// 		console.error('Помилка при запиті:', error);
// 		alert('Сталася помилка при спробі входу!');
// 	}
// });

document.getElementById('sign-in').addEventListener('click', async function (event) {
	event.preventDefault(); // Запобігає перезавантаженню сторінки

	// Отримуємо введені дані з полів форми
	const login = document.getElementById('name-input').value;
	const password = document.getElementById('password-input').value;

	// Створюємо об'єкт з даними для відправки на сервер
	const loginData = {
		login: login,
		password: password
	};

	try {
		// Відправляємо POST запит на сервер для входу
		const response = await fetch('http://localhost:3000/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(loginData)
		});

		const data = await response.json();

		if (response.ok) {
			document.querySelector('.all_conteiner_reg').classList.remove('active');

			// Перевіряємо, чи є повідомлення про успішний вхід
			alert(data.message);

			// Закриваємо модальне вікно
			SignUp2.classList.remove('active');
			BlockedBlock.classList.add('active');
			localStorage.setItem('login', login);
			// Завантажуємо малюнки користувача через токен (без user_id)
			loadUserDrawings(); // Оновлена функція для завантаження малюнків
			location.reload();
		} else {
			document.querySelector('.all_conteiner_reg').classList.add('active');
			alert(data.message);
			BlockedBlock.classList.remove('active');
		}
	} catch (error) {
		console.error('Помилка при запиті:', error);
		alert('Сталася помилка при спробі входу!');
	}
});
// Подія для реєстрації
document.getElementById('sign-in-first').addEventListener('click', async function (event) {
	event.preventDefault(); // Запобігає перезавантаженню сторінки

	// Отримуємо введені дані з полів форми реєстрації
	const login = document.getElementById('name-input-first').value;
	const password = document.getElementById('password-input-first').value;
	const phone = document.getElementById('phone-input-first').value;

	// Створюємо об'єкт з даними для відправки на сервер
	const registerData = {
		login: login,
		password: password,
		phone: phone
	};

	try {
		// Відправляємо POST запит на сервер для реєстрації
		const response = await fetch('http://localhost:3000/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(registerData)
		});

		const data = await response.json();

		if (response.ok) {
			document.querySelector('.all_conteiner_reg').classList.remove('active');
			alert(data.message); // Повідомлення про успішну реєстрацію

			// Якщо реєстрація успішна
			location.reload();
			// Токен буде збережений на сервері у cookie з флагом HttpOnly
			// Замість localStorage, не потрібно зберігати токен на клієнті
			localStorage.setItem('login', login);
			// Виконуємо подальші дії (наприклад, переходимо на іншу сторінку або завантажуємо користувацькі дані)
			SignUp.classList.remove('active');
			BlockedBlock.classList.add('active');


		} else {
			document.querySelector('.all_conteiner_reg').classList.add('active');
			alert(data.message); // Повідомлення про помилку реєстрації
		}
	} catch (error) {
		console.error('Помилка при запиті:', error);
		alert('Сталася помилка при спробі реєстрації!');
	}
});




document.getElementById('blocked-block').addEventListener('click', async function (event) {

	alert('Треба зареєструватись)');


	if (SignUp) { // Перевіряємо, чи існує елемент
		setTimeout(() => {
			if (!SignUp.classList.contains('active')) {
				SignUp.classList.add('active');
				document.querySelector('.all_conteiner_reg').classList.add('active')
			}
		}, 90);
	}


});

// fetch('http://localhost:3000/login', {
// 	method: 'POST',
// 	headers: {
// 		'Content-Type': 'application/json'
// 	},
// 	body: JSON.stringify({ login: 'user', password: 'password' })
// })
// 	.then(response => {
// 		if (!response.ok) {
// 			throw new Error('Network response was not ok');
// 		}
// 		return response.json();
// 	})
// 	.then(data => {
// 		console.log('Успіх:', data);
// 		if (data.success) {
// 			// Зберігаємо user_id у локальному сховищі
// 			localStorage.setItem('user_id', data.user_id);

// 			// Перезавантажуємо сторінку

// 		} else {
// 			console.error('Помилка входу:', data.message);
// 		}
// 	})
// 	.catch((error) => {
// 		console.error('Помилка при запиті:', error);
// 	});

document.addEventListener('DOMContentLoaded', function () {
	// Зробимо запит до серверу для перевірки токена
	fetch('http://localhost:3000/check-token', {
		method: 'GET',
		credentials: 'same-origin'  // Додаємо куки до запиту
	})
		.then(response => response.json())
		.then(data => {
			if (data.message === 'Токен валідний') {


				// Автоматичний вхід — можна показати дані користувача або перенаправити на іншу сторінку
				document.body.classList.add('logged-in'); // Наприклад, додавати клас для показу інформації про користувача
				loadUserDrawings(); // Завантажуємо малюнки користувача (якщо потрібно)
				SignUp.classList.remove('active');
				SignUp2.classList.remove('active');
				BlockedBlock.classList.add('active');
			} else {
				console.log('Токен не валідний');
			}
		})
		.catch(error => {
			console.error('Помилка при перевірці токена:', error);
		});
});




window.addEventListener('beforeunload', () => {

	localStorage.removeItem('draw_id');
});



function updateCartDisplay() {
	const cart = JSON.parse(localStorage.getItem('cart') || '[]');
	const cartCounted = document.getElementById('counted');

	// Оновлення лічильника
	if (cartCounted) {

		cartCounted.textContent = cart.filter(item => item).length;
	}



}

// Ініціалізація
document.addEventListener('DOMContentLoaded', updateCartDisplay);
window.addEventListener('pageshow', (event) => event.persisted && updateCartDisplay());
window.addEventListener('storage', (event) => event.key === 'cart' && updateCartDisplay());
