const 
    load_btn = document.querySelector('.load-btn'),
    memory = document.querySelector('.memory'),
    load_number = document.querySelector('#load-process'),
    partition_aux = document.querySelector('#partition-aux'),
    partitions = [];
    counter_aux=[];
;

let counter = 0;

memory.size = 64;
memory.free = memory.size;
partition_aux.size = memory.size;

const create_partition_element = function(size){

    const new_partition = document.createElement('div');
    new_partition.className = 'partition active';
    new_partition.style.height = `${(size/memory.size)*100}%`;
    new_partition.size = size;
    new_partition.style.backgroundColor = getRandomColor();

    const delete_option = document.createElement('i');
    delete_option.className = 'fas fa-trash';
    delete_option.onclick = release_partition;

    new_partition.appendChild(delete_option);

    return new_partition;

}

const release_partition = function(evt){

    // se obtiene la particion a liberar y las actuales particiones libres
    const current_partition = evt.target.parentNode;
    const inactive_partitions = memory.querySelectorAll('.partition.inactive');

    for(let i=0; i<inactive_partitions.length; i++){

        let current_partition_index = partitions.indexOf(current_partition);
        let inactive_index = partitions.indexOf(inactive_partitions[i]);
        
        // En caso de que se elimine una particion que este contigua a otra liberada
        if(inactive_index != -1 && Math.abs(current_partition_index - inactive_index) == 1){
            console.log(1)
            //se obtiene el indice mas grande de ambos, para que el grande absorba el menor
            let highest_index  = current_partition_index > inactive_index ? current_partition_index : inactive_index;
            console.log(partitions[highest_index-1],highest_index);
            
            // se suma la altura del pequeño al grande            
            partitions[highest_index].style.height = `${partitions[highest_index].clientHeight + Number(partitions[highest_index-1].clientHeight)}px`;
            
            // se suma la carga del pequeño al grande
            partitions[highest_index].size = partitions[highest_index-1].size;
            // se elimina del arreglo el elemento
            partitions.splice(current_partition_index,1);
            //se elimina del DOM el elemento  pequeño
            partitions[highest_index-1].remove();

            break;
        }

        // En caso de que se elimine la ultima particion
        if(inactive_partitions[i] === partition_aux && current_partition_index === partitions.length-1){
            console.log(2)
            partition_aux.size+=Number(current_partition.size);
            partition_aux.style.height = `${partition_aux.clientHeight+ Number(current_partition.clientHeight)}px`;;
            current_partition.remove();
            partitions.pop();

            break;
        }

        // En caso de que no este contigua a ninguna otra liberada
        if(inactive_index == -1 || Math.abs(current_partition_index - inactive_index) > 1){
            console.log(3)
            current_partition.classList.remove('active');
            current_partition.classList.add('inactive');
            memory.free+=Number(current_partition.size);

            break;
        }
        
    }
}


const first_fit = function(new_partition){
    
    /**  
     * se permite ingresar 3 procesos activos contiguamente, 
     * si se requiere mas, se debe verificar que entre los dos primeros haya algun espacio
    */
    if(memory.childElementCount <= 3){
        
        new_partition
        partitions.push(new_partition);
        partition_aux.size-=new_partition.size;
        memory.free-=new_partition.size;
        
        add_to_DOM(partitions);
        return;        
    }

    for(let i=0; i<partitions.length; i++){
        console.log(partitions);
    }

}


const best_fit = function(new_process){}
const next_fit = function(new_process){}


const add_to_DOM=function(array){

    let part_aux_height=partition_aux.clientHeight;
    memory.innerHTML='';

    partitions.forEach(element => {
        memory.appendChild(element);  
        partition_aux.style.height =`${part_aux_height - element.clientHeight}px`;
    });

    memory.appendChild(partition_aux);

    console.log(memory.size, memory.free, partition_aux.size);
}


load_btn.addEventListener('click',(evt)=>{

    if( Number(load_number.value) != 0 && memory.free >= Number(load_number.value) ){        
        let type_insertion = document.querySelector('[name=ubication-type]');
            type_insertion = Number(type_insertion.value);

        // Crear un nuevo elemento
        const new_partition = create_partition_element(load_number.value);
        
        // utilizar el algoritmo seleccionado
        switch(type_insertion){
            case 0 :
                first_fit(new_partition);
            case 1:
                best_fit(new_partition);
            case 2:
                next_fit(new_partition);
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