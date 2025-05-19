//переклад
const langToggle = document.getElementById('lang-toggle');
const langOptions = document.getElementById('lang-options');

//Реєстрація
const SignUp = document.getElementById('sign-up-first')
const SignUp2 = document.getElementById('sign-up')

const BtnReg = document.getElementById('btn-reg')
const BtnRegBurg = document.getElementById('btn-reg2')
const togglePassword = document.getElementById('togglePassword-first');
const togglePassword2 = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password-input-first');
const passwordInput2 = document.getElementById('password-input');
const eye = document.getElementById('eye-first');
const eye2 = document.getElementById('eye');
const BlockedBlock = document.getElementById("blocked-block");
//Введення інформації
const nameInput = document.getElementById("name");
const lastNameInput = document.getElementById("last_name");
const phoneInput = document.getElementById("phone");
const telegramInput = document.getElementById("telegram");
const stateInput = document.getElementById("state");
const cityInput = document.getElementById("town");
const confirmButton = document.getElementById("confirm-order");
const confirmButtonBlock = document.getElementById('confirm-order-blocked');
const deliveryForm = document.getElementById("delivery_form");
let totalPrice = 0;

// Змінні для малювання
let currentLang = 'uk';

// Масиви для історії дій
let history = [];
let redoStack = [];



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



// переклад
translatePage(currentLang);


document.addEventListener("DOMContentLoaded", function () {
	const checkoutCart = JSON.parse(localStorage.getItem("cart")) || [];
	const orderContainer = document.getElementById("order-summary");

	if (checkoutCart.length === 0) {
		orderContainer.innerHTML = "<p>Немає товарів для замовлення.</p>";
		return;
	}



	checkoutCart.forEach(item => {
		const itemTotalPrice = item.price * item.quantity; // Сума для поточного товару
		totalPrice += itemTotalPrice; // Додаємо до загальної суми

		let itemText;
		if (item.quantity === 1) {
			itemText = `${item.quantity} товар на суму`;
		} else if (item.quantity > 1 && item.quantity < 5) {
			itemText = `${item.quantity} товари на суму`;
		} else {
			itemText = `${item.quantity} товарів на суму`;
		}
		if (type = 2) {
			if (item.quantity === 1) {
				itemText = `${item.quantity} Кастомна іграшка (${item.name})  на суму`;
			} else if (item.quantity > 1 && item.quantity < 5) {
				itemText = `${item.quantity} Кастомних іграшки (${item.name}) на суму`;
			} else {
				itemText = `${item.quantity} Кастомних іграшок (${item.name})  товарів на суму`;
			}
		}

		orderContainer.insertAdjacentHTML('beforeend', `
			  <dl class="order-item">
					<dt >${itemText}</dt> 
					<dd >${itemTotalPrice}₴</dd>
			  </dl>
		 `);
	});

	document.getElementById("total-price").textContent = `${totalPrice} ₴`;
});

document.getElementById("confirm-order").addEventListener("click", async function () {
	try {
		// Перевіряємо токен
		const response = await fetch('http://localhost:3000/check-token', {
			method: 'GET',
			credentials: 'same-origin'  // Додаємо куки до запиту
		});

		const data = await response.json();

		if (data.message === 'Токен валідний') {
			console.log('Токен дійсний. User ID:', data.userId);


			// Після того, як ми отримали userId, продовжуємо обробку замовлення
			alert("Ваше замовлення оформлено! Дякуємо за покупку 😊");

			const telegram = telegramInput.value.trim();
			const Name = nameInput.value.trim();
			const lastName = lastNameInput.value.trim();
			const phone = phoneInput.value.trim();
			const state = stateInput.value.trim();
			const town = cityInput.value.trim();

			const id_User = data.userId;  // Тепер ми маємо валідний userId
			let cart = JSON.parse(localStorage.getItem("cart")) || [];
			let selectedDelivery = document.querySelector('input[name="choice"]:checked');

			// Відправка замовлення на сервер
			const orderResponse = await fetch("http://localhost:3000/saveOrder", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					telegram: telegram,
					name: Name,
					last_name: lastName,
					phone: phone,
					post: selectedDelivery.value, // Додаємо значення вибраного способу доставки
					toys: cart,
					suma: totalPrice,
					user_id: id_User,
					town: town,
					state: state
				})
			});

			const orderData = await orderResponse.json();

			console.log("Замовлення успішно створено!", orderData);

			// Очищення localStorage тільки після успішного замовлення
			localStorage.removeItem("cart");
			localStorage.removeItem("checkoutCart");

			// Перенаправлення на сторінку "Дякуємо"
			window.location.href = "thank-you.html";
		} else {

			console.log('Токен не валідний');

		}
	} catch (error) {
		console.error('Помилка при перевірці токена або оформленні замовлення:', error);
		alert("Сталася помилка при оформленні замовлення. Спробуйте ще раз!");
	}
});



