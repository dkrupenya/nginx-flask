console.log('run index.js');

hello.on('auth.login', function(auth) {
	console.log("login");
	return authenticate('facebook', auth.authResponse);
});

hello.init({
	facebook: 1758895847658350
});

function login() {
	hello('facebook').login();
}

function authenticate(network, socialToken) {
	const data = {
		network: network,
		socialToken: socialToken
	};
	return $.ajax({
		type: 'POST',
		url: '/api/login',
		data: JSON.stringify(data),
		contentType: "application/json; charset=utf-8",
		dataType: 'json',
	})
	.done(function (resp) {
			const entry = resp;
			html = `
			<div>
			<h3>${entry.first_name} ${entry.last_name}</h3>
			<img src="${entry.picture.data.url}">
			<span>${(new Date(entry.created_at * 1000)).toDateString()}</span>
			`;
			console.log(html);
			document.getElementById('history').innerHTML = html;
		});
}

function loadHistory() {
	return $.ajax({
		type: 'GET',
		url: '/api/login_history',
		contentType: "application/json; charset=utf-8",
		dataType: 'json',
	})
	.done(function (resp) {
			const html = resp.map(entry => {
					return `
					<div>
					<h3>${entry.first_name} ${entry.last_name}</h3>
					<img src="${entry.picture.data.url}">
					<span>${(new Date(entry.created_at * 1000)).toDateString()}</span>
					`;
				}).join('\r\n');
			document.getElementById('history').innerHTML = html;

		});

}

