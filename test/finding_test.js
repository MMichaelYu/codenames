const assert = require('assert');
const myRoom = require('../models/myRoom.js');



//Describe tests
describe('Finding records', function(){
    var room;
    beforeEach(function(done){
        room = new myRoom({
            roomID: '123rt',
            status: 'waiting',
            numPlayers: 4
        });

        room.save().then(function(){
            done();
        });
    });
    
    //Create tests
    it('Finds one record from database', function(done){
        //Finds all records of myRoom
        //myRoom.find({})

        myRoom.findOne({ roomID: '123rt'}).then(function(result){
            assert(result.roomID === '123rt');
            done();
        });


    });

    //Next test
    it('Finds one record from database by ID', function(done){
        //Finds all records of myRoom
        //myRoom.find({})

        myRoom.findOne({ _id: room._id}).then(function(result){
            assert(result._id.toString() === room._id.toString());
            done();
        });


    });
});