document.addEventListener("DOMContentLoaded", function () {
	// Спочатку блокуємо кнопку
	confirmButton.disabled = true;
	confirmButtonBlock.classList.add("active");

	// Додаємо обробники подій для всіх інпутів на момент завантаження
	confirmButtonBlock.addEventListener("click", function () {
		checkInputs();
	});

	const radioButtons = document.querySelectorAll('input[name="choice"]');
	radioButtons.forEach(button => {
		button.addEventListener('change', () => {
			clearError(deliveryForm); // Видаляємо помилку при виборі варіанту
			checkInput();
		});
	});

	nameInput.addEventListener("input", () => {
		clearError(nameInput);
		checkInput();
	});

	lastNameInput.addEventListener("input", () => {
		clearError(lastNameInput);
		checkInput();
	});

	phoneInput.addEventListener("input", () => {
		if (/^\+380\d{9}$/.test(phoneInput.value.trim())) {
			clearError(phoneInput);
		}
		checkInput();
	});

	telegramInput.addEventListener("input", () => {
		clearError(telegramInput);
		checkInput();
	});
	stateInput.addEventListener("input", () => {
		clearError(stateInput);
		checkInput();
	});
	cityInput.addEventListener("input", () => {
		clearError(cityInput);
		checkInput();
	});

	// Функція для перевірки інпутів
	function checkInputs() {
		let valid = true;

		// Перевірка поля "Ім'я"
		if (nameInput.value.trim() === "") {
			showError(nameInput, "Це обов'язкове поле!");
			valid = false;
		}

		// Перевірка поля "Прізвище"
		if (lastNameInput.value.trim() === "") {
			showError(lastNameInput, "Це обов'язкове поле!");
			valid = false;
		}

		// Перевірка поля "Телефон"
		if (!/^\+380\d{9}$/.test(phoneInput.value.trim())) {
			showError(phoneInput, "Це обов'язкове поле!");
			valid = false;
		}

		// Перевірка поля "Тг"
		if (telegramInput.value.trim() === "") {
			showError(telegramInput, "Це обов'язкове поле!");
			valid = false;
		}
		if (stateInput.value.trim() === "") {
			showError(stateInput, "Це обов'язкове поле!");
			valid = false;
		}
		// Перевірка поля "Місто"
		if (cityInput.value.trim() === "") {
			showError(cityInput, "Це обов'язкове поле!");
			valid = false;
		}

		// Перевірка вибору доставки
		let selectedDelivery = document.querySelector('input[name="choice"]:checked');
		if (!selectedDelivery) {
			showError(deliveryForm, "Це обов'язкове поле!");
			valid = false;
		}

		// Розблоковуємо або блокуємо кнопку
		confirmButton.disabled = !valid;
		if (valid) {
			confirmButtonBlock.classList.remove("active");
		}
	}

	// Функція для показу помилки
	function showError(inputElement, message) {
		// Спочатку видаляємо всі попередні помилки для цього поля
		clearError(inputElement);
		// Додаємо нове повідомлення про помилку
		const error = document.createElement("p");
		error.classList.add("error_inpt"); // Клас для стилізації
		error.innerText = message;
		inputElement.parentNode.appendChild(error); // Додаємо під поле
	}

	// Функція для видалення помилки
	function clearError(inputElement) {
		const error = inputElement.parentNode.querySelector(".error_inpt");
		if (error) {
			error.remove();
		}
	}

	// Функція для перевірки стану інпутів
	function checkInput() {
		let valid = true;

		// Перевірка поля "Ім'я"
		if (nameInput.value.trim() === "") {
			valid = false;
		}

		// Перевірка поля "Прізвище"
		if (lastNameInput.value.trim() === "") {
			valid = false;
		}

		// Перевірка поля "Телефон"
		if (!/^\+380\d{9}$/.test(phoneInput.value.trim())) {
			valid = false;
		}

		// Перевірка поля "Місто"
		if (cityInput.value.trim() === "") {
			valid = false;
		}

		// Перевірка поля "Тг"
		if (telegramInput.value.trim() === "") {
			valid = false;
		}

		// Перевірка вибору доставки
		let selectedDelivery = document.querySelector('input[name="choice"]:checked');
		if (!selectedDelivery) {
			valid = false;
		}

		// Розблоковуємо або блокуємо кнопку
		confirmButton.disabled = !valid;
		if (valid) {
			confirmButtonBlock.classList.remove("active");
		}
	}
});


// Додаємо обробник подій для оновлення при зміні вибору доставки



function BackToIndex() {

	window.location.href = "index.html";
};


