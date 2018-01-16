var restify = require('restify');
var builder = require('botbuilder');
var apiai = require('apiai');
var app = apiai('1e413c6fee0f47378cc3674561d7267a');
var uniqid = require('uniqid');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
	console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
	appId: process.env.MICROSOFT_APP_ID,
	appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
	var request = app.textRequest(session.message.text, {
		sessionId: uniqid()
	});
	const responseFromAPI = new Promise(function (resolve, reject) {
		request.on('error', function(error) {
			reject(error);
		});
		request.on('response', function(response) {
			resolve(response.result.fulfillment.speech);
		});
		request.end();
	});
	responseFromAPI.then(function(data){
		session.send(""+data);
	});

});