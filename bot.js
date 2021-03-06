var irc = require('irc');
var express = require('express');
var querystring = require('querystring');
var http = require('http');
var https = require('https');

var client = new irc.Client('irc.lavishsoft.com', 'ComBot', {
	channels: ['#combot'],
	password: process.env.IRCPASSWORD,
	autoConnect: false
});



setTimeout(function() {
	client.connect();
}, 15000);
setTimeout(function() {
	registerIssuesHook('Tehtsuo', 'Combot');
	registerIssuesHook('VendanAndrews', 'CombotPatcher');
	registerIssuesHook('VendanAndrews', 'GithubPatcher');
	registerIssuesHook('VendanAndrews', 'CombotIRCBot');
	registerIssueCommentHook('Tehtsuo', 'Combot');
	registerIssueCommentHook('VendanAndrews', 'CombotPatcher');
	registerIssueCommentHook('VendanAndrews', 'GithubPatcher');
	registerIssueCommentHook('VendanAndrews', 'CombotIRCBot');
}, 25000);

client.addListener('+mode', function(channel, by, mode, argument, message) {});

var app = express.createServer();
app.use(express.bodyParser());

app.post('/issue', function(req, res) {
	res.send();
	var info = JSON.parse(req.body.payload);
	
	var requestBody = "url=" + querystring.escape(info.issue.html_url);

	var post_options = {
		hostname: 'git.io',
		port: 80,
		path: '',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': requestBody.length
		}
	};
	
	var post_req = http.request(post_options, function(res) {
		client.say('#combot', info.repository.name + ' issue ' + info.action + ': ' + info.issue.title + ' : ' + res.headers['location']);
		
	});
	post_req.write(requestBody);
	post_req.end();
	
	//http://git.io -F "url=https://github.com/..."
});

app.post('/issuecomment', function(req, res) {
	res.send();
	var info = JSON.parse(req.body.payload);
	
	var requestBody = "url=" + querystring.escape(info.issue.html_url);

	var post_options = {
		hostname: 'git.io',
		port: 80,
		path: '',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': requestBody.length
		}
	};
	
	var post_req = http.request(post_options, function(res) {
		client.say('#combot', info.repository.name + ' new comment on issue: ' + info.issue.title + ' : ' + res.headers['location']);
		
	});
	post_req.write(requestBody);
	post_req.end();
	
	//http://git.io -F "url=https://github.com/..."
});

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
	client.say('#combot', reponame + ' http://combot.vendaria.net/git/index.php?repo=' + push.repository.name + '&from=' + push.commits[0].id + '&to=' + push.after);
	res.send();
});

app.get('/issue', function(req, res) {
	
	
	var query = {
		"hub.mode": req.query["hub.mode"],
		"hub.topic": req.query["hub.topic"],
		"hub.challenge": req.query["hub.challenge"]
	};
	
	var get_options = {
		hostname: 'api.github.com',
		port: 443,
		path: '/hub?' + querystring.stringify(query),
		method: 'GET'
	};
	
	
	https.get(get_options);
	
	res.send('Hooking');
	
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
		hostname: 'api.github.com',
		port: 443,
		path: '/hub',
		method: 'POST',
		auth: process.env.GITHUBAUTH,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': requestBody.length
		}
	};
	
	var post_req = https.request(post_options, function(res) {
	});
	post_req.write(requestBody);
	post_req.end();
}

function registerIssueCommentHook(username, repo) {

	var requestBody = [
			"hub.callback=" + querystring.escape('http://combotircbot.herokuapp.com/issuecomment'),
			"hub.mode=" + querystring.escape('subscribe'),
			"hub.topic=" + querystring.escape('https://github.com/' + username + '/' + repo + '/events/issue_comment')
			].join("&");

	var post_options = {
		hostname: 'api.github.com',
		port: 443,
		path: '/hub',
		method: 'POST',
		auth: process.env.GITHUBAUTH,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': requestBody.length
		}
	};
	
	var post_req = https.request(post_options, function(res) {
	});
	post_req.write(requestBody);
	post_req.end();
}

client.addListener('pm', function (from, message) {
    if(from == 'Vendan' || from == 'Teht')
		{
			client.say('#combot', message);
		}
});

app.listen(process.env.PORT, process.env.IP);