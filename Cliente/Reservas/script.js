// Obtener el id de la película desde la URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

// Ruta para obtener la película por id
const apiMovieUrl = `https://localhost:7220/api/Cine/peliculas2/${movieId}`;

// Referencias a los elementos donde mostrar la información
const movieDetails = document.getElementById('movie-details');

async function fetchMovieDetails() {
    try {
        const response = await fetch(apiMovieUrl);
        
        if (!response.ok) {
            throw new Error('No se pudo obtener la película');
        }

        const movie = await response.json();

        // Mostrar la información de la película en la página
        movieDetails.innerHTML = `
            <h2>${movie.tituloPelicula}</h2>
            <p><strong>Director:</strong> ${movie.director}</p>
            <p><strong>Duración:</strong> ${movie.duracionMin} minutos</p>
            <p><strong>Clasificación:</strong> ${movie.clasificacion}</p>
            <p><strong>Estado:</strong> ${movie.estado}</p>
            <p><strong>Géneros:</strong> ${movie.generos.join(', ')}</p>
            <button id="reserve-button" class="btn btn-success">Reservar entrada</button>
        `;
    } catch (error) {
        console.error('Error al obtener los detalles de la película:', error);
        movieDetails.innerHTML = `<p>Error al cargar los detalles de la película.</p>`;
    }
}

// Llamar a la función para cargar los detalles de la película
fetchMovieDetails();

// Agregar la funcionalidad al botón de reserva
document.getElementById('reserve-button')?.addEventListener('click', () => {
    // Aquí puedes implementar la lógica para realizar la reserva, por ejemplo, abrir un formulario o redirigir a otra página.
    alert('Reserva realizada con éxito');
});


// Función de cierre de sesión
function logout() {
    // Elimina los datos de sesión del localStorage
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");

    // Redirige a la página de inicio de sesión
    window.location.href = "/Login/login.html"; // Cambia la ruta según la ubicación de tu página de login
}

// Verificar si el usuario ha iniciado sesión
function checkLoginStatus() {
    const userRole = localStorage.getItem("userRole");

    if (userRole) {
        document.getElementById("login-button").style.display = "none"; // Oculta el botón de iniciar sesión
        document.getElementById("logout-button").style.display = "inline-block"; // Muestra el botón de cerrar sesión
    } else {
        document.getElementById("login-button").style.display = "inline-block"; // Muestra el botón de iniciar sesión
        document.getElementById("logout-button").style.display = "none"; // Oculta el botón de cerrar sesión
    }
}

// Verificar el estado de login al cargar la página
document.addEventListener('DOMContentLoaded', checkLoginStatus);