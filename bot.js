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
        client.say('#combot', reponame + ' ' + push.pusher.name + ' pushed ' + push.commits.length + ' new commit' + plural + ' in ' + branch);
        reponame = irc.colors.wrap('dark_red', '[' + push.repository.name + '/' + branch + ']');
    }
    for(var i in push.commits)
    {
        //console.log(push.commits[i]);
        client.say('#combot', reponame + ' ' + push.commits[i].message + ' - ' + push.commits[i].committer.name);
        
    }
    res.send();
});

app.get('/', function(req, res){
    
   res.send('Bot Working'); 
    
});

app.listen(process.env.PORT, '0.0.0.0');