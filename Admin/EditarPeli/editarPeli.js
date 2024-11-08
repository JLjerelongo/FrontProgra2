// Ruta base de tu API
const apiURL = 'https://localhost:7220/api/Cine';
const peliculasURL = `${apiURL}/peliculas`;
const postURL = `${apiURL}/peliculas`;
const directoresURL = `${apiURL}/directores`;
const paisesURL = `${apiURL}/paises`;
const clasificacionesURL = `${apiURL}/clasificaciones`;
const generosURL = `${apiURL}/generos`;
const estadosURL = `${apiURL}/estados`;

// Cargar todos los datos necesarios en el formulario
async function fetchData() {
    try {
        // Obtener los directores
        const responseDirectores = await fetch(directoresURL);
        const directores = await responseDirectores.json();

        // Obtener los países
        const responsePaises = await fetch(paisesURL);
        const paises = await responsePaises.json();

        // Obtener las clasificaciones
        const responseClasificaciones = await fetch(clasificacionesURL);
        const clasificaciones = await responseClasificaciones.json();

        // Obtener los géneros
        const responseGeneros = await fetch(generosURL);
        const generos = await responseGeneros.json();

        // Obtener los estados
        const responseEstados = await fetch(estadosURL);
        const estados = await responseEstados.json();

        // Llenar el formulario con estos datos
        renderForm(directores, paises, clasificaciones, generos, estados);

        // Cargar la lista de películas en el selector
        loadMovieList();
    } catch (error) {
        console.error('Error al obtener los datos necesarios:', error);
        alert('Hubo un error al cargar los datos necesarios.');
    }
}

// Llenar los elementos del formulario con los datos obtenidos
function renderForm(directores, paises, clasificaciones, generos, estados) {
    // Directores
    const selectDirectores = document.getElementById('director');
    directores.forEach(director => {
        const option = document.createElement('option');
        option.value = director.idDirector;
        option.textContent = `${director.nombre} ${director.apellido}`;
        selectDirectores.appendChild(option);
    });

    // Países
    const selectPaises = document.getElementById('pais');
    paises.forEach(pais => {
        const option = document.createElement('option');
        option.value = pais.idPais;
        option.textContent = pais.pais;
        selectPaises.appendChild(option);
    });

    // Clasificaciones
    const selectClasificaciones = document.getElementById('clasificacion');
    clasificaciones.forEach(clasificacion => {
        const option = document.createElement('option');
        option.value = clasificacion.idClasificacion;
        option.textContent = clasificacion.descripcion;
        selectClasificaciones.appendChild(option);
    });

    // Estados
    const selectEstados = document.getElementById('estado');
    estados.forEach(estado => {
        const option = document.createElement('option');
        option.value = estado.idEstado;
        option.textContent = estado.estado;
        selectEstados.appendChild(option);
    });

    // Géneros como checkboxes
    const generoContainer = document.querySelector('.form-group div');
    generoContainer.innerHTML = ''; // Limpiar el contenido antes de agregar opciones
    generos.forEach(genero => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('form-check-input');
        checkbox.id = `genero-${genero.idGenero}`;
        checkbox.value = genero.descripcion; // Usa el texto como valor si el ID no está disponible

        const label = document.createElement('label');
        label.setAttribute('for', `genero-${genero.idGenero}`);
        label.classList.add('form-check-label');
        label.textContent = genero.descripcion;

        const div = document.createElement('div');
        div.classList.add('form-check');

        div.appendChild(checkbox);
        div.appendChild(label);
        generoContainer.appendChild(div);
    });
}

