//Format the cards with the data
let get_element_li  = (name, id, weight, height, exp, types, img) => {
    return `
    <div class="column">
    <div class="card">
    <img src=${img} width="100px" height="100px">
      <div class="container_card">
        <h4><b>${name}</b></h4>
        <h3>id: #${id}</h3> 
        <p>weight: ${weight} height: ${height}</p>
        <p>base experience: ${exp}</p>
        <p>Types: ${types}</p>
      </div>
      <button class="remove-pokemon">remove</button>
    </div>
    </div>
    `
}


let pokemons = {} //Dictionary of pokemons

//Extract key of the dictionary from the node
let extractNameFromNode = (node) => {
  return node.childNodes[1].childNodes[3].childNodes[1].textContent;
}

//add data to front
let add_item_to_list_with_template = (name, id, weight, height, exp, types, img) => {

    //console.log("pokemon: "+name+" weight: "+weight+" img: "+img);
    let element = get_element_li(name, id, weight, height, exp, types, img);
    document.getElementById("list-items").innerHTML += element;
    
    //Adding listeners to buttons
    let removeButtons = document.getElementsByClassName("remove-pokemon");
    for(let i=0; i<removeButtons.length;i++){
        removeButtons[i].addEventListener("click", (event)=>
            remove_element_event(event.target.parentNode.parentNode)
        );
    }

}

//Remove card
let remove_element_event = (node_to_remove) => {
  //console.log("inside remove list "+ name)
  //Erase from dictionary
  delete pokemons[extractNameFromNode(node_to_remove)]; 
  let list = document.getElementById("list-items")
  list.removeChild(node_to_remove);
}


let thenable_handle_for_the_result_of_the_pokemon_request = (result) => {
    //save pokemon in the dictionary
    pokemons[result.name]=result;
    //Update data in front
    add_item_to_list_with_template(result.name, result.id, result.weight, result.height, result.base_experience, result.types, result.img);
}

document.addEventListener("DOMContentLoaded", function(_){  
    
  let event_handler = async (event) =>{
      let pokemonName = document.getElementsByClassName("pokemon")[0].value.trim().toLowerCase();
      let type_card = "pokemon";  
      let data;
      let options;

    switch (type_card){
        case "pokemon":
            if(!(pokemonName in pokemons)){      
                data={
                    type: "pokemon",
                    name: pokemonName,
                }
            }
        break;
        case "items":
            data={
                type: "item",
                name : "item01",
                valuePx : 100 
            };
        break;
        case "element":
            data={
                type: "element",
                name : "element01",
                valuePx : 100 
            };
        break;
        case "price":
            data={
                type: "price",
                name : "price01",
                valuePx : 100 
            };
        break;
        default:
            data={
                status:"ERROR"
            }   
        break;           
    }

    //Send data to express post method
    options={
        method: 'POST',
        headers : {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(data)
    };

    let response = await fetch('http://localhost:8080/createCard', options) //call to post method server
    let json = await response.json() //receive data from api
    //console.log(json)
    switch (type_card){
        case "pokemon":
            thenable_handle_for_the_result_of_the_pokemon_request(json) //formating pokemon card data 
        break;
        case "items":
            console.log("item data");
        break;
        case "element":
            console.log("element data");
        break;
        case "price":
            console.log("price data");
        break;
        default:
        break;    
    }
    
  }
  
  let boton = document.getElementById("search"); 
  boton.addEventListener("click", event_handler);
}); 


