const 
    load_btn = document.querySelector('.load-btn'),
    memory = document.querySelector('.memory'),
    load_number = document.querySelector('#load-process')
    // size_btn = document.querySelector('.memory-size-btn'),
    // memory_size = document.querySelector('#memory-size')
;

const delete_partition = function (evt){
    const current_partition = evt.target.parentNode;
    current_partition.querySelector('.active').remove();
    evt.target.remove();
}

load_btn.addEventListener('click',(evt)=>{

    // se verifca si ha ingresado un numero
    if(load_number.value !== ''){

        // se crea un nuevo div (carga) con la altura relativa al numero ingresado
        const new_process = document.createElement('div');
        new_process.className = 'active';
        new_process.style.height = ` ${ ((load_number.value/8)*100) }%` ;

        // se crea un elemento que servira para borrar la particion
        const delete_option = document.createElement('i');
        delete_option.className = 'fas fa-trash';
        delete_option.onclick = delete_partition;
    
        // se obtiene un objeto con los hijos de la memoria
        const partitions = memory.children;
        
        // se busca el primer elemento que este libre sin ninguna carga (div)
        for(const element of partitions){

            // si el elemento esta cargado continua la busqueda 
            if( element.querySelector('div') ){
                // cuando la memoria esta llena
                if(element === memory.lastElementChild) console.log('memoria llena');

                continue;

            }else{
                // si no esta cargado, le agrega la carga
                element.appendChild(delete_option);
                element.appendChild(new_process);
                break;
            }
        }
    }
});

// BUSCAR UN METODO DE OBJETOS QUE NADA MAS ENCUENTRE ALGO QUE CUMPLA UN CONDICIONAL O ALGO SIMILAR [eso es para array]
