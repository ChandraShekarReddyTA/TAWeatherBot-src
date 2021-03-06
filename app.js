var restify = require('restify');
var builder = require('botbuilder');
var apiai = require('apiai');
var app = apiai('f5fb2e712a354ec5907d815dc28b25fc');
var uniqid = require('uniqid');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
	console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
	appId: '86301fdb-635d-4f00-a1ce-fdb8b94593a1', //process.env.MICROSOFT_APP_ID,
	appPassword: 'daqiCI765}:?dvcQXIJB06}' //process.env.MICROSOFT_APP_PASSWORD
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
		if(data=="status#getMyStatus#"){
			session.send(""+JSON.stringify(session.message.user));
		}
		else if(data=="status#setMyStatus#"){
			
		}
		else{
			session.send(""+data);
		}
		
	});

});