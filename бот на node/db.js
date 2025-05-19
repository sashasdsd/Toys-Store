const mysql = require('mysql2');
const dotenv = require('dotenv');


dotenv.config();
const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
});

// Підключаємося до БД
connection.connect((err) => {
	if (err) {
		console.error('Помилка підключення до БД:', err);
		process.exit(1);
	}
	console.log('Підключено до бази даних');
});

module.exports = connection;