const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/pokemons';

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err) =>{
    if (!err) {console.log("MongoDB connection succeded!")}
    else {console.log('Error in DB connection: '+ err)}
});

require('./cards.model');


