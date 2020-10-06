
var size_t = 0;
var name = "null";
var size_p = 0;
var algoritmo = 0;
const btn_load = document.getElementById("load_btn");
const process_list_string = document.getElementById("process_list");
const btn_config = document.getElementById("btn_config");
const btn_ejec = document.getElementById("ejec");
var list_procces=[];
var list_address =[];

btn_config.addEventListener('click',(evt)=>{
	size_t1 = document.getElementById("size_t").value;
    if((size_t1 >= 1) && (size_t1 <= 4)){
        var btn_radio = document.getElementsByName("algoritmo");       
        for(var index = 0; index < btn_radio.length; index++){
            if(btn_radio[index].checked){
                algoritmo = btn_radio[index].value;                
            }            
        }	   
       create_table(size_t1);       
       var label = document.getElementById("info");
       label.innerHTML = "¡Configuracion inicial cargada con exito!";

	}else{
		alert("Puede seleccionar un rango de memoria de 1 a 4");
	}    
});

btn_load.addEventListener('click',(evt)=>{
    size_t = document.getElementById("size_t").value;
    name = document.getElementById("name").value;
    size_p = document.getElementById("size_p").value;
    if(verificar_proceso(size_t,size_p,name)){
    	var arreglo = new Array(2);
        if(list_procces.length === 0){            
                arreglo[0] = name;
                arreglo[1] = size_p;
    		list_procces.push(arreglo);
    		process_list_string.value = name+"   "+size_p+" KB\n";
    	}else{
            arreglo[0] = name;
            arreglo[1] = size_p;
    		process_list_string.value = process_list_string.value+name+"   "+size_p+" KB\n";
    		list_procces.push(arreglo);
    	}
    }else{
    	alert("Error al ingresar los datos.\n*No puede dejar campos vacios.\n*No puede exceder la memoria disponible.");
    }	
    cleaner();    

});

btn_ejec.addEventListener('click',(evt)=>{
    probarLista();
    console.log(algoritmo);
    //Algortimo de Ubicacion 1
    if(algoritmo === "1"){        
        div_p= document.getElementById("process");
        table = document.createElement("table");
        tbody = document.createElement("tbody");
        console.log(list_address.length);
        for(var index = 0; index < list_address.length; index++){
            var row = document.createElement("tr");
            var column = document.createElement("td");
            var flag = true;
            for(var k = 0; k< list_procces.length; k++){
                if(index != 0){                	
                    if( (list_address[index-1]< parseInt(list_procces[k][1])) &&
                        (parseInt(list_procces[k][1])<= list_address[index])    
                    ){
                            console.log(list_procces[k][0]+"  "+list_procces[k][1]);
                            var textoCelda = document.createTextNode(list_procces[k][0]+"  "+list_procces[k][1]);        
                            column.appendChild(textoCelda);
                            row.appendChild(column);
                            tbody.appendChild(row);
                        }else{
                        	if(flag){
                        		var textoCelda = document.createTextNode("-- --");                            
                            	column.appendChild(textoCelda);
                            	row.appendChild(column);
                            	tbody.appendChild(row);	
                            	flag= false;
                        	}
                            
                        }    
                    }else{
                    	var flag = true;
                        for(var k = 0; k < list_procces.length; k ++){
                            if(list_address[0] === list_procces[k][1]){
                                var textoCelda = document.createTextNode(list_procces[k][0]+"  "+list_procces[k][1]);
                                column.appendChild(textoCelda);
                                row.appendChild(column);
                                tbody.appendChild(row);
                                break;
                            }else{
                            	if(flag){
                            		var textoCelda = document.createTextNode("  --  -- ");                            
                            		column.appendChild(textoCelda);
                            		row.appendChild(column);
                            		tbody.appendChild(row);
                            		flag=false;
                            	}
                            }    
                        }
                        
                    }                
                }
                
            }
            
        
        table.appendChild(tbody);        
        div_p.appendChild(table);
        table.setAttribute("border", 2);
        table.setAttribute("id", "tabla2");
    }
    else{
        //Algoritmo de ubicacion 2
        if(algoritmo === 2){

        }
    }


});

function cleaner(){
	document.getElementById("name").value ="";
	document.getElementById("size_p").value ="";
}

function verificar_proceso(size_total, size_process, name_process){
	if(size_total>=1 && size_total<=4){
		if(	size_process <(size_total*1024) && 
			!(size_process === "")
			){
			if(name_process != "")
				return 1;
		}
	}
	return 0;
}

function create_table(num){
    div = document.getElementById("ejecutar");
    table = document.createElement("table");
    tbody = document.createElement("tbody");
    for(var index = 0; Math.pow(2,index) < (num*1024); index++){
        var row = document.createElement("tr");
        var column = document.createElement("td");
        var textoCelda = document.createTextNode(Math.pow(2,index)+"  kB  ");
        list_address.push(Math.pow(2,index));
        column.appendChild(textoCelda);
        row.appendChild(column);
        tbody.appendChild(row);
    }
    table.appendChild(tbody);        
    div.appendChild(table);
    table.setAttribute("border", 2);
    table.setAttribute("id", "tabla");
}

function probarLista(){
    for(var i=0; i<list_procces.length; i++){
        console.log(list_procces[i][1]);   
    }        
}