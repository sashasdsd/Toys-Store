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


// Завантаження даних товару
async function loadProductDetails() {
	const urlParams = new URLSearchParams(window.location.search);
	const productId = urlParams.get('id');

	if (!productId) {
		document.getElementById('product-details').innerHTML = '<p>Товар не знайдено</p>';
		return;
	}

	try {
		const response = await fetch(`http://localhost:3000/api/products/${productId}`);
		if (!response.ok) throw new Error('Товар не знайдено');
		const product = await response.json();
		renderProduct(product);

		localStorage.removeItem('store'); // очищає повністю
		localStorage.setItem('store', JSON.stringify(product));
		localStorage.removeItem("currentCategory");
		const store = JSON.parse(localStorage.getItem("store") || "{}");
		localStorage.setItem("currentCategory", store.category_id);
		loadCategory()

	} catch (error) {
		document.getElementById('product-details').innerHTML = `
			  <p class="error">Помилка: ${error.message}</p>
		 `;
	}
}

// Функція для отримання HEX-коду кольору
function getColorHex(colorName) {
	const colorMap = {
		'червоний': '#ff0000',
		'синій': '#0000ff',
		'зелений': '#00ff00',
		'рожевий': '#ffc0cb',
		'білий': '#ffffff',
		'чорний': '#000000'
	};
	return colorMap[colorName.toLowerCase()] || '#cccccc';
}
let selectedSize = '';
let selectedPrice = '';
// Відображення інформації про товар
function renderProduct(product) {
	const container = document.getElementById('product-details');
	let selectedColor = ''; // Змінна для збереження обраного кольору


	// Якщо колір приходить як рядок, перетворимо його на масив
	const colors = Array.isArray(product.colors) ? product.colors : product.colors.split(', ');
	let sizes = [];
	if (Array.isArray(product.product_sizes)) {
		sizes = product.product_sizes;
	} else if (typeof product.product_sizes === 'string') {
		sizes = product.product_sizes.split(', ').map(item => {
			const [size, price] = item.split(':');
			return {
				size: size.trim(),
				price: parseFloat(price.trim())
			};
		});
	}

	container.innerHTML = `
		 <div class="product-detail">
			  <img src="${product.image_url}" alt="${product.name}">
			  <div class="product-info">
					<h1>${product.name}</h1>
					<p class="category">Категорія: ${product.category_name}</p>
					<p class="description">${product.description}</p>
					 <div class="price_con">
					 <span>Ціна: </span><p class="price">${product.price} грн</p>
					  </div>
      <div class="sizes">
          <span>Розміри:</span>
          <div class="size-buttons">
            ${sizes.length > 0 ? sizes.map(size => `
					<button 
						 class="size-btn" 
						 data-size="${size.size}" 
						 data-price="${size.price}"
					
					>
						 ${size.size} см
					</button>
			  `).join('') : '<p class="no-sizes-msg">🔴 Розміри відсутні</p>'}
          </div>
        </div>


					<p class="thread-type">Тип ниток: ${product.thread_type}</p>
					<div class="panel_colors">
						 <button class="colors-type" onclick="openColorPanel()">Вибрати колір</button>
						 ${colors.length > 0 ? `
							  <div class="con_colors">
									${colors.map(color => `
										 <button 
											  class="color-btn" 
											  style="background: ${getColorHex(color)}"
											  data-color="${color}"
											  title="${color}"
											  onclick="selectColor('${color}')"
										 ></button>
									`).join('')}
							  </div>
						 ` : '<p class="no-colors-msg">🔴 Кольори відсутні</p>'}
					</div>
					<button class="add-to-cart">Додати в кошик</button>
			  </div>
		 </div>
	`;
	// Обробник подій для кнопок кольорів
	const colorButtons = container.querySelectorAll('.color-btn');
	colorButtons.forEach(button => {
		button.addEventListener('click', () => {
			document.querySelector(".colors-type").classList.remove('red-line');
			document.querySelector(".colors-type").classList.add('active');
			// Видаляємо активний стан у всіх кнопок
			colorButtons.forEach(btn => btn.classList.remove('active'));
			// Додаємо активний стан до обраної кнопки
			button.classList.add('active');
			selectedColor = button.dataset.color;
			console.log(`Обраний колір: ${selectedColor}`);
		});
	});
	const sizeButtons = container.querySelectorAll('.size-btn');
	sizeButtons.forEach(button => {
		button.addEventListener('click', () => {
			document.querySelectorAll(".size-btn").forEach(el => {
				el.classList.remove('red-line');
			});
			sizeButtons.forEach(btn => btn.classList.remove('active'));
			button.classList.add('active');
			selectedSize = button.dataset.size;
			selectedPrice = button.dataset.price;  // Оновлюємо ціну
			// Оновлюємо ціну в інтерфейсі
			document.querySelector('.price').textContent = `${selectedPrice} грн`;
			console.log(`Обраний розмір: ${selectedSize}, ціна: ${selectedPrice}`);
		});
	});

	const addToCartBtn = container.querySelector('.add-to-cart');
	if (addToCartBtn) {
		addToCartBtn.addEventListener('click', () => {
			// if (!selectedColor) {
			// 	alert('Будь ласка, оберіть колір перед додаванням до кошика!');
			// 	return;
			// }
			// const productData = {
			// 	id: product.product_id,
			// 	name: product.name,
			// 	price: product.price,
			// 	color: selectedColor,
			// 	image_url: product.image_url
			// };

			// console.log('Додаємо в кошик:', productData);



			let name = `${product.name}`;
			let size = selectedSize;
			let thread_type = `${product.thread_type}`;
			let price = selectedPrice;
			let product_id = `${product.product_id}`;
			let color = selectedColor;




			// Додавання в кошик
			addToCart(name, price, size, thread_type, product_id, color);


			// Тут можна додати до кошика, наприклад через localStorage
		});
	}
}



