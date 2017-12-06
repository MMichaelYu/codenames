var express = require('express');
var app = express();
var serv = require('http').Server(app);
var io = require('socket.io')(serv, {});
const myRoom = require('./models/myRoom.js');

var colorTiles = ["blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue",
    "red", "red", "red", "red", "red", "red", "red", "red", "black", "sandybrown", "sandybrown", "sandybrown",
    "sandybrown", "sandybrown", "sandybrown", "sandybrown"];

var codes = ["Aircraft", "Aisle", "Alligator", "Alphabetize", "America", "Ankle"
    ,  "Applause", "Arm", "Astronaut"
	     , "Athlete", "Aunt", "Avocado", "Baby", "Backbone", "Bag", "Bald", "Balloon"
    , "Banana",  "Baseball", "Basket", "Bat", "Battery", "Beach", "Bedbug"
    , "Beer", "Belt", "Bib", "Bicycle", "Big", "Bike", "Bird"
    , "Birthday", "Bite", "Blanket", "Bleach", "Blimp", "Blossom", "Blueprint", "Blunt", "Blur"
    , "Boa", "Boat", "Body", "Bomb", "Bonnet", "Book", "Booth", "Bowtie"
    , "Box", "Boy", "Brand", "Bride", "Bridge", "Broccoli",  "Broom"
    , "Bruise", "Bubble", "Buddy", "Buffalo", "Bulb", "Bunny", "Bus", "Cabin"
    , "Cake", "Campsite", "Canada", "Candle", "Candy", "Cape"
    , "Car", "Cardboard", "Cat", "Ceiling", "Cell", "Century", "Chair", "Chalk"
    , "Champion", "Charger", "Cheerleader", "Chef", "Chess", "Chew", "Chicken", "China", "Chocolate"
    , "Church", "Circus", "Clay", "Cliff", "Cloak", "Clown", "Clue", "Coach", "Coal"
    , "Coaster", "College", "Computer", "Cone"
    , "Cook", "Coop", "Cord", "Corduroy", "Cough", "Cow", "Cowboy", "Crayon", "Cream"
    , "Crow", "Cruise", "Crumb", "Crust", "Cuff", "Curtain"
    , "Dad", "Dart", "Dawn", "Day", "Dentist", "Desk"
    , "Dimple", "Ditch", "Diver", "Doctor", "Dog", "Doghouse", "Doll", "Dominoes"
    , "Door", "Dot", "Drain", "Draw", "Dream", "Dress", "Drums", "Dryer"
    , "Duck", "Dust", "Ear", "Ebony", "Elbow", "Elephant"
    , "Elevator", "Elf", "Elm", "Engine", "England", "Escalator", "Europe"
    , "Eyebrow", "Fan", "Feast", "Fence", "Fiddle"
    , "Finger", "Fire", "First", "Fish", "Flagpole", "Flannel", "Flock"
    , "Flower", "Fog", "Foil", "Football", "Forehead"
    , "Forty", "France", "Freckle", "Fringe", "Frog", "Frown", "Game", "Garbage"
    , "Garden", "Gasoline", "Gem", "Ginger", "Girl", "Glasses", "Goblin", "Gold"
    , "Grandpa", "Grape", "Grass", "Gray", "Green", "Guitar", "Gum", "Gumball", "Hair"
    , "Half", "Handle", "Hat", "Headache", "Heart", "Hedge"
    , "Helicopter", "Hem", "Hill", "Hockey", "Homework", "Hopscotch", "Horse", "Hose"
    , "House", "Hug", "Hurdle", "Hut", "Ice"
    , "Intern", "Internet", "Invitation", "Ivory", "Ivy", "Japan"
    , "Jeans", "Jelly", "Jet", "Jog", "Journal", "Jump", "Key", "Killer", "Kilogram", "King"
    , "Kitchen", "Kite", "Knee", "Knife", "Knight", "Koala", "Lace", "Ladder", "Ladybug"
    , "Landfill", "Laugh", "Laundry", "Law", "Lawn", "Leak", "Leg"
    , "Letter", "Level", "Light", "Lime", "Lion", "Lizard", "Log"
    , "Lollipop", "Lunch", "Lunchbox", "Lyrics", "Machine", "Mailbox"
    , "Mammoth", "Mars", "Mascot", "Matchstick", "Mate", "Mattress", "Mess", "Mexico"
    , "Mistake", "Modern", "Mold", "Mom", "Monday", "Money", "Monster"
    , "Moon", "Mop", "Moth", "Motorcycle", "Mountain", "Mouse", "Mud", "Music"
    , "Nature", "Neighbor", "Nest", "Neutron", "Niece", "Night", "Nose"
    , "Oar", "Office", "Oil", "Orbit", "Organ"
    , "Outside", "Ovation", "Pail", "Paint", "Pajamas", "Palace", "Pants"
    , "Paper", "Park", "Party", "Password", "Pastry", "Pawn", "Pear", "Pen"
    , "Pencil", "Pendulum", "Penny", "Pepper", "Phone", "Piano", "Picnic"
    , "Pillow", "Pilot", "Pirate", "Plaid", "Plan", "Plank"
    , "Plate", "Platypus", "Plumber", "Pocket", "Poem", "Point", "Pole"
    , "Pool", "Popsicle", "Post", "Princess"
    , "Puppet", "Puppy", "Puzzle", "Queen", "Quicksand"
    , "Quiet", "Race", "Radio", "Raft", "Rag", "Rain", "Rainbow", "Ray"
    , "Red", "Rib", "Room"
    , "Rose", "Rung", "Safe", "Salmon", "Salt"
    , "Sandbox", "Sandwich", "Scar", "School"
    , "Sea", "Seashell", "Season", "Shampoo", "Shark"
    , "Sheep", "Sheets", "Sheriff", "Shirt", "Shoe", "Shorts", "Shower", "Singer"
    , "Snow", "Song", "Space", "Speakers"
    , "Spider", "Sponge", "Spoon", "Spring", "Spy", "Square"
    , "Stairs", "Star", "State", "Stick", "Stove"
    , "Straw", "Stream", "Stripe", "Student", "Sun", "Sunburn", "Sushi", "Swamp"
    , "Sweater", "Swimmer", "Swing", "Taxi", "Teacher", "Teapot", "Teenager", "Telephone"
    , "Ten", "Tennis", "Thief", "Throne", "Thunder", "Tiger", "Time"
    , "Tissue", "Toast", "Toilet", "Toothbrush", "Tornado"
    , "Tractor", "Train", "Trash", "Treasure", "Tree", "Triangle", "Truck", "Tub"
    , "Tuba", "Tutor", "Television", "Twig", "Vest"
    , "Water", "Wax", "Wedding", "Weed", "Welder", "Wheel"
    , "Whisk", "White", "Wig", "Windmill", "Winter", "Wish", "Wolf"
    , "Wool", "World", "Worm", "Wrist", "Zero", "Zipper"
    , "Zoo"];

