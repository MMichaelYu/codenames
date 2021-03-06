const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema and Model

const myPlayerSchema = new Schema({
    id: String,
    //name: String,
    team: String,
    role: String
});

const myRoomSchema = new Schema({
    roomID: String,
    status: String,
    numPlayers: Number,
    players: [myPlayerSchema],
    //whose turn is it
    whoseTurn: String,
    words: [String],
    //0 is unrevealed, 1 is revealed 
    revealedWords: [Boolean],
    //blue/red/black/brown
    colorWords: [String],
    revealed_red_count: Number,
    revealed_blue_count: Number,
    colorGuessed:String,
    num_guesses: Number,
    total_guesses: Number
    //25-array tuples of word,color,isitrevealed yet
});

//const myPlayer = mongoose.model('myPlayer', myPlayerSchema);
const myRoom = mongoose.model('myRoom', myRoomSchema);

//module.exports = myPlayer;
module.exports = myRoom;