// Відкриття/закриття панелі кольорів
function openColorPanel() {
	const colorPanel = document.querySelector('.con_colors');
	if (colorPanel) {
		colorPanel.classList.toggle('active');
	}
}

// Запуск функції при завантаженні сторінки
document.addEventListener('DOMContentLoaded', loadProductDetails);

async function loadCategory() {

	const category = localStorage.getItem("currentCategory");
	try {
		const response = await fetch('http://localhost:3000/api/category', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ category: Number(category) })

		});

		const data = await response.json();
		if (!data.success) throw new Error("Не вдалося завантажити товари");

		const products = data.products;
		const container = document.getElementById('category-container');
		container.innerHTML = "";

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
document.addEventListener('DOMContentLoaded', loadCategory);

//переробити під poroduct

const cart = JSON.parse(localStorage.getItem("cart")) || [];
const storedProduct = JSON.parse(localStorage.getItem('store')) || []; // Якщо немає, ініціалізуємо порожнім масивом

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


function addToCart(name, price, size, thread_type, product_id, color) {
	let cart = JSON.parse(localStorage.getItem("cart") || "[]");
	// Шукаємо товар з таким самим name у кошику
	const existingItem = cart.find(item => item.name === name && item.size === size && item.color === color);
	if (size == 0) {
		document.querySelectorAll(".size-btn").forEach(el => {
			el.classList.add('red-line');
		});
	} else {
		if (color == 0) {
			document.querySelector(".colors-type").classList.add('red-line');
		} else {
			if (!existingItem) {
				// Якщо товару немає в кошику, додаємо його
				cart.push({ name, price, quantity: 1, type: 2, size, thread_type, product_id, color });
			} else {
				// Якщо товар вже є в кошику, збільшуємо його кількість
				existingItem.quantity += 1;
			}

			// Зберігаємо оновлений кошик у localStorage
			localStorage.setItem("cart", JSON.stringify(cart));

			// Оновлюємо інтерфейс кошика
			updateCartUI();
			showCart();
			CartMenu(); // Показуємо кошик

		}
	}
}




function showCart() {
	const cart = JSON.parse(localStorage.getItem("cart") || "[]");
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
				<p>Магазинна іграшка (${item.name}), ${item.size}, ${item.thread_type}, ${item.color}</p>
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


