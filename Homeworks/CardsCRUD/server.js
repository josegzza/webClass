const express = require('express')
const cors = require('cors')
const axios = require('axios');
const { type } = require('os');
const { response } = require('express');
const app = express();
const fs = require('fs'); //Open/use JSON files
app.use(cors())
const port = 8080;
let pokemons = {}
let pokemonCard = {}
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

//Read file
let data = fs.readFileSync('cards.json');
let cards = JSON.parse(data);
let reply=""

//delete card => need to send type_card & name_card
app.delete('/delete/:type_card/:name_card', (req, res) => {
    let type_card = req.params.type_card;
    let name_card = req.params.name_card;
    reply=""
    if (cards[type_card]) {
        if(cards[type_card][name_card]){
            reply={
                    status: "Delete complete!",
                    "card deleted": cards[type_card][name_card],
            }
            delete cards[type_card][name_card];
            //Deleting to JSON
            data = JSON.stringify(cards, null, 2);
            fs.writeFile('cards.json', data, err => {
                console.log('Delete set.')
            });
            console.log("pokemon Card Deleted!");    
        }
        else{
            reply="card not found!"
        }
    }
    else{
        reply="Incorrect type card"
    }
    res.send(reply);
});

//update data => need to send type_card, name_card, attribute to change, new value.
app.put('/update/:type_card/:name_card/:attr/:value', (req, res) => {
    let type_card = req.params.type_card;
    console.log(type_card)
    let name_card = req.params.name_card;
    let attr = req.params.attr;
    let value = req.params.value;
    reply="";

    if(cards[type_card]){
        if(cards[type_card][name_card]){
            if(cards[type_card][name_card][attr]){
                let old=cards[type_card][name_card][attr];
                cards[type_card][name_card][attr]=value;
                //Updateing to JSON
                data = JSON.stringify(cards, null, 2);
                fs.writeFile('cards.json', data, err => {
                    console.log('update set.')
                });
                console.log("pokemon Card updated!");                
                reply={
                    status: "Card updated!",
                    atribute : attr,
                    "old value": old,
                    "new value": cards[type_card][name_card][attr]
                }
            }
            else{
                reply="Incorrect attribute"
            }
        }
        else{
            reply="Incorrect name of card"
        }
    }
    else{
        reply="Incorrect type of card"
    }
    res.send(reply);
});

//Create card
//Backend function to connect to the api
//Params: type_cards & nameCard
app.post('/createCard', (req, res) => {
    //:type_card/:name_card
    let type_card = req.body.type;
    let name_card = req.body.name;
    //console.log("type: "+type_card+"name: "+name_card)
    let reply={
    };
    
    //Inspect which type card is
    switch (type_card){
        case "pokemon":
        axios
        .get(`http://pokeapi.co/api/v2/pokemon/${name_card}`) 
        .then(pokemon_response => {
            //console.log(pokemon_response.data); 
            let namePokemon=pokemon_response.data.name;
            pokemons[namePokemon] = pokemon_response.data;
        
            //Format types names of pokemon
            let typesNames = []
            pokemon_response.data.types.forEach((typeData)=>{
                typesNames.push(typeData.type.name);
            })
            let id = pokemon_response.data.id;
            let img = `https://pokeres.bastionbot.org/images/pokemon/${id}.png`
            //Creating pokemonObject
            pokemonCard = {
                "name": namePokemon,
                "id": id,
                "weight": pokemon_response.data.weight,
                "height": pokemon_response.data.height,
                "base experience": pokemon_response.data.base_experience,
                "types": typesNames,
                "img": img
            }
            
            //Adding pokemonObject to cards JSON
            cards.pokemon[namePokemon]=pokemonCard;
            //Adding to JSON
            data = JSON.stringify(cards, null, 2);
            fs.writeFile('cards.json', data, err => {
                console.log('all set.')
            });
            console.log("pokemon Card added!");
            res.json(pokemonCard) //return data card
        }).catch(function(error) {
          console.log(error)
          res.send("error");
        });
        break;
        case "item":
            //console.log("item type card");
            pokemonCard = {
                "type": type_card,
                "name": name_card,
                "valuePx": req.body.valuePx
            }
            //Adding pokemonObject to cards JSON
            cards.item[name_card]=pokemonCard;
            data = JSON.stringify(cards, null, 2);
            fs.writeFile('cards.json', data, err => {
                console.log('all set.')
            });
            console.log("item Card added!");
            res.json(pokemonCard) //return data card
        break;
        case "price":
            pokemonCard = {
                "type": type_card,
                "name": name_card,
                "valuePx": req.body.valuePx
            }
            //Adding pokemonObject to cards JSON
            cards.price[name_card]=pokemonCard;
            //Adding to JSON
            data = JSON.stringify(cards, null, 2);
            fs.writeFile('cards.json', data, err => {
                console.log('all set.')
            });
            console.log("price Card added!");
            res.json(pokemonCard) //return data card
        break;
        case "element":
            pokemonCard = {
                "type": type_card,
                "name": name_card,
                "valuePx": req.body.valuePx
            }
            //Adding pokemonObject to cards JSON
            cards.element[name_card]=pokemonCard;
            //Adding to JSON
            data = JSON.stringify(cards, null, 2);
            fs.writeFile('cards.json', data, err => {
                console.log('all set.')
            });
            console.log("element Card added!");
            res.json(pokemonCard) //return data card
        break;
        default:
            console.log("Not correct type");
        break;    
    }  
     //return data card
    //res.json(reply);
});

//get all cards
app.get('/all', (req, res) => {
    res.send(cards);
});

//Get specific card => need (type_card & name_card(pokemon))
app.get('/get/:type_card/:name_card', (req, res) => {
    let type_card = req.params.type_card;
    let name_card = req.params.name_card;
    reply="";
    
    let data = cards[type_card][name_card];
    //console.log("path: "+JSON.stringify(data, null, 2));
    if(data){
        reply = {
            status: "card founded!",
            "data": data 
        }
    }
    else{
        reply = {
            status: "Not found",
            type: type_card,
            name: name_card
        }
    }
    res.send(reply);
});


app.listen(port)
