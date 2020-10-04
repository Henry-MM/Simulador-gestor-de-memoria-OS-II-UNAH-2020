const 
    load_btn = document.querySelector('.load-btn'),
    memory = document.querySelector('.memory'),
    load_number = document.querySelector('#load-process')
    // size_btn = document.querySelector('.memory-size-btn'),
    // memory_size = document.querySelector('#memory-size')
;

memory.size=64;
memory.free_total = memory.size;
memory.free_outside = memory.size;
let memory_size = 64;



const delete_partition = function (evt){

    /**
     * evt.target.parentNode = Proceso
     * evt.target.parentNode.parentNode = particion a la que pertener el proceso
     * evt.target.parentNode.parentNode.parentNode = particion de la particion a la que pertener el proceso
    */

    // si se elimina el unico proceso de una particion


    // si solo hay un proceso y se elimina, se limpia la memoria
    if(memory.childElementCount === 1 && evt.target.parentNode.childElementCount === 1){
        evt.target.parentNode.parentNode.remove();
        memory.free_total+=Number(evt.target.parentNode.parentNode.size);
        memory.free_outside = memory.free_total;

        return;
    }else{
        memory.free_total+=Number(evt.target.parentNode.size);
        evt.target.parentNode.parentNode.classList.remove('active');
        // elimina el proceso
        evt.target.parentNode.remove();
    }

    
}


const create_process_element = function(size){

    // se crea un nuevo elemento que servira como proceso
    const new_process = document.createElement('div');
    new_process.className = 'process';
    new_process.style.height = `${ ( ( size/memory_size )*memory.getBoundingClientRect().height -2)}px`; // -3 por el borde
    new_process.size = size;
    new_process.style.backgroundColor = getRandomColor();

    // se crea un elemento para que pueda liberar el proceso (borrar)
    const delete_option = document.createElement('i');
    delete_option.className = 'fas fa-trash';
    delete_option.onclick = delete_partition;

    // se agrega el boton de borrar al proceso
    new_process.appendChild(delete_option);

    return new_process;
}


const create_partition_element = function(process){

    const new_partition = document.createElement('div');
    new_partition.className = 'partition active';
    // new_partition.style.height = `${(process.load/memory_size)*100}%`;
    new_partition.style.height = `${ ( ( process.size/memory_size )*memory.getBoundingClientRect().height -2) }px`; // -3 por el borde
    new_partition.size = process.size;
    new_partition.free = 0;

    // se agrega el proceso a la nueva particion
    new_partition.appendChild(process);

    // se decrementa el espacio de la memoria 
    memory.free_total-=process.size

    return new_partition;

}


const first_fit = function(new_process){

    // se obtienen las actuales particiones (elementos) que hay en la memoria
    const current_partitions = Object.values(memory.children);
    
    // si no hay, la memoria esta vacia, se crea una particion con su proceso nuevo
    if(memory.free_outside >= Number(new_process.size)){

        //se crea una nueva particion con donde se carga el proceso
        const new_partition = create_partition_element(new_process);       
        memory.appendChild(new_partition);
        memory.free_outside-=Number(new_partition.size);

    }else{
        
        // recorremos las particiones actuales
        for(const partition of current_partitions){
            
            // se verifica que alguna de las particiones actuales tenga espacio 
            if(partition.free >= new_process.size){
                
            }
        }

    }
    console.log(memory.free_total)
}


const best_fit = function(new_process){}
const next_fit = function(new_process){}


load_btn.addEventListener('click',(evt)=>{
    
    // verificar que la carga del proceso no es 0 y que hay espacio disponible en la memoria
    if(load_number.value !=0 && memory.free_total >= load_number.value){
        // obtener el tipo de insercion que se quiere usar
        let type_insertion = document.querySelector('[name=ubication-type]');
        type_insertion = Number(type_insertion.value);
    
        // Crear un nuevo elemento proceso
        const new_process =create_process_element(load_number.value);
    
        // utilizar el algoritmo seleccionado
        switch(type_insertion){
            case 0 :
                first_fit(new_process);
            case 1:
                best_fit(new_process);
            case 2:
                next_fit(new_process);
        }
    }
});


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// function verifyParent(process){

// }