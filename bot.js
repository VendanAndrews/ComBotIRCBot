var irc = require('irc');
var express = require('express');

var client = new irc.Client('irc.lavishsoft.com', 'ComBot', {
    channels: ['#combot'],
});

var app = express.createServer();
app.use(express.bodyParser());

app.post('/', function(req, res){
    var push = JSON.parse(req.body.payload);
    console.log(push);
    var reponame = irc.colors.wrap('\\u000305', '[' + push.repository.name +']');
    //client.say('#combot', push.pusher.name + " pushed commits");
    client.say('#combot', reponame + ' ' + push.pusher.name + ' pushed ' + push.commits.length + ' new commits');
    for(var i in push.commits)
    {
        //console.log(push.commits[i]);
        client.say('#combot', reponame + ' ' + push.commits[i].message + ' - ' + push.commits[i].committer.name);
        
    }
});

app.listen(process.env.PORT, '0.0.0.0');