var ircLib = require('irc');
var http = require('http');

var client = new ircLib.Client('irc.lavishsoft.com', 'ComBot', {
    channels: ['#combot'],
});

client.addListener('message', function (from, to, message) {

});

http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Hello World\n');
        }).listen(process.env.PORT, "0.0.0.0");