const
    load_btn = document.querySelector('.load-btn'),
    memory = document.querySelector('.memory'),
    load_number = document.querySelector('#load-process'),
    partition_aux = document.querySelector('#partition-aux'),
    reset_btn = document.querySelector('.btn-reset')
;

const partitions = [];
let next_partition;

const create_partition_element = function(size){

    const new_partition = document.createElement('div');
    new_partition.className = 'partition active';
    new_partition.style.height = `${(size/memory.size)*100}%`;
    new_partition.size = size;
    new_partition.style.backgroundColor = getRandomColor();

    create_trash_and_size(new_partition);
    
    return new_partition;

}

const create_trash_and_size = function(partition){

    if(partition!== partition_aux){
        const delete_option = document.createElement('i');
        delete_option.className = 'fas fa-trash';
        delete_option.onclick = release_partition;
        partition.appendChild(delete_option);

        const text_size = document.createElement('h6');
        text_size.textContent=`${partition.size} MB`;
        partition.appendChild(text_size);
    }else
        partition_aux.style.height != '0%' ? partition_aux.querySelector('h6').textContent=`${partition.size} MB` : partition_aux.querySelector('h6').textContent='';
        
}

const release_partition = function(evt){

    const partition_to_release = evt.target.parentNode;

    // se aumenta el espacio libre de la memoria y se cambia la particion a inactiva
    memory.free+=Number(partition_to_release.size);
    partition_to_release.classList.replace('active','inactive')

    // arreglo con todas las particiones inactivas actuales
    const inactive_partitions = memory.querySelectorAll('.inactive');
    // añade la particion auxiliar al arreglo de particiones momentaneamente
    partitions.push(partition_aux);

    for(let i=0; i< inactive_partitions.length; i++){

        // indice en el arreglo de particiones de la actual y la siguiente particion inactiva
        let
            inactive_index = partitions.indexOf(inactive_partitions[i]),
            next_inactive_index = partitions.indexOf(inactive_partitions[i+1])
        ;

        // cuando dos particiones libres estan contiguas
        if(next_inactive_index - inactive_index === 1){

            // se incrementa la altura y el tamaño en memoria de la particion contigua libre (se fucionan)
            inactive_partitions[i+1].style.height = `${Number(inactive_partitions[i+1].style.height.slice(0,-1))  + Number(inactive_partitions[i].style.height.slice(0,-1))}%`;
            inactive_partitions[i+1].size = Number(inactive_partitions[i+1].size) + Number(inactive_partitions[i].size);
            inactive_partitions[i+1].querySelector('h6').textContent=`${inactive_partitions[i+1].size} MB`;

            // se elimina del array de particiones y del Dom, el elemento consumido
            partitions.splice(inactive_index,1);
            inactive_partitions[i].remove();
        }
    }

    // se remueve del array de particiones la particion auxiliar
    partitions.pop();

    console.log(memory.size, memory.free, partition_aux.size);
}


const first_fit = function(new_partition){

    /**
     * Este metodo recorre las particiones libres en busca de la primera
     * que satisfaga el tamaño requerido del nuevo proceso
    */

    const inactive_partitions = memory.querySelectorAll('.partition.inactive');

    for(const element of inactive_partitions){

        // se busca la primera particion libre con el suficiente tamaño
        if( Number(element.size) >= Number(new_partition.size) ){
            // se llama a una funcion que los agrera al array y al DOM
            add_to_array_partitions(new_partition,element);
            next_partition= new_partition;
            return;
        } 

    }
    
}


const best_fit = function(new_partition){
    /**
     * Este metodo recorre todas las particiones libres en busca
     * de la particion con tamaño mas cercano a lo requerido
    */

    const inactive_partitions = memory.querySelectorAll('.partition.inactive');
    let best_partition={size:memory.size,test:true};

    for(const element of inactive_partitions){
        // se verifica que la particion al menos tenga el tamaño requerido
        if( Number(element.size) >= Number(new_partition.size) )
            best_partition= Number(element.size) <= Number(best_partition.size) ? element :best_partition;
    }
    
    // se llama a una funcion que los agrera al array y al DOM
    if(!best_partition.test){
        add_to_array_partitions(new_partition,best_partition)
        next_partition= new_partition;
    }
    

}

