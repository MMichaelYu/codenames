var express = require('express');
var app = express();
var serv = require('http').Server(app);
var io = require('socket.io')(serv,{});

app.get('/',function(req,res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));

var mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost/test');
mongoose.connect('mongodb://codenameserver:mash@ds044689.mlab.com:44689/codenames');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    //connected
    function randomString(len) {
        var p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        return [...Array(len)].reduce(a=>a+p[~~(Math.random()*p.length)],'');
    }
    
    serv.listen(2000);
    console.log("Server started.");
    console.log(randomString(5));
    
    mongoose.Schema({
        room: {type: String, index: true},
        status: String,
        numPlayers: Number,
    
        players: [mongoose.Schema({
            id: String,
            name: String,
            status: String
        }, { _id: false})]
    });
    
    
    app.post('/start', function (req, res) {
        var room = randomString(8);
        var pid = randomString(4);
        var num = req.body.numPlayers;
        var players = [{
            id: pid,
            name: req.body.name,
            status: 'joined',
            statusDate: Date.now()
        }];
    
        //Placeholders for other players to join
        for (var i = 1; i < num; i++) {
            players.push({
                id: pid+'-'+i,
                name: 'Open',
                status: 'open',
                statusDate: Date.now()
            });
        }
    
        Game.create({
            room: room,
            status: 'waiting',
            numPlayers: num,
            players: players
        },
        function(err, game) {
            var data = game.toJSON();
            //Response with game record and add player id
            //to be stored locally
            data.action = 'start';
            data.player = pid;
    
            res.send(data);
        });
    });
    
    var SOCKET_LIST = {};
    var PLAYER_LIST = {};
    
    var Player = function(id) {
        var self = {
            x:250,
            y:250,
            id:id,
            number:"" + Math.floor(10 * Math.random()),
            pressingRight:false,
            pressingLeft:false,
            pressingUp:false,
            pressingDown:false,
            maxSpd:10
        }
        self.updatePosition = function() {
            if(self.pressingRight)
                self.x += self.maxSpd;
            if(self.pressingLeft)
                self.x -= self.maxSpd;
            if(self.pressingUp)
                self.y -= self.maxSpd;
            if(self.pressingDown)
                self.y += self.maxSpd;
        }
        return self;
    }
    
    io.sockets.on('connection', function(socket){
        socket.id = Math.random();
        SOCKET_LIST[socket.id] = socket;
    
        var player = Player(socket.id);
        PLAYER_LIST[socket.id] = player;
    
        socket.on('disconnect',function(){
            delete SOCKET_LIST[socket.id];
            delete PLAYER_LIST[socket.id];
        });
    
        socket.on('keyPress',function(data){
            if(data.inputId === 'left')
                player.pressingLeft = data.state;
            else if(data.inputId === 'right')
                player.pressingRight = data.state;
            else if(data.inputId === 'up')
                player.pressingUp = data.state;
            else if(data.inputId === 'down')
                player.pressingDown = data.state;
        });
    });
    
    setInterval(function() {
        var pack = [];
        for(var i in PLAYER_LIST) {
            var player = PLAYER_LIST[i];
            player.updatePosition();
            pack.push({
                x:player.x,
                y:player.y,
                number:player.number
            });
        }
        for(var i in SOCKET_LIST){
            var socket = SOCKET_LIST[i];
            socket.emit('newPositions',pack);
        }
    },1000/25);
    
    
});

