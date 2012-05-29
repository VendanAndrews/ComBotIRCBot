var ircLib = require('irc');
var express = require('express');

/*var client = new ircLib.Client('irc.lavishsoft.com', 'ComBot', {
    channels: ['#combot'],
});
*/
var app = express.createServer();
app.use(express.bodyParser());

app.post('/', function(req, res){
    var push = JSON.parse(req.body.payload);
    console.log(push);
    //client.say('#combot', push.pusher.name + " pushed commits");
    console.log('[' + push.repository.name +'] ' + push.pusher.name + ' pushed ' + push.commits.length + ' new commits');
    for(var commit in push.commits)
    {
        console.log('[' + push.repository.name +'] ' + commit.message + ' - ' + commit.committer);
        
    }
});

app.listen(process.env.PORT, '0.0.0.0');