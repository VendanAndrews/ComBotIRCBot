var ircLib = require('irc');
var express = require('express');

var client = new ircLib.Client('irc.lavishsoft.com', 'ComBot', {
    channels: ['#combot'],
});

client.addListener('message', function (from, to, message) {

});


var app = express.createServer();

app.get('/', function(req, res){
    console.log(req.payload);
});

app.listen(process.env.PORT);