//Variables
let total = 0;

//Extract values function from HTML file
function get_element_li (name, price) {
  return `<li class="added-item">name: ${name} price: <span class="price">${price}</span> <button class="remove-item">remove</button></li>`
}

//Add item function
let add_item_to_list_with_template = (template_function) => {
  return (event) => {

    //Extract values from the document
    let item_name = document.querySelector("#items").value;
    let item_value = document.querySelector("#price").value;
    let node = document.querySelector("#container");   
    //Send to template
    let template = template_function(item_name, item_value);
    
    //item and value box is empty?
    if(item_name&&!isNaN(item_value)){
      //Quit color
      node.className = "white";
      document.getElementById("list-items").innerHTML += template;
      total += parseFloat(item_value)
      //Calculate total
      document.getElementById("total").innerHTML = "Total: " + total;
      let removeButtons = document.getElementsByClassName("remove-item");
      for(let i=0; i<removeButtons.length;i++){
        removeButtons[i].addEventListener("click", (event) =>
          remove_item(event.target.parentNode)    
        );
      }
    }
    else{ 
      //Change color to red
      node.className = "red";
    }
  }
}

//Remove from the list
let remove_item  = (node_to_remove) => {
  let list_of_items = document.getElementById("list-items");
  //Extract value and rest to total
  total -= parseFloat(node_to_remove.children[0].innerHTML)
  //Update total in document
  document.getElementById("total").innerHTML = "Total: " + total;
  //Delete node
  list_of_items.removeChild(node_to_remove);
} 

document.addEventListener("DOMContentLoaded", 
function(event) {  
  //Listener event button 
  let event_handler = add_item_to_list_with_template(get_element_li);
  document.getElementById("add-item").addEventListener("click", event_handler);
})

/*
 for removing elements could be this way
  let element_to_delete = document.querySelector("selector").lastElementChild;
  element_to_delete.parentNode.removeChild(element_to_delete);
  or we could use ChildNode.remove()
  https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove
*/
