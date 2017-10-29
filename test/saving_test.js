const mocha = require('mocha');
const assert = require('assert');
const myRoom = require('../models/myRoom.js');

//Describe tests
describe('Saving records', function(){
    //Create tests
    it('Saves a record to database', function(done){
        var room = new myRoom({
            roomID: '123rt',
            status: 'waiting',
            numPlayers: 4
        });

        room.save().then(function(){
            assert(room.isNew === false);
            done();
        });

    });

    //Next test

});