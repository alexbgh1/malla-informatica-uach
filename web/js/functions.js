export function getMaxRamos(data){
    /*
    Según el Archivo JSON, considerará la mayor cantidad de ramos; buscando en todos los semestres
    de esta forma garantizará filas adecuadas según corresponda
    */
    let maxRamos = 0;
    for(let semestre = 0; semestre<data.semestres; semestre++){
       if (data.malla[semestre].cantidad_ramos > maxRamos){
        maxRamos = data.malla[semestre].cantidad_ramos;
       }
    }
    return maxRamos;
}
