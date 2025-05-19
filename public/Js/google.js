function handleCredentialResponse(response) {
	// Розшифровуємо ID-токен
	console.log("Encoded JWT ID token: " + response.credential);

	// Відправляємо токен на сервер для перевірки
	fetch('/google-auth', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ token: response.credential }),
	})
		.then((res) => res.json())
		.then((data) => {
			if (data.success) {
				alert('Успішний вхід!');
			} else {
				alert('Помилка авторизації');
			}
		});
}

