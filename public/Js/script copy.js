//переклад
const langToggle = document.getElementById('lang-toggle');
const langOptions = document.getElementById('lang-options');

//Реєстрація
const SignUp = document.getElementById('sign-up-first')
const SignUp2 = document.getElementById('sign-up')
const closeButtonReg = document.getElementById('close-button-reg-first')
const closeButtonReg2 = document.getElementById('close-button-reg')
const BtnReg = document.getElementById('btn-reg')
const BtnRegBurg = document.getElementById('btn-reg2')
const togglePassword = document.getElementById('togglePassword-first');
const togglePassword2 = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password-input-first');
const passwordInput2 = document.getElementById('password-input');
const eye = document.getElementById('eye-first');
const eye2 = document.getElementById('eye');

//велика картинка
const ZoomBtn = document.querySelectorAll('._icon-increase');
const modal = document.getElementById('imageModal');
const largeImage = document.getElementById('largeImage');
const closeButtonModal = document.getElementById('close-button-modal')

//корзина
const cartModal = document.querySelector(".cart-modal");
const closeButtonCart = document.getElementById("close-btn-cart");
//Купівля


let currentLang = 'uk';



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

const observer = new MutationObserver(() => {
	const langToggle = document.querySelector('#lang-toggle');
	const langOptions = document.querySelector('#lang-options');

	if (langToggle && langOptions) {
		langToggle.addEventListener('click', () => {
			langOptions.classList.toggle('hidden');
		});

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

		observer.disconnect();
	}
});

observer.observe(document.getElementById('header-container'), { childList: true });


// Показ/приховування списку мов
langToggle.addEventListener('click', () => {
	langOptions.classList.toggle('hidden'); // Перемикаємо клас hidden
});

// Вибір мови
langOptions.addEventListener('click', (e) => {
	if (e.target.tagName === 'BUTTON') {
		const selectedLang = e.target.dataset.langChoice;
		if (selectedLang && translations[selectedLang]) {
			currentLang = selectedLang;
			translatePage(currentLang);
			langOptions.classList.add('hidden'); // Приховуємо список мов після вибору
		}
	}
});

// переклад
translatePage(currentLang);





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


// Закриття при кліку за межі вікна
window.addEventListener("click", (event) => {
	if (event.target === cartModal) {
		cartModal.classList.remove('active');
	}
});




function CloseConfirm() {
	document.querySelector('.conteiner-confirm').classList.remove('active');
}




const cart = JSON.parse(localStorage.getItem("cart")) || [];

updateCartUI()


function CloseConfirm() {
	document.querySelector('.conteiner-confirm').classList.remove('active');
}


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


function updateUI(data) {
	const priceInput = document.getElementById("toyPrice");
	const newPrice = data.price; // Припускаємо, що ціна міститься в полі "price"

	// Оновлюємо атрибут і значення
	priceInput.setAttribute("data-price", newPrice);
	priceInput.value = `${newPrice} грн`;

}





document.getElementById("view-cart").addEventListener("click", function () {
	showCart();
});



function addToCart(name, size, thread_type) {
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


function showCart() {
	const cartContainer = document.getElementById("cart-container");
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
	const item = cart[index];
	const priceElement = document.querySelectorAll(".price-cart")[index];
	priceElement.textContent = (item.quantity * item.price).toFixed(2);
}

// Функція для видалення товару
window.removeFromCart = function (index) {
	cart.splice(index, 1);
	localStorage.setItem("cart", JSON.stringify(cart));
	showCart();

	alert('Видаляє');

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

				SignUp.classList.remove('active');
				SignUp2.classList.remove('active');

			} else {
				console.log('Токен не валідний');
			}
		})
		.catch(error => {
			console.error('Помилка при перевірці токена:', error);
		});
});



async function loadProducts() {

	try {
		const response = await fetch('http://localhost:3000/api/products');
		const products = await response.json();
		const container = document.getElementById('products-container');
		products.forEach(product => {
			const productHTML = `
		 <div class="product-card">
			<a href="/product.html?id=${product.product_id}">
			  <img src="${product.image_url}" alt="${product.name}">
			  <div class="product-card-content">
				 <h3>${product.name}</h3>
				 <p>${product.description}</p>
				 <p class="price">${product.price} грн</p>
			  </div>
			</a>
		 </div>
		 `;
			container.insertAdjacentHTML('beforeend', productHTML);
		});
	} catch (error) {
		console.error('Помилка завантаження товарів:', error);
	}
}

// Запустіть функцію після завантаження DOM
document.addEventListener('DOMContentLoaded', loadProducts);

window.addEventListener('popstate', function () {
	const path = window.location.pathname;
	if (path.startsWith('/product/')) {
		const productId = path.split('/')[2];
		loadProductPage(productId);

	}
});

function loadProductPage(productId) {
	// Функція для завантаження детальної інформації про товар
	fetch(`http://localhost:3000/api/products/${productId}`)
		.then(response => response.json())
		.then(product => {
			const productPageHTML = `
			<h1 class="product_name">${product.name}</h1>
			<img src="${product.image_url}" alt="${product.name}">
			<p>${product.description}</p>
			<p class="price">${product.price} грн</p>
			<button class="add-to-cart" data-id="${product.product_id}">Додати в кошик</button>
		 `;
			document.querySelector('.main').innerHTML = productPageHTML;
		})
		.catch(error => {
			console.error('Помилка завантаження товару:', error);
		});

}