var total_red = 8;
var total_blue = 9;


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

var mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost/test');
mongoose.connect('mongodb://codenameserver:mash@ds044689.mlab.com:44689/codenames');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    //connected
    function randomString(len) {
        var p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        return [...Array(len)].reduce(a => a + p[~~(Math.random() * p.length)], '');
    }

    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

    serv.listen(process.env.PORT || 5000);
    console.log("Server started.");

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
                id: pid + '-' + i,
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
            function (err, game) {
                var data = game.toJSON();
                //Response with game record and add player id
                //to be stored locally
                data.action = 'start';
                data.player = pid;
                res.send(data);
            });
    });

    var SOCKET_LIST = {};

    io.sockets.on('connection', function (socket) {
        socket.id = Math.random();
        SOCKET_LIST[socket.id] = socket;

        socket.on('disconnect', function () {
            delete SOCKET_LIST[socket.id];
        });

        socket.on('createGame', function () {
            var randNum = new Array(25);
            myRoomName = randomString(8);

            socket.join(myRoomName, function () {
                //Create default room
                var room = new myRoom({
                    roomID: myRoomName,
                    status: 'waiting',
                    numPlayers: 1,
                    players: [{ id: socket.id, team: "blue" }],
                    whoseTurn: "blue",
                    revealedWords: [0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0],
                    // colorWords: ["blue", "red", "black", "brown", "brown",
                    //     "red", "brown", "brown", "brown", "blue",
                    //     "blue", "blue", "blue", "red", "red",
                    //     "blue", "blue", "blue", "blue", "brown",
                    //     "red", "red", "red", "red", "brown"],
                    revealed_red_count: 0,
                    revealed_blue_count: 0,
                    colorGuessed: "",
                    num_guesses: 0,
                    total_guesses: 0
                });
                //shuffle color array
                room.colorWords = shuffle(colorTiles);
                //generating 25 codewords for game object
                var noDuplicateCode = 1;
                var i = 0;
                var k = 0;
                while (i < 25) {
                    noDuplicateCode = 1;
                    randNum[i] = Math.floor(Math.random() * codes.length);
                    if (i == 0) {  //Not possible to have duplicates when adding first codeword to array
                        room.words[i] = codes[randNum[i]];
                        i++;
                    }
                    else {
                        for (k = 0; k <= i - 1; k++) {
                            if (randNum[i] == randNum[k]) {
                                noDuplicateCode = 0; //Duplicate detected so do not add code word in this iteration
                                break;
                            }
                        }
                        if (noDuplicateCode) {   //No duplicate so add codeword
                            room.words[i] = codes[randNum[i]];
                            i++;
                        }
                    }
                }
                //Save to mongoDB
                room.save().then(function () {
                    //Tell client info about roomID, playerID, and the game through the room object
                    SOCKET_LIST[socket.id].emit('myroomjoined', room);
                    console.log('socket has created a game');
                });
            });
        });

        socket.on('joinGame', function (data) {
            //TODO: implement
            if (data.roomName != myRoomName) {
                socket.emit('cannotJoinGame');
            }
            socket.join(data.roomName, function () {
                myRoom.findOne({ roomID: data.roomName }).then(function (record) {
                    //update numplayers and playerid array
                    record.numPlayers = record.numPlayers + 1;
                    //Player team assignment
                    if (record.players.length % 2 === 0) { //even 
                        record.players.push({ id: socket.id, team: "blue" });
                    }
                    else { //odd 
                        record.players.push({ id: socket.id, team: "red" });
                    }

                    //game can start with 4 players
                    //check for 4 players and change status if needed
                    if (record.numPlayers === 4) {
                        record.status = 'starting';
                    }

                    //save to database
                    record.save().then(function () {
                        //Tell client info about roomID, playerID, and the game through room object
                        SOCKET_LIST[socket.id].emit('myroomjoined', record);
                        console.log('new client has joined game');
                    });
                });
            });
            //TODO: check for error here, if room doesn't exist
        });

        socket.on('startgame', (data) => {
            console.log('try to startgame');
            myRoom.findOne({ roomID: data.roomName }).then(function (result) {
                //tell all other players to start if players >= 4
                if (result.status === 'starting') {
                    //console.log('game is starting confirmed');
                    for (var j = 0; j < result.players.length; j++) {
                        SOCKET_LIST[result.players[j].id].emit('everyonestart');
                    }
                    result.status = 'in-progress';
                }
                else {
                    //console.log('game is not starting confirmed');
                }
                //save updated game status 
                result.save().then(function () { });

            });
        });

        //Captains word input, just sends to everyone, frontend displays to everyone?
        socket.on('captainClueWord', function (data) {
            myRoom.findOne({ roomID: data.roomName }).then(function (result) {
                if (data.teamColor == result.whoseTurn) {
                    for (var j = 0; j < result.players.length; j++) {
                        SOCKET_LIST[result.players[j].id].emit('clue', data.clue);
                        SOCKET_LIST[result.players[j].id].emit('updatePrompt', result.whoseTurn);
                    }
                }
                result.save().then(function () { });
            });
        });

        //Captains number input, just sends to everyone, frontend displays to everyone?
        socket.on('captainClueNumber', function (data) {
            myRoom.findOne({ roomID: data.roomName }).then(function (result) {
                if (data.teamColor == result.whoseTurn) {
                    result.num_guesses = data.number;
                    result.total_guesses = data.number;
                    for (var j = 0; j < result.players.length; j++) {
                        SOCKET_LIST[result.players[j].id].emit('number', data.number);
                    }
                }
                result.save().then(function () { });
            });
        });

        //Responce to frontend saying to not make more guesses
        socket.on('captainSwap', function (data) {
            myRoom.findOne({ roomID: data.myRoomName }).then(function (result) {
                //console.log('captainswap called');
                //console.log(result.whoseTurn);
                if (data.teamColor == result.whoseTurn) {
                    result.num_guesses = 0;
                    result.total_guesses = 0;
                    if (result.whoseTurn == "blue") {
                        result.whoseTurn = "red";
                        //SOCKET_LIST[result.players[1].id].emit('giveClue', result.whoseTurn);
                    }
                    else {
                        result.whoseTurn = "blue";
                        //SOCKET_LIST[result.players[0].id].emit('giveClue', result.whoseTurn);
                    }
                    //console.log('going to emit in captainswap');
                    for (var j = 0; j < result.players.length; j++) {
                        SOCKET_LIST[result.players[j].id].emit('updatePromptCaptain', result.whoseTurn);
                    }
                    result.save().then(function () { });
                }
            });
            //TODO: send to just the captain? Check which socket its saved in later
        });

        /*
        socket.on('askForClue', function (data) {
            myRoom.findOne({ roomID: data.roomName }).then(function (result) {
                if (result.whoseTurn == "blue")
                    SOCKET_LIST[result.players[0].id].emit('giveClue', data);
                else
                    SOCKET_LIST[result.players[1].id].emit('giveClue', data);
                result.save().then(function () { });
            });
        });
        */

        //TODO: captainTurn socket sets num_guesses and total_guesses equal to whatever captain typed in 

        socket.on('agentTurn', function (data) { //Call this function from frontend when Captain enters clue and hits submit
            //Frontend needs to send a structure that holds the guessed word string and team color of player that
            //guessed the word
            //Send room id from front end as well 

            console.log('agentTurn began');
            //Create tests
            //Finds all records of myRoom
            //myRoom.find({})

            myRoom.findOne({ roomID: data.myRoomName }).then(function (result) {
                //Implementation of game logic 
                if (data.teamColor == result.whoseTurn) {
                    console.log('color check passed');
                    console.log(result.num_guesses);
                    console.log(result.total_guesses);
                    if (result.total_guesses == 0) {
                        //this shouldn't happen
                        console.log('total guesses is 0 for some reason');
                        //socket.emit('captainTurn', result.whoseTurn);
                        //captain gave 0 as a number or its the default value
                        //either case, skip turn
                        //TODO: switch turns here
                    }
                    //else if (result.num_guesses == result.total_guesses) //At least one guess per turn is required
                    else if (result.num_guesses + 1 > 0) {
                        console.log('# of guess check passed');
                        //Reveal to all players the word_guessed
                        for (var j = 0; j < result.players.length; j++) {
                            SOCKET_LIST[result.players[j].id].emit('guessedTiles', data.wordGuessed);
                        } //Display tiles to all players and gray out guessed tile

                        //Update revealedWords matrix and find color of word guessed
                        for (var k = 0; k < 25; k++) {
                            if (data.wordGuessed == result.words[k]) {
                                result.colorGuessed = result.colorWords[k];
                                result.revealedWords[k] = 1;
                            }
                        }
                        //Make a decision based on the color of the word revealed
                        if (result.whoseTurn == result.colorGuessed) //Correct guess by agent
                        {
                            result.num_guesses--;
                            socket.emit('guessesLeft', result.num_guesses);
                            if (result.whoseTurn == "blue") {
                                result.revealed_blue_count++;
                                if (result.revealed_blue_count == total_blue) //Check if blue team won
                                {
                                    for (var j = 0; j < result.players.length; j++) {
                                        //Expectation for endGame from frontend: display who won and exit the game completely
                                        SOCKET_LIST[result.players[j].id].emit('endGame', "blue");
                                    }
                                }
                            }
                            else {
                                result.revealed_red_count++;
                                if (result.revealed_red_count == total_red) {
                                    //red team wins
                                    for (var j = 0; j < result.players.length; j++) {
                                        SOCKET_LIST[result.players[j].id].emit('endGame', "red");
                                    }
                                }
                            }
                        }
                        else if (result.colorGuessed == "black") //Assassin tile
                        {
                            if (result.whoseTurn == "red") {
                                //blue team won
                                for (var j = 0; j < result.players.length; j++) {
                                    SOCKET_LIST[result.players[j].id].emit('endGame', "blue");
                                }
                            }
                            else {
                                //red team won
                                for (var j = 0; j < result.players.length; j++) {
                                    SOCKET_LIST[result.players[j].id].emit('endGame', "red");
                                }
                            }
                        }
                        else if (result.colorGuessed == "sandybrown") //Neutral tile
                        {
                            result.num_guesses = -1; //Switch turns
                        }
                        else //Guessed opposing team's codeword 
                        {
                            result.num_guesses = -1; //Switch turns
                            if (result.whoseTurn == "blue") {
                                result.revealed_red_count++;
                                if (result.revealed_red_count == total_red) //Check if red team won
                                {
                                    for (var j = 0; j < result.players.length; j++) {
                                        SOCKET_LIST[result.players[j].id].emit('endGame', "red");
                                    }
                                }
                            }
                            else {
                                result.revealed_blue_count++;
                                if (result.revealed_blue_count == total_blue) //Check if blue team won
                                {
                                    for (var j = 0; j < result.players.length; j++) {
                                        SOCKET_LIST[result.players[j].id].emit('endGame', "blue");
                                    }
                                }
                            }
                        }
                        if (result.num_guesses == -1) {
                            socket.emit('captainTurn', result.whoseTurn);
                        }
                    }
                    else { //next turn
                        if ((result.revealed_red_count != total_red) && (result.revealed_blue_count != total_blue)) //No more guesses and no winner
                        {
                            console.log('captainTurn called');
                            //Switch turns

                            /*
                            if (room.whoseTurn == "red") {
                                room.whoseTurn = "blue";
                            }
                            else {
                                room.whoseTurn = "red";
                            }
    
                            */
                            socket.emit('captainTurn', result.whoseTurn); //Break out of this socket (ideally) and allow captain to type in clue
                        }

                        /*
                        else if (result.num_guesses > 0 && (result.revealed_red_count != total_red && result.revealed_blue_count != total_blue)) {
                            for (var j = 0; j < result.players.length; j++) {
                                SOCKET_LIST[result.players[j].id].emit('moreGuesses', result.whoseTurn);
                                // TODO: Frontend asks user if they want to guess more
                                //If they want to guess more, call agentTurn function again
                                //If not,  call captainTurn function with appropriate team color
                            }
                        }
                        */

                    }
                }
                result.save().then(function () { });
            });
        });
    });
});
