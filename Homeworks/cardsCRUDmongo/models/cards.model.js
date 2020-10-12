const { Double, Decimal128 } = require('mongodb');
const mongoose = require('mongoose');

var pokemonSchema = new mongoose.Schema({
    typeCard:{
        type: String
    },
    name: {
        type: String
    },
    id: {
        type: String
    },
    weight: {
        type: Decimal128
    },
    height: {
        type: Decimal128
    },
    base_experience: {
        type: Decimal128
    },
    types: {
        type: Array
    },
    img: {
        type: String
    },
    valuePx: {
        type: Decimal128
    }
});

module.exports = mongoose.model('pokemons', pokemonSchema);
