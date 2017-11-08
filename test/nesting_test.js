const assert = require('assert');
const mongoose = require('mongoose');
const myRoom = require('../models/myRoom');

//Describe tests
describe('Nesting records', function(){
    
    beforeEach(function(done){
        mongoose.connection.collections.myrooms.drop(function(){
            done();
        });
    });
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
                //add a player to the players array
                record.players.push({id: '890iop', team: 'read', role: 'captain'});
                record.save().then(function(){
                    myRoom.findOne({roomID: '123qwe'}).then(function(result){
                        assert(result.players.length === 2);
                        done();
                    });
                });
            });
        });
    });
});