var irc = require('irc');
var express = require('express');
var querystring = require('querystring');
var https = require('https');

var client = new irc.Client('irc.lavishsoft.com', 'ComBot', {
	channels: ['#combot'],
	password: process.env.IRCPASSWORD,
	autoConnect: false
});



setTimeout(function() {
	client.connect();
}, 15000);

client.addListener('+mode', function(channel, by, mode, argument, message) {});

var app = express.createServer();
app.use(express.bodyParser());

app.post('/', function(req, res) {
	var push = JSON.parse(req.body.payload);
	console.log(push);
	var reponame = irc.colors.wrap('dark_red', '[' + push.repository.name + ']');
	//client.say('#combot', push.pusher.name + " pushed commits");
	var plural = '';
	if (push.commits.length > 1) {
		plural = 's';
	}
	var branch = push.ref.replace(/^refs\/heads\//, '');
	if (branch === '') {
		client.say('#combot', reponame + ' ' + push.pusher.name + ' pushed ' + push.commits.length + ' new commit' + plural);
	}
	else {
		client.say('#combot', reponame + ' ' + push.pusher.name + ' pushed ' + push.commits.length + ' new commit' + plural + ' to ' + branch);
		reponame = irc.colors.wrap('dark_red', '[' + push.repository.name + '\\' + branch + ']');
	}
	for (var i in push.commits) {
		//console.log(push.commits[i]);
		var lines = push.commits[i].message.split('\n');
		if (lines.length > 1) {
			for (var line in lines) {
				if (line == lines.length - 1) {
					client.say('#combot', reponame + '     ' + lines[line] + ' - ' + push.commits[i].committer.name);
				}
				else if (line === 0) {
					client.say('#combot', reponame + ' ' + lines[line]);
				}
				else {
					client.say('#combot', reponame + '     ' + lines[line]);
				}
			}
		}
		else {
			client.say('#combot', reponame + ' ' + lines[0] + ' - ' + push.commits[i].committer.name);
		}

	}
	res.send();
});

app.post('/issue', function(req, res) {
	client.say('#combot', 'issue callback');


});



app.get('/', function(req, res) {

	res.send('Bot Working');

});

function registerIssuesHook(username, repo) {

	var requestBody = [
			"hub.callback=" + querystring.escape('http://combotircbot.herokuapp.com/issue'),
			"hub.mode=" + querystring.escape('subscribe'),
			"hub.topic=" + querystring.escape('https://github.com/' + username + '/' + repo + '/events/issues')
			].join("&");

	var post_options = {
		hostname: 'https://api.github.com',
		port: 443,
		path: '/hub',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': requestBody.length
		}
	};
	
	console.log(requestBody);
	var post_req = https.request(post_options, function(res) {
	});
	post_req.write(requestBody);
	post_req.end();
}

registerIssuesHook('Tehtsuo', 'Combot');
registerIssuesHook('VendanAndrews', 'CombotPatcher');
registerIssuesHook('VendanAndrews', 'GithubPatcher');
registerIssuesHook('VendanAndrews', 'CombotIRCBot');

app.listen(process.env.PORT, '0.0.0.0');