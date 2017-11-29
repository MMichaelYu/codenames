var express = require('express');
var app = express();
var serv = require('http').Server(app);
var io = require('socket.io')(serv, {});
const myRoom = require('./models/myRoom.js');


var codes = ["Acne", "Acre", "Addendum", "Advertise", "Aircraft", "Aisle", "Alligator", "Alphabetize", "America", "Ankle"
    , "Apathy", "Applause", "Applesauce", "Application", "Archaeologist", "Aristocrat", "Arm", "Armada", "Asleep", "Astronaut"
    , "Athlete", "Atlantis", "Aunt", "Avocado", "Baby-Sitter", "Backbone", "Bag", "Baguette", "Bald", "Balloon"
    , "Banana", "Banister", "Baseball", "Baseboards", "Basketball", "Bat", "Battery", "Beach", "Beanstalk", "Bedbug"
    , "Beer", "Beethoven", "Belt", "Bib", "Bicycle", "Big", "Bike", "Billboard", "Bird"
    , "Birthday", "Bite", "Blacksmith", "Blanket", "Bleach", "Blimp", "Blossom", "Blueprint", "Blunt", "Blur"
    , "Boa", "Boat", "Bob", "Bobsled", "Body", "Bomb", "Bonnet", "Book", "Booth", "Bowtie"
    , "Box", "Boy", "Brainstorm", "Brand", "Brave", "Bride", "Bridge", "Broccoli", "Broken", "Broom"
    , "Bruise", "Brunette", "Bubble", "Buddy", "Buffalo", "Bulb", "Bunny", "Bus", "Buy", "Cabin"
    , "Cafeteria", "Cake", "Calculator", "Campsite", "Can", "Canada", "Candle", "Candy", "Cape", "Capitalism"
    , "Car", "Cardboard", "Cartography", "Cat", "Cd", "Ceiling", "Cell", "Century", "Chair", "Chalk"
    , "Champion", "Charger", "Cheerleader", "Chef", "Chess", "Chew", "Chicken", "Chime", "China", "Chocolate"
    , "Church", "Circus", "Clay", "Cliff", "Cloak", "Clockwork", "Clown", "Clue", "Coach", "Coal"
    , "Coaster", "Cog", "Cold", "College", "Comfort", "Computer", "Cone", "Constrictor", "Continuum", "Conversation"
    , "Cook", "Coop", "Cord", "Corduroy", "Cot", "Cough", "Cow", "Cowboy", "Crayon", "Cream"
    , "Crisp", "Criticize", "Crow", "Cruise", "Crumb", "Crust", "Cuff", "Curtain", "Cuticle", "Czar"
    , "Dad", "Dart", "Dawn", "Day", "Deep", "Defect", "Dent", "Dentist", "Desk", "Dictionary"
    , "Dimple", "Dirty", "Dismantle", "Ditch", "Diver", "Doctor", "Dog", "Doghouse", "Doll", "Dominoes"
    , "Door", "Dot", "Drain", "Draw", "Dream", "Dress", "Drink", "Drip", "Drums", "Dryer"
    , "Duck", "Dump", "Dunk", "Dust", "Ear", "Eat", "Ebony", "Elbow", "Electricity", "Elephant"
    , "Elevator", "Elf", "Elm", "Engine", "England", "Ergonomic", "Escalator", "Eureka", "Europe", "Evolution"
    , "Extension", "Eyebrow", "Fan", "Fancy", "Fast", "Feast", "Fence", "Feudalism", "Fiddle", "Figment"
    , "Finger", "Fire", "First", "Fishing", "Fix", "Fizz", "Flagpole", "Flannel", "Flashlight", "Flock"
    , "Flotsam", "Flower", "Flu", "Flush", "Flutter", "Fog", "Foil", "Football", "Forehead", "Forever"
    , "Fortnight", "France", "Freckle", "Freight", "Fringe", "Frog", "Frown", "Gallop", "Game", "Garbage"
    , "Garden", "Gasoline", "Gem", "Ginger", "Gingerbread", "Girl", "Glasses", "Goblin", "Gold", "Goodbye"
    , "Grandpa", "Grape", "Grass", "Gratitude", "Gray", "Green", "Guitar", "Gum", "Gumball", "Hair"
    , "Half", "Handle", "Handwriting", "Hang", "Happy", "Hat", "Hatch", "Headache", "Heart", "Hedge"
    , "Helicopter", "Hem", "Hide", "Hill", "Hockey", "Homework", "Honk", "Hopscotch", "Horse", "Hose"
    , "Hot", "House", "Houseboat", "Hug", "Humidifier", "Hungry", "Hurdle", "Hurt", "Hut", "Ice"
    , "Implode", "Inn", "Inquisition", "Intern", "Internet", "Invitation", "Ironic", "Ivory", "Ivy", "Jade", "Japan"
    , "Jeans", "Jelly", "Jet", "Jig", "Jog", "Journal", "Jump", "Key", "Killer", "Kilogram", "King"
    , "Kitchen", "Kite", "Knee", "Kneel", "Knife", "Knight", "Koala", "Lace", "Ladder", "Ladybug"
    , "Lag", "Landfill", "Lap", "Laugh", "Laundry", "Law", "Lawn", "Lawnmower", "Leak", "Leg"
    , "Letter", "Level", "Lifestyle", "Ligament", "Light", "Lightsaber", "Lime", "Lion", "Lizard", "Log"
    , "Loiterer", "Lollipop", "Loveseat", "Loyalty", "Lunch", "Lunchbox", "Lyrics", "Machine", "Macho", "Mailbox"
    , "Mammoth", "Mark", "Mars", "Mascot", "Mast", "Matchstick", "Mate", "Mattress", "Mess", "Mexico"
    , "Midsummer", "Mine", "Mistake", "Modern", "Mold", "Mom", "Monday", "Money", "Monitor", "Monster"
    , "Mooch", "Moon", "Mop", "Moth", "Motorcycle", "Mountain", "Mouse", "Mower", "Mud", "Music"
    , "Mute", "Nature", "Negotiate", "Neighbor", "Nest", "Neutron", "Niece", "Night", "Nightmare", "Nose"
    , "Oar", "Observatory", "Office", "Oil", "Old", "Olympian", "Opaque", "Opener", "Orbit", "Organ"
    , "Organize", "Outer", "Outside", "Ovation", "Overture", "Pail", "Paint", "Pajamas", "Palace", "Pants"
    , "Paper", "Paper", "Park", "Parody", "Party", "Password", "Pastry", "Pawn", "Pear", "Pen"
    , "Pencil", "Pendulum", "Penny", "Pepper", "Personal", "Philosopher", "Phone", "Photograph", "Piano", "Picnic"
    , "Pigpen", "Pillow", "Pilot", "Pinch", "Ping", "Pinwheel", "Pirate", "Plaid", "Plan", "Plank"
    , "Plate", "Platypus", "Playground", "Plow", "Plumber", "Pocket", "Poem", "Point", "Pole", "Pomp"
    , "Pong", "Pool", "Popsicle", "Population", "Portfolio", "Positive", "Post", "Princess", "Procrastinate", "Protestant"
    , "Psychologist", "Publisher", "Punk", "Puppet", "Puppy", "Push", "Puzzle", "Quarantine", "Queen", "Quicksand"
    , "Quiet", "Race", "Radio", "Raft", "Rag", "Rainbow", "Rainwater", "Random", "Ray", "Recycle"
    , "Red", "Regret", "Reimbursement", "Retaliate", "Rib", "Riddle", "Rim", "Rink", "Roller", "Room"
    , "Rose", "Round", "Roundabout", "Rung", "Runt", "Rut", "Sad", "Safe", "Salmon", "Salt"
    , "Sandbox", "Sandcastle", "Sandwich", "Sash", "Satellite", "Scar", "Scared", "School", "Scoundrel", "Scramble"
    , "Scuff", "Seashell", "Season", "Sentence", "Sequins", "Set", "Shaft", "Shallow", "Shampoo", "Shark"
    , "Sheep", "Sheets", "Sheriff", "Shipwreck", "Shirt", "Shoelace", "Short", "Shower", "Shrink", "Sick"
    , "Siesta", "Silhouette", "Singer", "Sip", "Skate", "Skating", "Ski", "Slam", "Sleep", "Sling"
    , "Slow", "Slump", "Smith", "Sneeze", "Snow", "Snuggle", "Song", "Space", "Spare", "Speakers"
    , "Spider", "Spit", "Sponge", "Spool", "Spoon", "Spring", "Sprinkler", "Spy", "Square", "Squint"
    , "Stairs", "Standing", "Star", "State", "Stick", "Stockholder", "Stoplight", "Stout", "Stove", "Stowaway"
    , "Straw", "Stream", "Streamline", "Stripe", "Student", "Sun", "Sunburn", "Sushi", "Swamp", "Swarm"
    , "Sweater", "Swimming", "Swing", "Tachometer", "Talk", "Taxi", "Teacher", "Teapot", "Teenager", "Telephone"
    , "Ten", "Tennis", "Thief", "Think", "Throne", "Through", "Thunder", "Tide", "Tiger", "Time"
    , "Tinting", "Tiptoe", "Tiptop", "Tired", "Tissue", "Toast", "Toilet", "Tool", "Toothbrush", "Tornado"
    , "Tournament", "Tractor", "Train", "Trash", "Treasure", "Tree", "Triangle", "Trip", "Truck", "Tub"
    , "Tuba", "Tutor", "Television", "Twang", "Twig", "Twitterpated", "Type", "Unemployed", "Upgrade", "Vest"
    , "Vision", "Wag", "Water", "Watermelon", "Wax", "Wedding", "Weed", "Welder", "Whatever", "Wheelchair"
    , "Whiplash", "Whisk", "Whistle", "White", "Wig", "Will", "Windmill", "Winter", "Wish", "Wolf"
    , "Wool", "World", "Worm", "Wristwatch", "Yardstick", "Zamboni", "Zen", "Zero", "Zipper", "Zone"
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

    serv.listen(process.env.PORT || 5000);
    console.log("Server started.");

    mongoose.Schema({
        room: { type: String, index: true },
        status: String,
        numPlayers: Number,

        players: [mongoose.Schema({
            id: String,
            name: String,
            status: String
        }, { _id: false })]
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
    var PLAYER_LIST = {};

    io.sockets.on('connection', function (socket) {
        socket.id = Math.random();
        SOCKET_LIST[socket.id] = socket;

        //var player = Player(socket.id);
        //PLAYER_LIST[socket.id] = player;

        socket.on('disconnect', function () {
            delete SOCKET_LIST[socket.id];
            delete PLAYER_LIST[socket.id];
        });

        socket.on('createGame', function () {
            var randNum = new Array(25);
            myRoomName = randomString(8);
            //playerID = randomString(4);

            socket.join(myRoomName, function () {
                //Create default room
                var room = new myRoom({
                    roomID: myRoomName,
                    status: 'waiting',
                    numPlayers: 1,
                    players: [{ id: socket.id, team: "blue" }],
                    //players: [playerID],
                    whoseTurn: "blue",
                    words: ["", "", "", "", "",
                        "", "", "", "", "",
                        "", "", "", "", "",
                        "", "", "", "", "",
                        "", "", "", "", ""],
                    revealedWords: [0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0],
                    colorWords: ["blue", "red", "black", "brown", "brown",
                        "red", "brown", "brown", "brown", "blue",
                        "blue", "blue", "blue", "red", "red",
                        "blue", "blue", "blue,", "blue", "brown",
                        "red", "red", "red", "red", "brown"],
                    revealed_red_count: 0,
                    revealed_blue_count: 0,
                    colorGuessed: "",
                    num_guesses: 0,
                    total_guesses: 0
                });


                //Sending 25 codewords to client
                var noDuplicateCode = 1;
                var i = 0;
                var k = 0;
                while (i < 25) {
                    noDuplicateCode = 1;
                    randNum[i] = Math.floor(Math.random * codes.length);
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
                    //io.in("default").emit('myroomjoined', room);
                    //console.log("now in rooms", socket.rooms);
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
                        for (var j in myRoom.players) {
                            if (j == 0) {
                                SOCKET_LIST[0].emit('role', "blue captain");
                            }
                            if (j == 1) {
                                SOCKET_LIST[1].emit('role', "red captain");
                            }
                            if (j == 2) {
                                SOCKET_LIST[2].emit('role', "blue team member");
                            }
                            if (j == 3) {
                                SOCKET_LIST[3].emit('role', "red team member");
                            }

                        }
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


        //Captains word input, just sends to everyone, frontend displays to everyone?
        socket.on('captainClueWord', function (data) {
            for (var j in myRoom.players) {
                SOCKET_LIST[j.id].emit('clue', data)
            }
        });

        //Captains number input, just sends to everyone, frontend displays to everyone?
        socket.on('captainClueNumber', function (data) {
            for (var j in myRoom.players) {
                SOCKET_LIST[j.id].emit('number', data)
            }
            room.num_guesses = data;
            room.total_guesses = data;
        });

        //Responce to frontend saying to not make more guesses
        socket.on('captainSwap', function (data) {
            if (room.whoseTurn == "blue") {
                room.whoseTurn = "red";
                SOCKET_LIST[1].emit('captainTurn', room.whoseTurn);
            }
            else {
                room.whoseTurn = "blue";
                SOCKET_LIST[0].emit('captainTurn', room.whoseTurn);
            }
            //TODO: send to just the captain? Check which socket its saved in later
        });

        //TODO: captainTurn socket sets num_guesses and total_guesses equal to whatever captain typed in 

        socket.on('agentTurn', function (data) { //Call this function from frontend when Captain enters clue and hits submit
            //Frontend needs to send a structure that holds the guessed word string and team color of player that
            //guessed the word
            //Send room id from front end as well 


            //Create tests
            //Finds all records of myRoom
            //myRoom.find({})

            myRoom.findOne({ roomID: data.myRoomName }).then(function (myRoom) {
                //Implementation of game logic 
                if (data.team == "blue") {
                    room.whoseTurn = "blue";
                }
                else if (data.team == "red") {
                    room.whoseTurn = "red";
                }
                if (room.num_guesses == room.total_guesses) //At least one guess per turn is required
                {
                    //Reveal to all players the word_guessed
                    for (var j in myRoom.players) {
                        SOCKET_LIST[j.id].emit('guessedTiles', data.wordGuessed); //Display tiles to all players and gray out guessed tile
                    }
                    //Update revealedWords matrix and find color of word guessed
                    for (var k = 0; k < 25; k++) {
                        if (data.wordGuessed == room.words[k]) {
                            room.colorGuessed = room.colorWords[k];
                            room.revealedWords[k] = 1;
                        }
                    }
                    //Make a decision based on the color of the word revealed
                    if (room.whoseTurn == room.colorGuessed) //Correct guess by agent
                    {
                        room.num_guesses--;
                        if (room.whoseTurn == "blue") {
                            room.revealed_blue_count++;
                            if (room.revealed_blue_count == total_blue) //Check if blue team won
                            {
                                for (var j in myRoom.players) {
                                    //Expectation for endGame from frontend: display who won and exit the game completely
                                    SOCKET_LIST[j.id].emit('endGame', "blue"); //Blue team won  
                                }
                            }
                        }
                        else {
                            room.revealed_red_count++;
                            if (room.revealed_red_count == total_red) {
                                for (var j in myRoom.players) {
                                    SOCKET_LIST[j.id].emit('endGame', "red"); //Red team won
                                }
                            }
                        }
                    }
                    else if (room.colorGuessed == "black") //Assassin tile
                    {
                        if (room.whoseTurn == "red") {
                            for (var j in myRoom.players) {
                                SOCKET_LIST[j.id].emit('endGame', "blue"); //Blue team won
                            }
                        }
                        else {
                            for (var j in myRoom.players) {
                                SOCKET_LIST[j.id].emit('endGame', "red"); //Red team won
                            }
                        }
                    }
                    else if (room.colorGuessed == "brown") //Neutral tile
                    {
                        room.num_guesses = 0; //Switch turns
                    }
                    else //Guessed opposing team's codeword 
                    {
                        room.num_guesses = 0; //Switch turns
                        if (room.whoseTurn == "blue") {
                            room.revealed_red_count++;
                            if (room.revealed_red_count == total_red) //Check if red team won
                            {
                                for (var j in myRoom.players) {
                                    SOCKET_LIST[j.id].emit('endGame', "red"); //Red team won
                                }
                            }
                        }
                        else {
                            room.revealed_blue_count++;
                            if (room.revealed_blue_count == total_blue) //Check if blue team won
                            {
                                for (var j in myRoom.players) {

                                    SOCKET_LIST[j.id].emit('endGame', "blue"); //Blue team won
                                }
                            }
                        }
                    }
                }
                else if (room.num_guesses != room.total_guesses) {
                    if (room.num_guesses == 0 && (room.revealed_red_count != total_red && room.revealed_blue_count != total_blue)) //No more guesses and no winner
                    {
                        //Switch turns
                        if (room.whoseTurn == "red") {
                            room.whoseTurn = "blue";
                        }
                        else {
                            room.whoseTurn = "red";
                        }
                        socket.emit('captainTurn', room.whoseTurn); //Break out of this socket (ideally) and allow captain to type in clue
                    }
                    else if (room.num_guesses > 0 && (room.revealed_red_count != total_red && room.revealed_blue_count != total_blue)) {
                        for (var j in myRoom.players) {
                            SOCKET_LIST[j.id].emit('moreGuesses', room.whoseTurn); // TODO: Frontend asks user if they want to guess more
                            //If they want to guess more, call agentTurn function again
                            //If not,  call captainTurn function with appropriate team color
                        }
                    }
                }
            });
            //Saving test
            //Describe tests
            //Create tests
            myRoom.save().then(function () { });
        });
    });
});