const next_fit = function(new_partition){
    /**
     * Esta funcion se encarga de encontrar la siguiente particion libre
     * despues de la anterior que se ingreso
    */

    // se crea una copia las particiones iniciando desde el ultimo elemento creado
    let partitions_copy = partitions.slice(partitions.indexOf(next_partition));
    // se agrega a la copia la particion auxiliar
    partitions_copy.push(partition_aux);
    //se concatena el resto de las particiones al final
    partitions_copy=partitions_copy.concat(...partitions);

    for(const element of  partitions_copy){
        if( element.classList.contains('inactive') && Number(element.size)>= Number(new_partition.size) ){
            add_to_array_partitions(new_partition,element);
            next_partition= new_partition;
            break;
        }
    }

}

const add_to_array_partitions = function(new_partition,selected_partition){

    if(selected_partition !== partition_aux){

        // si el tamaño de la particion libre es igual, se remplaza
        if(selected_partition.size == new_partition.size)
            partitions.splice(partitions.indexOf(selected_partition),1,new_partition);

        else{
            // si es mayor, se reduce su tamaño,altura y se ingresa la nueva en el array
            selected_partition.style.height = `${Number(selected_partition.style.height.slice(0,-1)) - Number(new_partition.style.height.slice(0,-1))}%`;
            selected_partition.size= Number(selected_partition.size) - Number(new_partition.size);
            selected_partition.querySelector('h6').textContent=`${selected_partition.size} MB`;
            partitions.splice(partitions.indexOf(selected_partition),0,new_partition);
        }

    }else{
        partitions.push(new_partition);
        partition_aux.size-=new_partition.size;
    }
    
    // se reduce el espacio libre de la memoria y se pinta el DOM
    memory.free-=Number(new_partition.size);
    add_to_DOM(partitions);
}


const add_to_DOM=function(array){
    
    // Se le agrega la maxima altura a la particion auxiliar, para luego reducirla poco a poco
    partition_aux.style.height = '100%';
    memory.textContent='';

    // se reduce la altura de la particion auxiliar y se pinta cada elemento en el DOM
    partitions.forEach(element => {
        partition_aux.style.height =`${Number(partition_aux.style.height.slice(0,-1)) - Number(element.style.height.slice(0,-1))}%`;
        memory.appendChild(element);
    });

    // se le agrega un h6 que mostrara el tamaño a la particion auxiliar
    create_trash_and_size(partition_aux);
    memory.appendChild(partition_aux);

    console.log(memory.size, memory.free, partition_aux.size);
}


load_btn.addEventListener('click',(evt)=>{

    // se verifica la memoria tenga espacio disponible y que lo requerido != 0
    if( Number(load_number.value) != 0 && memory.free >= Number(load_number.value) ){

        let type_insertion = document.querySelector('[name=ubication-type]');
            type_insertion = Number(type_insertion.value);

        // Crear un nuevo elemento
        const new_partition = create_partition_element(load_number.value);

        // utilizar el algoritmo seleccionado
        switch(type_insertion){
            case 0 :
                first_fit(new_partition);
                break;
            case 1:
                best_fit(new_partition);
                break;
            case 2:
                next_fit(new_partition);
                break;
        }
    }

});

load_number.addEventListener('keyup',(evt)=>{
    /**
     * Esta funcion permite interactuar con la memoria
     * dando enter a la caja de texto
    */
    if (evt.keyCode === 13) {
        evt.preventDefault();
        load_btn.click();
    }
})

reset_btn.addEventListener('click',(evt)=>{

    /**
     * Esta funcion reinicia todos los valores y contenido de la memoria,
     * la deja limpia
    */
    memory.textContent='';
    memory.free=memory.size;
    partitions.splice(0,partitions.length);

    partition_aux.style.height='100%';
    partition_aux.size=memory.size;
    create_trash_and_size(partition_aux);
    memory.appendChild(partition_aux);

    console.log(memory.size, memory.free, partition_aux.size);
});

document.querySelector('.memory-size-btn').addEventListener('click',(evt)=>{
    memory.size = Number(document.querySelector('#memory-size').value);
    reset_btn.click();
});

document.querySelector('#memory-size').addEventListener('keyup',(evt)=>{
    if (evt.keyCode === 13) {
        evt.preventDefault();
        document.querySelector('.memory-size-btn').click();
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

(function(){
    let memory_size= Number(window.prompt('Set the memory size in MB')) ;
    memory.size = !Number.isNaN(memory_size) ? memory_size!=0 ? memory_size : 64 : 64;
    memory.free = memory.size;
    partition_aux.size = memory.size;
    partition_aux.childNodes[0].textContent=`${partition_aux.size} MB`    
})();