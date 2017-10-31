const mongoose = require('mongoose');

//ES6 Promises
mongoose.Promise = global.Promise;

//Connect to database before tests run
before(function(done){
    //Connect to mongodb
    mongoose.connect('mongodb://codenameserver:mash@ds044689.mlab.com:44689/codenames');

    mongoose.connection.once('open', function(){
        console.log('connection has been made');
        done();
    }).on('error',function(error){
        console.log('connection error:',error);
    });
});

