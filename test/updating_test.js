const assert = require('assert');
const myRoom = require('../models/myRoom.js');

//Describe tests
describe('Updating records', function(){
    var room;
    beforeEach(function(done){
        room = new myRoom({
            roomID: '123rt',
            status: 'waiting',
            numPlayers: 4,
            players: [{id: '321asd', team: 'blue', role: 'captain'}]
        });

        room.save().then(function(){
            done();
        });
    });
    
    //Create tests
    it('Update one record in database', function(done){
        //Finds all records of myRoom
        //myRoom.find({})

        myRoom.findOneAndUpdate({roomID: '123rt'},{roomID: '234ty'}).then(function(){
            myRoom.findOne({_id: room._id}).then(function(result){
                assert(result.roomID === '234ty');
                done();
            });
        });


    });

    //Next test

});