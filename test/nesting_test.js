const assert = require('assert');
const mongoose = require('mongoose');
const myRoom = require('../models/myRoom');

//Describe tests
describe('Nesting records', function(){
    //Create tests
    it('Create a myRoom with sub-documents', function(done){
        var room = new myRoom({
            roomID: '123qwe',
            players: [{id: '321asd', team: 'blue', role: 'captain'}]
        });

        room.save().then(function(){
            myRoom.findOne({roomID: '123qwe'}).then(function(record){
                assert(record.players.length === 1);
                done();
            });
        });
    });

    it('Adds a player to myRoom', function(done){
        var room = new myRoom({
            roomID: '123qwe',
            players: [{id: '321asd', team: 'blue', role: 'captain'}]
        });
        
        room.save().then(function(){
            myRoom.findOne({roomID: '123qwe'}).then(function(record){

            });
        });
    });
});