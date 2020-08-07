// variables
const carrito = document.getElementById('carrito');
const cursos = document.getElementById('lista-cursos');
const listaCursos = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBTN = document.getElementById('vaciar-carrito');




// listeners
cargarEventListeners();

function cargarEventListeners(){ 
    // se carga cuando se presiona "agregar al carrito"
    cursos.addEventListener('click', comprarCurso);

    // cuando se elimina un curso del carrito
    carrito.addEventListener('click', eliminarCurso);

    // al vaciar carrito
    vaciarCarritoBTN.addEventListener('click', 
    vaciarCarrito);

    // al cargar el documento mostrar local storage en html
    document.addEventListener('DOMContentLoaded', leerLocalStorage);
}
// funciones
// añade el curso al carrito
function comprarCurso(e) {
    e.preventDefault();

    // delegation para agregar al carrito
    if(e.target.classList.contains('agregar-carrito')) {
        const curso = e.target.parentElement.parentElement;

        // enviamos el curso seleccionado para leer los datos
        leerDatosCurso(curso);
    }
}

// lee los datos del curso
function leerDatosCurso(curso) {
    // creo un objeto con toda la informacion del curso. selecciono con query selector, le paso el campo y agrego que informacion quiero sacar
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id')
    }
    
    insertarCarrito(infoCurso);
}

// muestra el curso seleccionado en el carrito en html
function insertarCarrito(curso) {
    const row = document.createElement('tr');
    // voy agregando los elementos en forma html, le paso los valores que saque del objeto infoCursos, el curso seleccionado
    row.innerHTML = `
        <td><img src="${curso.imagen}" width=100></td>
        <td>${curso.titulo}</td>
        <td>${curso.precio}</td>
        <td><a href="#" class="borrar-curso" data-id="${curso.id}">X</a></td>
    `;
    listaCursos.appendChild(row);

    guardarCursoLocalStorage(curso);
}

// elimina el curso del carrito del DOM
function eliminarCurso(e) {
    e.preventDefault();
    let curso, cursoID;
    if(e.target.classList.contains('borrar-curso')) {
        e.target.parentElement.parentElement.remove();
        curso = e.target.parentElement.parentElement;
        cursoID = curso.querySelector('a').getAttribute('data-id');
    }
    eliminarCursoLocalStorage(cursoID);
}

// elimina los cursos del carrito del DOM
function vaciarCarrito() {
    // forma lenta
   // listaCursos.innerHTML = '';
    // forma rapida y recomendada
    while (listaCursos.firstChild) {
        listaCursos.removeChild(listaCursos.firstChild);
    }

    // vaciar local storage
    vaciarLocalStorage();
    
    return false;
}

// almacena los cursos del carrito a local storage
function guardarCursoLocalStorage(curso){
    let cursos;
    // toma el valor de un arreglo vacio o con elementos de local storage
    cursos = obtenerCursosLocalStorage();
    // el curso seleccionado se agrega al arreglo
    cursos.push(curso);
    localStorage.setItem('cursos', JSON.stringify(cursos));
}

// comprueba que haya elementos en local storage
function obtenerCursosLocalStorage() {
    let cursosLS;

    // compueba si hay algo en local storage
    if(localStorage.getItem('cursos') === null) {
        cursosLS = [];
    } else {
        cursosLS = JSON.parse(localStorage.getItem('cursos'));
    }
    return cursosLS;
}

// imprime los cursos de local storage en el carrito
function leerLocalStorage() {
    let cursosLS;

    cursosLS = obtenerCursosLocalStorage();

    cursosLS.forEach(function(curso) {
        {
            // construir el template
            const row = document.createElement ('tr');
            row.innerHTML = `
            <td>
                <img src="${curso.imagen}" width=100>
            </td>
            <td>${curso.titulo}</td>
            <td>${curso.precio}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${curso.id}">X</a>
            </td>
            `;
            listaCursos.appendChild(row);
        }
    }); 
}

// elimina el curso por id de local storage
function eliminarCursoLocalStorage(curso) {
    let cursosLS;

    // obtenemos el arreglo de cursos
    cursosLS = obtenerCursosLocalStorage();

    // iteramos comparando el id del curso borrado con los del local storage
    cursosLS.forEach(function(cursoLS, index) {
        if(cursoLS.id === curso) {
            cursosLS.splice(index, 1);
        }
    });

    // añadimos el arreglo actual a storage
    localStorage.setItem('cursos', JSON.stringify(cursosLS));
}

// elimina todo de local storage
function vaciarLocalStorage() {
    localStorage.clear();
}