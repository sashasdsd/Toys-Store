const main = document.getElementById('central-wrapper');
const body = document.body;
const burgerMenu = document.getElementById('burger-menu');
const menuBody = document.querySelector('.menu_body');
const closeButton = document.getElementById('close-button');
const contMenu = document.getElementById('conteiner-menu');


document.addEventListener('DOMContentLoaded', () => {

	// Показ/приховування меню
	burgerMenu.addEventListener('click', () => {
		console.log('Burger menu clicked');
		burgerMenu.classList.add('active'); // Анімація бургер-меню
		menuBody.classList.add('active');
		contMenu.classList.add('active');

	});
});


function toggleMenu() {

	menuBody.classList.toggle('open');
	contMenu.classList.toggle('open');

}




closeButton.addEventListener('click', () => {

	console.log('Close button clicked');
	menuBody.classList.remove('active');
	burgerMenu.classList.remove('active');
	contMenu.classList.remove('active');


});

document.addEventListener('click', (e) => {

	if (menuBody.classList.contains('active') && !menuBody.contains(e.target) && !burgerMenu.contains(e.target)) {
		console.log('Click outside, closing menu');

		menuBody.classList.remove('active');
		burgerMenu.classList.remove('active');
		contMenu.classList.remove('active');

	}
});


