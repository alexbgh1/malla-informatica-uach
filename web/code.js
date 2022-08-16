
cargarInfo()
function getMaxRamos(data){
    /*
    Según el Archivo JSON, considerará la mayor cantidad de ramos; buscando en todos los semestres
    de esta forma garantizará filas adecuadas según corresponda
    */
    maxRamos = 0;
    for(let semestre = 0; semestre<data.semestres; semestre++){
       if (data.malla[semestre].cantidad_ramos > maxRamos){
        maxRamos = data.malla[semestre].cantidad_ramos;
       }
    }
    return maxRamos;
}

function cargarInfo(){
    const xhttp = new XMLHttpRequest();

    xhttp.open('GET', 'malla_uach.json', true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const data = JSON.parse(this.responseText);

            let semestres = document.querySelector('#semestres');
            let info_semestres = document.querySelector('#info-semestres');
            let carrera = document.querySelector('#carrera');

            semestres.innerHTML = '';
            info_semestres.innerHTML = '';
            carrera.innerHTML = '';

            // Define h1 carrera
            carrera.innerHTML = data.carrera;

            // Define tabla (cantidad de columnas) en base al número de semestres
            for(let i=0; i<data.semestres;i++){
                semestres.innerHTML +=`
                <th>Semestre ${i+1}</th>
                `;
            }

            let maxRamos = getMaxRamos(data);

            
            // temp almacenará como string el innerHTML de cada ramo leído de malla_uach.json
            // para finalmente inyectarlo en el id y variable 'info_semestres'
            let temp = "";

            // Inicializamos for que recorre por columnas, en horizontal;
            // Largo columnas: cantidad semestres
            // Largo filas: máxima cantidad de ramos
            
            // Define temp, que es la información de cada celda en la tabla
            for(let idx=0; idx < maxRamos;idx++){
                temp = "<tr>";
                for(let info of data.malla){
                    if (typeof info.ramos[idx] !== 'undefined') {
                        
                        info.ramos[idx].semestral ?
                        temp +=`<td class="card-panel semestral"`
                        : temp +=`<td class="card-panel no-semestral"`;

                        temp +=`
                        id=${info.ramos[idx].codigo}>
                        ${info.ramos[idx].nombre}<br>
                        <b>${info.ramos[idx].codigo}</b></td>`;
                    }
                    else{temp +="<td></td>";}
                }
                temp += "</tr>";
                info_semestres.innerHTML += temp;

            }

            // Una vez inicializados los elementos, recorremos nuevamente la matriz
            // En donde añadiremos los eventos por cada elemento existente
            // Se hace después de inicializar ya que requiere tener todas las id de todas las posiciones

            for(let idx =0; idx < maxRamos; idx++){
                for(let info of data.malla){
                    if (typeof info.ramos[idx] !== 'undefined') {
                        let onRamo = document.getElementById(`${info.ramos[idx].codigo}`);
                        onRamo.addEventListener('mouseenter', (event) => {
                            // Considerese el 'elemento' como el código o id de una asignatura/ramo.
                            var onElement = document.getElementById(`${info.ramos[idx].codigo}`);

                            // Si el mouse está encima del elemento, añade la clase "hoverOn"
                            // Notar que todos las clases son de forma 'toggle', es decir, se activan y se pueden desactivar
                            onElement.classList.toggle("hoverOn");
                            
                            // Además, añade la clase "prerequisito" a los ramos prerequisitos de este elemento
                            for (let prerequisito of info.ramos[idx].prerequisitos){
                                let preRamo = document.getElementById(`${prerequisito.codigo}`);
                                preRamo.classList.toggle("prerequisito");
                            }

                            // También, añade la clase "post" a los ramos que desbloquea este elemento
                            for (let post of info.ramos[idx].desbloquea){
                                let postRamo = document.getElementById(`${post.codigo}`);
                                postRamo.classList.toggle("post");
                            }


                        },false)
                        
                        // Aquí realiza lo mismo que antes pero con un evento 'mouseleave', en donde
                        // al sacar el mouse del elemento, se desactivan las clases
                        onRamo.addEventListener("mouseleave", (event) => {
                            var onElement = document.getElementById(`${info.ramos[idx].codigo}`);
                            onElement.classList.toggle("hoverOn");

                            for (let prerequisito of info.ramos[idx].prerequisitos){
                                let preRamo = document.getElementById(`${prerequisito.codigo}`);
                                preRamo.classList.toggle("prerequisito");
                            }

                            for (let post of info.ramos[idx].desbloquea){
                                let postRamo = document.getElementById(`${post.codigo}`);
                                postRamo.classList.toggle("post");
                            }
                        }, false);
                    };
                }
            }
        }
    };
}