// Cargar la lista de películas en el selector
async function loadMovieList() {
    try {
        const response = await fetch(peliculasURL);
        const movies = await response.json();

        const select = document.getElementById('peliculaSelector');
        movies.forEach(movie => {
            const option = document.createElement('option');
            option.value = movie.idPelicula;
            option.textContent = movie.tituloPelicula;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar la lista de películas:', error);
    }
}

// Cargar los detalles de la película seleccionada
async function loadMovieDetails() {
    const movieId = document.getElementById('peliculaSelector').value;
    if (!movieId) return;

    try {
        const response = await fetch(`${peliculasURL}/${movieId}`);
        const movie = await response.json();

        // Mostrar los datos de la película en la consola
        console.log("Datos de la película seleccionada:", movie);

        // Asignar valores a los campos del formulario
        document.getElementById('titulo').value = movie.tituloPelicula;
        document.getElementById('duracion').value = movie.duracionMin;

        // Para los select, usaremos los valores de texto en lugar de IDs
        setSelectValueByText('clasificacion', movie.clasificacion);
        setSelectValueByText('pais', movie.pais);
        setSelectValueByText('director', movie.director);
        setSelectValueByText('estado', movie.estado);

        // Marcar los géneros correspondientes
        const generoCheckboxes = document.querySelectorAll('.form-check-input');
        generoCheckboxes.forEach(checkbox => {
            checkbox.checked = movie.generos.includes(checkbox.nextSibling.textContent.trim());
        });
    } catch (error) {
        console.error('Error al cargar los detalles de la película:', error);
    }
}

// Función para seleccionar el valor en el <select> usando el texto en lugar del valor
function setSelectValueByText(selectId, text) {
    const select = document.getElementById(selectId);
    const options = Array.from(select.options);
    const match = options.find(option => option.textContent.trim() === text);
    if (match) {
        select.value = match.value;
    }
}

// Enviar los cambios realizados en el formulario
document.getElementById('edit-movie-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const movieId = document.getElementById('peliculaSelector').value;
    const titulo = document.getElementById('titulo').value;
    const duracion = document.getElementById('duracion').value;

    const selectClasificacion = document.getElementById('clasificacion');
    const clasificacion = selectClasificacion.options[selectClasificacion.selectedIndex].text;

    const selectPais = document.getElementById('pais');
    const pais = selectPais.options[selectPais.selectedIndex].text;

    const selectDirector = document.getElementById('director');
    const director = selectDirector.options[selectDirector.selectedIndex].text;

    const selectEstado= document.getElementById('estado');
    const estado = selectEstado.options[selectEstado.selectedIndex].text;

    const generosSeleccionados = Array.from(document.querySelectorAll('.form-check-input:checked'))
        .map(checkbox => checkbox.value); // Asegúrate de que aquí tengas los valores correctos


    const clasificacionid = document.getElementById('clasificacion').value;
    const paisId = document.getElementById('pais').value;
    const directorId = document.getElementById('director').value;
    const estadoId = document.getElementById('estado').value;

    // Construcción del objeto a enviar
    const movieData = {
        idPelicula: parseInt(movieId), // ID de la película que se está actualizando
        tituloPelicula: titulo,
        duracionMin: parseInt(duracion),
        duracionFormato: "1h 52m", // Este es un valor fijo, asegúrate de ajustarlo si es necesario
        clasificacion: clasificacion, // Asegúrate de que este es el valor correcto
        director: director, // Asegúrate de que este es el valor correcto
        estado: estado, // Asegúrate de que este es el valor correcto
        pais: pais, // Asegúrate de que este es el valor correcto
        generos: generosSeleccionados, // Aquí es donde se agregan los géneros seleccionados
        idClasificacion: parseInt(clasificacionid),
        idPais: parseInt(paisId),
        idDirector: parseInt(directorId),
        idEstado: parseInt(estadoId)
    };

    // Mostrar el objeto de datos a enviar
    console.log("Datos a enviar para actualizar la película:", JSON.stringify(movieData, null, 2));

    try {
        const response = await fetch(`${postURL}/${movieId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movieData), // Asegúrate de que esto está correcto
        });

        if (response.ok) {
            alert('Película actualizada exitosamente');
        } else {
            const error = await response.json();
            alert(`Error al actualizar la película: ${error.title || error.message}`);
        }
    } catch (error) {
        console.error('Error al actualizar la película:', error);
        alert('Hubo un error al actualizar la película');
    }
});




// Función para convertir duración a un formato legible
function ConvertirDuracion(duracionMin) {
    const horas = Math.floor(duracionMin / 60);
    const minutos = duracionMin % 60;
    return `${horas}h ${minutos}m`;
}


// Cargar datos iniciales al cargar la página
document.addEventListener('DOMContentLoaded', fetchData);


// Función para cerrar sesión
function logout() {
    // Elimina los datos de sesión del localStorage
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
  
    // Redirige a la página de inicio de sesión
    window.location.href = "/Login/login.html";
  }
  
  // Verificar autenticación al cargar la página
  document.addEventListener("DOMContentLoaded", () => {
    const userRole = localStorage.getItem("userRole");
  
    // Si no hay una sesión activa, redirigir al login
    if (!userRole) {
        window.location.href = "/Login/login.html";
    }
  });
  