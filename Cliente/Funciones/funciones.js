const API_BASE = 'https://localhost:7220/api';
const apiPeliculasUrl = `${API_BASE}/Cine/peliculas`;
const peliculaSelect = document.getElementById('peliculaSelect');
const funcionesContainer = document.getElementById('funciones-container');
const fechaSelectContainer = document.getElementById('fecha-btn-container');

// Función para cargar películas en el select y seleccionar la guardada
async function fetchPeliculas() {
    try {
        const response = await fetch(apiPeliculasUrl);
        if (!response.ok) {
            throw new Error('Error al obtener las películas');
        }

        const peliculas = await response.json();
        const selectedMovieId = localStorage.getItem("selectedMovieId");

        peliculas.forEach(pelicula => {
            const option = document.createElement('option');
            option.value = pelicula.idPelicula;
            option.textContent = pelicula.tituloPelicula;
            peliculaSelect.appendChild(option);

            if (pelicula.idPelicula === parseInt(selectedMovieId)) {
                option.selected = true;
                fetchFunciones(selectedMovieId);
            }
        });

        localStorage.removeItem("selectedMovieId");
    } catch (error) {
        console.error('Error al cargar las películas:', error);
    }
}

// Evento para cargar funciones al seleccionar una película manualmente
peliculaSelect.addEventListener('change', async (event) => {
    const movieId = event.target.value;

    const existingFechaSelect = document.querySelector('.fecha-select');
    if (existingFechaSelect) {
        existingFechaSelect.remove();
    }

    funcionesContainer.innerHTML = '';

    if (movieId) {
        await fetchFunciones(movieId);
    }
});

// Función para obtener las funciones por ID de película
async function fetchFunciones(movieId) {
    const apiFuncionesUrl = `${API_BASE}/Facturas/funciones/${movieId}`;
    try {
        const response = await fetch(apiFuncionesUrl);
        if (!response.ok) {
            throw new Error('Error al obtener las funciones de la película');
        }

        const funciones = await response.json();
        renderFunciones(funciones);
    } catch (error) {
        console.error('Error al cargar las funciones:', error);
        funcionesContainer.innerHTML = '<p>Error al cargar las funciones</p>';
    }
}

// Función para renderizar las funciones
function renderFunciones(funciones) {
    const funcionesPorFecha = funciones.reduce((acc, funcion) => {
        const fecha = new Date(funcion.fecha).toLocaleDateString();
        if (!acc[fecha]) {
            acc[fecha] = [];
        }
        acc[fecha].push(funcion);
        return acc;
    }, {});

    const fechaSelect = document.createElement('select');
    fechaSelect.classList.add('fecha-select');
    fechaSelect.innerHTML = '<option value="">Seleccione una fecha</option>';

    Object.keys(funcionesPorFecha).forEach(fecha => {
        const option = document.createElement('option');
        option.value = fecha;
        option.textContent = fecha;
        fechaSelect.appendChild(option);
    });

    fechaSelect.addEventListener('change', (event) => {
        const fechaSeleccionada = event.target.value;
        funcionesContainer.innerHTML = '';

        if (fechaSeleccionada) {
            const funcionesFecha = funcionesPorFecha[fechaSeleccionada];
            renderFuncionHorarios(funcionesContainer, funcionesFecha);
        }
    });

    fechaSelectContainer.appendChild(fechaSelect);
}

function renderFuncionHorarios(container, funciones) {
    if (funciones.length > 0) {
        funciones.forEach(funcion => {
            const tipo = funcion.subtituloId ? 'Subtitulada' : 'Doblada';
            
            const tipoDiv = document.createElement('div');
            tipoDiv.classList.add('tipo');
            tipoDiv.innerHTML = `<h4>${tipo}</h4>`;
            
            const botonHorario = document.createElement('button');
            botonHorario.classList.add('horario-btn');
            botonHorario.textContent = funcion.hora.slice(0, 5);

            botonHorario.addEventListener('click', () => {
                window.location.href = `/Cliente/Funciones/Butacas/butacas.html`;
            });

            tipoDiv.appendChild(botonHorario);
            container.appendChild(tipoDiv);
        });
    }
}

// Cargar las películas al cargar la página
document.addEventListener('DOMContentLoaded', fetchPeliculas);
document.addEventListener('DOMContentLoaded', checkLoginStatus);

// Función de cierre de sesión
function logout() {
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    window.location.href = "/Login/login.html";
}

function checkLoginStatus() {
    const userRole = localStorage.getItem("userRole");
    document.getElementById("login-button").style.display = userRole ? "none" : "inline-block";
    document.getElementById("logout-button").style.display = userRole ? "inline-block" : "none";
}
