const mongoose = require('mongoose');

//Connect to mongodb
mongoose.connect('mongodb://codenameserver:mash@ds044689.mlab.com:44689/codenames');

mongoose.connection.once('open', function(){
    console.log('connection has been made');
}).on('error',function(error){
    console.log('connection error:',error);
});