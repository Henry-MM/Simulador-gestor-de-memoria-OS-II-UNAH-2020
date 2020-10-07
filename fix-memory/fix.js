const 
    load_btn = document.querySelector('.load-btn'),
    memory = document.querySelector('.memory'),
    load_number = document.querySelector('#load-process'),
    reset_btn = document.querySelector('.btn-reset')
;



const delete_partition = function (evt){
    const current_partition = evt.target.parentNode;
    current_partition.querySelector('.active').remove();
    evt.target.remove();
}

load_btn.addEventListener('click',(evt)=>{

    // se verifca si ha ingresado un numero
    if(load_number.value !== '' && Number(load_number.value) <= Number(memory.each)){

        // se crea un nuevo div (carga) con la altura relativa al numero ingresado
        const new_process = document.createElement('div');
        new_process.className = 'active';
        new_process.style.height = ` ${ ((load_number.value/memory.each)*100) }%` ;

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


load_number.addEventListener('keyup',(evt)=>{
    /**
     * Esta funcion permite interactuar con la memoria
     * dando enter a la caja de texto
    */
    if (evt.keyCode === 13) {
        evt.preventDefault();
        load_btn.click();
    }
});

reset_btn.addEventListener('click',(evt)=>{
    /**
     * Esta funcion reinicia todos los valores y contenido de la memoria,
     * la deja limpia
    */
    memory.textContent='';
    memory.free=memory.size;

    for(let i=0; i<8; i++){
        const partition = document.createElement('div');
        const title_size = document.createElement('h6');

        partition.className='partition';
        title_size.textContent=Number(memory.each) + ' MB';

        partition.appendChild(title_size);
        memory.appendChild(partition);
    }
});

document.querySelector('.memory-size-btn').addEventListener('click',(evt)=>{
    memory.size = Number(document.querySelector('#memory-size').value);
    reset_btn.click();

    memory.each=memory.size/8;
    
    memory.querySelectorAll('.partition h6').forEach(element => {
        element.textContent = memory.size/8 + ' MB';
    });
});

document.querySelector('#memory-size').addEventListener('keyup',(evt)=>{
    if (evt.keyCode === 13) {
        evt.preventDefault();
        document.querySelector('.memory-size-btn').click();
    }
});

(function(){
    let memory_size= Number(window.prompt('Set the memory size in MB')) ;
    memory.size = !Number.isNaN(memory_size) ? memory_size!=0 ? memory_size : 64 : 64;
    memory.free = memory.size;
    memory.each=memory.size/8;
    
    memory.querySelectorAll('.partition h6').forEach(element => {
        element.textContent = memory.size/8 + ' MB';
    });

})();
