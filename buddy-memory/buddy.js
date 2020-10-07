const 
    load_btn = document.querySelector('.load-btn'),
    memory = document.querySelector('.memory-buddy'),
    load_number = document.querySelector('#load-process');


  var  memorySize = 1024;


load_btn.addEventListener('click', (evt)=>{

     // se verifca si ha ingresado un numero
     if(load_number.value !== ''){
        makeRequest();
     }else{
         alert("ingrese un numero");
     }

});

function makeRequest(){

    var amount = parseInt(load_number.value);

    if(amount > memorySize)
        alert("El proceso es mas grande que la memoria.");
    else if(amount <= 0)
        alert("El proceso debe ser mayor que 0.")
        else{
            request (root, amount);
            var size ="MB";
            $( ".userOperations h4" ).append( "Request " + amount + size + " <br>");
        }

        update_table_diagram();
        load_number.value ="";
}

function delete_partition(label){
    release(label); 
    update_table_diagram(); 
    $( ".userOperations h4" ).append( "Release " + label + " <br>"); 
}



function request(node, size)
{
    size = Math.pow (2, Math.ceil (Math.log2 (size)));
    if(size > node.value || size > node.remaining)
    {
      alert ("Not enough memory for process. Please release some processes."); // size too big
      return 0;
    }
  
    node.remaining -= size;
  //************************************************** */
    if(size <= node.value && size > node.value / 2)
    {
      // allocate entire block, no children is created
      node.allocated = true;
      node.label = int_to_ascii(labels++);
      update (root);
      return 1;
    }
    else if (!("children" in node))
    {
      add_node (node);
    }
  
    if (node.children [0].remaining >= size)
      request (node.children [0],size);
    else if (node.children [1].remaining >= size)
      request (node.children [1], size)
  }

  
//Calls bfs to find node, then deallocates it.
//Then calls update_binary_tree to update tree.
function release (id)
{
  process_node = new Object();
  var found = false;
  found = bfs(queue[0], id, found);

  if (!(found))
  {
    alert ("Process not allocated or in memory. Please enter a valid process letter.");
    return 0;
  }
  process_node.allocated = false;

  queue = [root];
  update_binary_tree(process_node, process_node.value);
  update (root);
  return 1;
}