/*this is one template function that can be passed to add_item_to_list_with_template 
  and add the remove event of the button
  or you can create another template function wich create a dom element like 
  Document.createElement() and add the event to that element
  https://developer.mozilla.org/es/docs/Web/API/Document/createElement 
*/
let totalWeight=0
let get_element_li  = (name, weight,img) => {
    return `<li class="added-pokemon">name: ${name}  weight: <span class="weight">${weight} <img src="${img}"></img></span> <button class="remove-pokemon">remove</button></li>`
  }
  
  let add_item_to_list_with_template = (name, weight, img) => {

        //console.log("pokemon: "+name+" weight: "+weight+" img: "+img);
        let element = get_element_li(name, weight, img);
        //console.log(element)
        list=document.getElementById("list-items").innerHTML += element;
        //Calculate weight
        totalWeight+=weight
        document.getElementById("total").innerHTML = "Total: "+totalWeight;
        //Adding listeners to buttons
        let removeButtons = document.getElementsByClassName("remove-pokemon");
        for(let i=0; i<removeButtons.length;i++){
            removeButtons[i].addEventListener("click", (event)=>
                remove_element_event(event.target.parentNode)
            );
        }
}       
  /*
   for removing elements could be this way
    let element_to_delete = document.querySelector("selector").lastElementChild;
    element_to_delete.parentNode.removeChild(element_to_delete);
    or we could use ChildNode.remove()
    https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove
  */
  let remove_element_event = (node_to_remove) => {
      //console.log("inside remove list")
      let list = document.getElementById("list-items")
      //console.log(node_to_remove.children[0].textContent)
      totalWeight -= parseFloat(node_to_remove.children[0].textContent);
      document.getElementById("total").innerHTML = "Total: "+totalWeight;
      list.removeChild(node_to_remove);
  }
  
  let thenable_handle_for_the_result_of_the_pokemon_request = (result) => {
    //console.log(result.data.name);
    //console.log(result.data.weight)
    add_item_to_list_with_template(result.data.name, 
                                result.data.weight, 
                                result.data.sprites.front_default)
  }
  
  
  /* 
    for this it can be solved by adding a custom XMLHttpRequest but i don't recomend it, try to 
    use other libs that basically solve this, an alternative you can use axios 
    https://www.npmjs.com/package/axios
  */
 let get_pokemon_data = () => {
    return (event) => {
        //Get pokemon name with format
        let pokemonName = document.getElementById("pokemon-name").value.trim().toLowerCase();
        //console.log(pokemonName)
        //Call to the api
        if(pokemonName!=""){
            axios
            .get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
            .then(function(res){
                document.getElementById("error").innerHTML = ""
                thenable_handle_for_the_result_of_the_pokemon_request(res)
            })
            .catch(function(err){
                console.log("Error: Invalid pokemon name"+ err)
                document.getElementById("error").innerHTML = "Error: Invalid pokemon name"
            });
        }    
    }
  }

  document.addEventListener("DOMContentLoaded", 
    function(event) {  
        //Add listener to the button: call getData function
        document.getElementById("total").innerHTML = "Total: "+totalWeight;
        document.getElementById("add-item").addEventListener("click", get_pokemon_data());  
    })
