// -- Query selector global --
// Input búsqueda
let buscar_codigo = document.getElementById("buscar-codigo");
let todos_los_ramos = document.querySelector(".todos-los-ramos");

let codigo_requisitos = document.querySelector(".codigo-requisitos");
let requisitos = document.querySelector(".requisitos");
let tabla_requisitos = document.querySelector(".tabla-requisitos");
let thead = document.querySelector(".tabla-requisitos thead");
let tbody = document.querySelector(".tabla-requisitos tbody");

// buscar-codigo
let data;

function filterCodigo() {
  // filter all p elements equals or contains to text on buscar_codigo
  let p_elements = document.querySelectorAll(".todos-los-ramos p");
  let text = buscar_codigo.value.toUpperCase();
  codigo_requisitos.innerHTML = text;

  for (let i = 0; i < p_elements.length; i++) {
    let p = p_elements[i];
    if (p.innerHTML.toUpperCase().indexOf(text) > -1) {
      p.style.display = "";
    } else {
      p.style.display = "none";
    }
  }

  // Si queda un elemento, muestra una sección con los requisitos del ramo
  // checkear si solo un elemento está visible
  let visible_elements = document.querySelectorAll(".todos-los-ramos p");
  let visible_elements_count = 0;
  let visible_element = null;
  for (let i = 0; i < visible_elements.length; i++) {
    let p = visible_elements[i];
    if (p.style.display == "") {
      visible_elements_count++;
      visible_element = p.innerText;
    }
  }

  if (visible_elements_count == 1) {
    requisitos.style.display = null;
    // Codigo a buscar: visible_element
    // ramo contendrá la info del ramo desde data
    let ramo = null;
    let semestre = 0;
    // buscamos el codigo en la malla
    // Por las validaciones, sabemos que el codigo existe
    while (ramo == null && semestre < data.semestres) {
      ramo = buscar_asignatura(data, semestre, visible_element);
      semestre++;
    }

    acum = [];
    requisitosRepetidos = requisitos_asignatura(data, ramo, acum);
    acum2 = filtrarRepetidos(acum);
    acum2 = acum2.sort((a, b) => a.semestre_actual - b.semestre_actual);
    console.log(acum2);

    // Actualizamos texto
    codigo_requisitos.innerHTML = visible_element + " - " + ramo.nombre;

    // Actualizamos tabla: tbody
    tbody.innerHTML = "";

    for (let i = 0; i < acum2.length; i++) {
      let tr = document.createElement("tr");
      let td = document.createElement("td");
      let td2 = document.createElement("td");
      let td3 = document.createElement("td");

      // Si es semestral añade clase: semestral sino no-semestral
      acum2[i].semestral
        ? tr.classList.add("semestral")
        : tr.classList.add("no-semestral");

      td.innerText = acum2[i].semestre_actual;
      td2.innerText = acum2[i].nombre;
      td3.innerText = acum2[i].codigo;
      tr.appendChild(td);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tbody.appendChild(tr);
    }
  } else {
    requisitos.style.display = "none";
  }
}

function buscar_asignatura(data, semestre, codigo) {
  let largo_ramos = data["malla"][semestre].ramos.length;

  //   console.log("semestre:", semestre);
  //   console.log(codigo);
  for (let ramo = 0; ramo < largo_ramos; ramo++) {
    let info_ramo = data["malla"][semestre].ramos[ramo];
    if (info_ramo.codigo == codigo) {
      return info_ramo;
    }
  }
  return null;
}

function requisitos_asignatura(data, asignatura, acum) {
  for (let i = 0; i < asignatura.prerequisitos.length; i++) {
    let prerequisito = asignatura.prerequisitos[i];
    //console log all in one
    // console.log("prerequisito:", prerequisito);
    // console.log("prerequisito codigo:", prerequisito.codigo);
    // console.log("prerequisito semestre:", prerequisito.semestre);
    // Semestre va de 0 a 10 ya que es un índice
    x = buscar_asignatura(data, prerequisito.semestre - 1, prerequisito.codigo);
    // console.log("x:", x);
    //guardamos acum
    x.semestre_actual = prerequisito.semestre;
    acum.push(x);
    requisitos_asignatura(data, x, acum);
  }
  return acum;
}

function filtrarRepetidos(acum) {
  let acum2 = [];
  for (let i = 0; i < acum.length; i++) {
    let ramo = acum[i];
    let repetido = false;
    for (let j = 0; j < acum2.length; j++) {
      let ramo2 = acum2[j];
      if (ramo.codigo == ramo2.codigo) {
        repetido = true;
      }
    }
    if (!repetido) {
      acum2.push(ramo);
    }
  }
  return acum2;
}

cargarInfo();

function cargarInfo() {
  const xhttp = new XMLHttpRequest();

  xhttp.open("GET", "malla_uach.json", true);
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // --- Inicializa data ---
      data = JSON.parse(this.responseText);

      // --- Querys selectors ---

      // --- Generamos los Posibles Ramos a inscribir en el Input ---
      // Recorremos para cada semestre
      for (let semestre = 0; semestre < data.semestres; semestre++) {
        let largo_ramos = data["malla"][semestre].ramos.length;

        // Recorremos para cada ramo
        for (let ramo = 0; ramo < largo_ramos; ramo++) {
          let info_ramo = data["malla"][semestre].ramos[ramo];
          let p_codigo = createPElement(info_ramo.codigo);
          todos_los_ramos.appendChild(p_codigo);
        }
      }
    }
  };
}

function createPElement(codigo) {
  let parrafo = document.createElement("p");
  parrafo.innerText = codigo;
  // reemplazamos el valor de input con el texto clickeado
  function changeInputText(e) {
    buscar_codigo.value = e.target.innerText;
    filterCodigo();
  }
  parrafo.onclick = (e) => changeInputText(e);
  return parrafo;
}
