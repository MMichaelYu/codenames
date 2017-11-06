const assert = require('assert');
const myRoom = require('../models/myRoom.js');



//Describe tests
describe('Deleting records', function(){
    var room;
    beforeEach(function(done){
        room = new myRoom({
            roomID: '123rt',
            status: 'waiting',
            numPlayers: 4
        });

        room.save().then(function(){
            assert(room.isNew === false);
            done();
        });
    });
    
    //Create tests
    it('Delete one record from database', function(done){
        //Finds all records of myRoom
        //myRoom.find({})

        myRoom.findOneAndRemove({ roomID: '123rt'}).then(function(result){
            myRoom.findOne({roomID: '123rt'}).then(function(result){
                assert(result === null);
                done();
            });

        });


    });

    //Next test

});