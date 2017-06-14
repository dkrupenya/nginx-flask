console.log('run index.js');

hello.on('auth.login', function(auth) {
	console.log("login");
	return authenticate('facebook', auth.authResponse);
	// Call user information, for the given network
	// hello(auth.network).api('me')
	// 	.then(function(r) {
	// 		// Inject it into the container
	// 		console.log(r);
	// 		console.log(auth);
	// 		var label = document.getElementById('profile_' + auth.network);
	// 		if (!label) {
	// 			label = document.createElement('div');
	// 			label.id = 'profile_' + auth.network;
	// 			document.getElementById('profile').appendChild(label);
	// 		}
	// 		label.innerHTML = '<img src="' + r.picture + '" /> Hey ' + r.first_name;
	//
	// 	});
});

// hello.init({
// 	facebook: 1758895847658350
// });

function login() {
	console.log('login');
	hello.init({
		facebook: 1758895847658350
	});
}

function authenticate(network, socialToken) {
	const data = {
		network: network,
		socialToken: socialToken
	};
	return $.ajax({
		type: 'POST',
		url: 'http://localhost:5000/login',
		data: JSON.stringify(data),
		success: function (resp) {
			const entry = resp;
			html = `
					<div>
					<h3>${entry.first_name} ${entry.last_name}</h3>
					<img src="${entry.picture.data.url}">
					<span>${(new Date(entry.created_at * 1000)).toDateString()}</span>
					`;
			console.log(html);
			// html = resp.data.map(entry => {
			// 		return `
			// 		<div>
			// 		<h3>${entry.first_name} ${entry.last_name}</h3>
			// 		<img src="${entry.picture.data.url}">
			// 		<span>${Date(entry.created_at).toDateString()}</span>
			// 		`;
			// 	}).join('\r\n');
			document.getElementById('history').innerHTML = html;
		},
		contentType: "application/json; charset=utf-8",
		dataType: 'json',
	});
}

function loadHistory() {
	return $.ajax({
		type: 'GET',
		url: 'http://localhost:5000/login_history',
		success: function (resp) {
			const html = resp.map(entry => {
					return `
					<div>
					<h3>${entry.first_name} ${entry.last_name}</h3>
					<img src="${entry.picture.data.url}">
					<span>${(new Date(entry.created_at * 1000)).toDateString()}</span>
					`;
				}).join('\r\n');
			document.getElementById('history').innerHTML = html;

		},
		contentType: "application/json; charset=utf-8",
		dataType: 'json',
	});

}