document.addEventListener('DOMContentLoaded', async function () {
	try {
		const stateInput = document.getElementById("state");
		const cityInput = document.getElementById("town");
		const stateList = document.getElementById('state-list');
		const cityList = document.getElementById('city-list');

		// Перевірка наявності елементів DOM
		if (!stateInput || !cityInput || !stateList || !cityList) {
			throw new Error('Не вдалося знайти необхідні елементи DOM');
		}

		let lastSelectedStateId = null;

		// Отримання списку областей з сервера
		const statesResponse = await fetch('/states');
		if (!statesResponse.ok) throw new Error('Не вдалося завантажити області');
		const states = await statesResponse.json();

		// Заповнення списку областей
		const stateFragment = document.createDocumentFragment();
		states.forEach(state => {
			const option = document.createElement('option');
			option.value = state.name_uk;
			option.dataset.stateId = state.id;
			stateFragment.appendChild(option);
		});
		stateList.appendChild(stateFragment);

		// Debounce для обмеження частоти викликів
		function debounce(func, delay) {
			let timeout;
			return function (...args) {
				clearTimeout(timeout);
				timeout = setTimeout(() => func.apply(this, args), delay);
			};
		}

		const handleStateInput = debounce(async function () {
			const searchText = this.value.toLowerCase();
			const options = stateList.querySelectorAll('option');

			options.forEach(option => {
				option.hidden = !option.value.toLowerCase().includes(searchText);
			});

			if (searchText === "") {
				lastSelectedStateId = null;
				await updateCityList();
				return;
			}

			const selectedStateOption = Array.from(stateList.options).find(
				option => option.value.toLowerCase() === searchText
			);

			if (selectedStateOption && selectedStateOption.dataset.stateId !== lastSelectedStateId) {
				lastSelectedStateId = selectedStateOption.dataset.stateId;
				await updateCityList(lastSelectedStateId);
			}
		}, 300);

		stateInput.addEventListener('input', handleStateInput);

		async function updateCityList(stateId = null) {
			try {
				let settlements;
				if (stateId) {
					const settlementsResponse = await fetch(`/settlements/${stateId}`);
					if (!settlementsResponse.ok) throw new Error('Не вдалося завантажити населені пункти');
					settlements = await settlementsResponse.json();
				} else {
					settlements = [];
				}

				cityList.innerHTML = '';
				const cityFragment = document.createDocumentFragment();

				settlements.forEach(settlement => {
					const option = document.createElement('option');
					option.value = settlement.name_uk;
					cityFragment.appendChild(option);
				});

				cityList.appendChild(cityFragment);
			} catch (error) {
				console.error('Помилка при оновленні списку міст:', error);
				const errorMessage = document.createElement('p');
				errorMessage.textContent = 'Не вдалося завантажити список міст. Спробуйте пізніше.';
				errorMessage.style.color = 'red';
				document.body.appendChild(errorMessage);
			}
		}

		cityInput.addEventListener('input', function () {
			const searchText = this.value.toLowerCase();
			const options = cityList.querySelectorAll('option');

			options.forEach(option => {
				option.hidden = !option.value.toLowerCase().includes(searchText);
			});
		});

	} catch (error) {
		console.error('Помилка завантаження даних:', error);
		const errorMessage = document.createElement('p');
		errorMessage.textContent = 'Не вдалося завантажити список міст. Спробуйте пізніше.';
		errorMessage.style.color = 'red';
		document.body.appendChild(errorMessage);
	}
});


document.querySelectorAll('.input-wrapper input').forEach(input => {
	// Обробник події при втраті фокусу (коли користувач "вийшов" з поля)
	input.addEventListener('blur', function () {
		const wrapper = this.closest('.input-wrapper');
		let isValid = this.value.trim() !== '';

		// Для поля з телефоном додамо додаткову перевірку формату
		if (this.id === 'phone') {

			const phoneRegex = /^\+380\d{9}$/;
			isValid = phoneRegex.test(this.value.trim());
		}

		wrapper.classList.toggle('active', isValid);
		input.classList.toggle('active', this.value.trim() !== '');
	});

	// Перевірка при завантаженні сторінки
	const wrapper = input.closest('.input-wrapper');
	wrapper.classList.toggle('active', input.value.trim() !== '');
});

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


});

// Перехід до входу
document.getElementById("switch-to-login").addEventListener("click", function () {
	document.getElementById("sign-up").classList.add('active'); // Показати форму входу
	document.getElementById("sign-up-first").classList.remove('active'); // Сховати форму реєстрації

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
			SignUp2.classList.remove('active');
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
				document.querySelector('.all_conteiner_reg').classList.add('active');
			} else {
				console.log('Токен не валідний');
				document.getElementById("oreder-modal").classList.add('no-active');
				SignUp2.classList.add('active');
				;
			}
		})
		.catch(error => {
			console.error('Помилка при перевірці токена:', error);
		});
});
