const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema and Model

const myPlayerSchema = new Schema({
    id: String,
    name: String,
    team: String,
    role: String
});

const myRoomSchema = new Schema({
    roomID: String,
    status: String,
    numPlayers: Number,
    players: [myPlayerSchema]
    //whose turn is it
    //25-array tuples of word,color,isitrevealed yet
});

const myPlayer = mongoose.model('myPlayer', myPlayerSchema);
const myRoom = mongoose.model('myRoom', myRoomSchema);

module.exports = myPlayer;
module.exports = myRoom;
