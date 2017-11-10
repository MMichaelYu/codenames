var express = require('express');
var app = express();
var serv = require('http').Server(app);
var io = require('socket.io')(serv,{});
const myRoom = require('./models/myRoom.js');

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
    
    serv.listen(process.env.PORT || 5000);
    console.log("Server started.");
    
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
        function( err, game ) {
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

        socket.on('createGame',function(data){
            //TODO: implement
            myRoomName = randomString(8);
            //playerID = randomString(4);
            socket.join(myRoomName, function(){
                //Create default room
                var room = new myRoom({
                    roomID: myRoomName,
                    status: 'waiting',
                    numPlayers: 1,
                    players: [{id: socket.id, team: "blue", role: "captain"}],
                    //players: [playerID],
                    whoseTurn: "blue",
                    words: ["mist", "slope", "line", "town", "order",
                            "stitch", "camera", "brick", "channel", "cook",
                            "lock", "things", "stretch", "butter", "root",
                            "bead", "bell", "mountain", "income", "slave",
                            "train", "cannon", "canvas", "dust", "humor"],
                    revealedWords: [0,0,0,0,0,
                                    0,0,0,0,0,
                                    0,0,0,0,0,
                                    0,0,0,0,0,
                                    0,0,0,0,0],
                    colorWords: ["blue", "red", "black", "brown", "brown",
                                "red", "brown", "brown", "brown", "blue",
                                "blue", "blue", "blue", "red", "red",
                                "blue", "blue", "blue,", "blue", "brown",
                                "red", "red", "red", "red", "brown"]

                });

                //Save to mongoDB
                room.save().then(function(){
                    //Tell client info about roomID, playerID, and the game through the room object
                    SOCKET_LIST[socket.id].emit('myroomjoined',room);
                    //io.in("default").emit('myroomjoined', room);
                    //console.log("now in rooms", socket.rooms);
                    console.log('socket has created a game');
                });
            });
        });

        socket.on('joinGame', function(data){
            //TODO: implement
            socket.join(data.roomName, function(){
                myRoom.findOne({roomID: data.roomName}).then(function(record){
                    //update numplayers and playerid array
                    record.numPlayers = record.numPlayers+1;
                    if (record.players.length % 2 === 0) { //even 
                        record.players.push({id: socket.id, team: "blue", role: "regular"});
                    }
                    else { //odd 
                        record.players.push({id: socket.id, team: "red", role: "regular"});
                    }

                    //game can start with 4 players
                    //check for 4 players and change status if needed
                    if (record.numPlayers === 4) {
                        record.status = 'starting';
                    }

                    //save to database
                    record.save().then(function(){
                        //Tell client info about roomID, playerID, and the game through room object
                        SOCKET_LIST[socket.id].emit('myroomjoined',record);
                        console.log('new client has joined game');
                    });
                });
            });
            //TODO: check for error here, if room doesn't exist
        });
    });
    
    setInterval(() => {
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

