var ircLib = require('irc');
var http = require('http');

var client = new ircLib.Client('irc.lavishsoft.com', 'ComBot', {
    channels: ['#combot'],
});

client.addListener('message', function (from, to, message) {

});

http.createServer(function (req, res) {
        console.log(req);
        }).listen(process.env.PORT, "0.0.0.0");