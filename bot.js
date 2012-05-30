var irc = require('irc');
var express = require('express');

var client = new irc.Client('irc.lavishsoft.com', 'ComBot', {
    channels: ['#combot'],
    password: process.env.IRCPASSWORD,
    autoConnect: false
    });
    
setTimeout(function(){
    client.connect();
}, 15000);

var app = express.createServer();
app.use(express.bodyParser());

app.post('/', function(req, res){
    var push = JSON.parse(req.body.payload);
    console.log(push);
    var reponame = irc.colors.wrap('dark_red', '[' + push.repository.name +']');
    //client.say('#combot', push.pusher.name + " pushed commits");
    var plural = '';
    if(push.commits.length>1)
    {
        plural = 's';
    }
    var branch = push.ref.replace(/^refs\/heads\//,'');
    if(branch=='')
    {
        client.say('#combot', reponame + ' ' + push.pusher.name + ' pushed ' + push.commits.length + ' new commit' + plural);
    }
    else
    {
        client.say('#combot', reponame + ' ' + push.pusher.name + ' pushed ' + push.commits.length + ' new commit' + plural + ' to ' + branch);
        reponame = irc.colors.wrap('dark_red', '[' + push.repository.name + '\\' + branch + ']');
    }
    for(var i in push.commits)
    {
        //console.log(push.commits[i]);
        var lines = push.commits[i].message.split('\n');
        for(var line in lines)
        {
            if(line == lines.length)
            {
                client.say('#combot', reponame + ' ' + lines[line]);
            }else{
                client.say('#combot', reponame + ' ' + lines[line] + ' - ' + push.commits[i].committer.name);
            }
        }
        
    }
    res.send();
});

app.get('/', function(req, res){
    
   res.send('Bot Working'); 
    
});

app.listen(process.env.PORT, '0.0.0.0');