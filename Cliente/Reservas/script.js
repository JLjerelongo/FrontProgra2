// Objeto de imágenes hardcodeadas
const images = {
    "Absolution": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6jWTLDhDIrE_QHFtgI-dK1CnLv9pGTTP5Iw&s",
    "Lost on a mountain in Maine": "https://m.media-amazon.com/images/M/MV5BN2VkMmNmYWYtNmMxMC00ZDU3LTk3MjQtNGQ0YTAzYTA4MTZmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    "Bird": "https://pics.filmaffinity.com/Bird-803359683-mmed.jpg",
    "Heretic": "https://vvsfilms.com/wp-content/uploads/2024/06/vvs-heretic-poster-27x39-1.jpg",
    "100 Yards": "https://m.media-amazon.com/images/M/MV5BMjgzNGEyNmYtNmExNi00ZDAwLWJhYjEtYzkzZmQ0NzA2YjVlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    "Fast & Furious 1": "https://i.pinimg.com/originals/d3/10/2f/d3102f4468a78a30ad531d03a00ea14d.jpg"
};

// Obtener el id de la película desde la URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

// Ruta para obtener la película por id
const apiMovieUrl = `https://localhost:7220/api/Cine/peliculas/${movieId}`;

// Referencias a los elementos donde mostrar la información
const movieDetails = document.getElementById('movie-details');

async function fetchMovieDetails() {
    try {
        const response = await fetch(apiMovieUrl);
        
        if (!response.ok) {
            throw new Error('No se pudo obtener la película');
        }

        const movie = await response.json();

        // Obtener la imagen desde el objeto images o utilizar una imagen predeterminada si no está disponible
        const movieImage = images[movie.tituloPelicula] || "https://via.placeholder.com/300x400";

        // Mostrar la información de la película en la página junto con la imagen
        movieDetails.innerHTML = `
            <div class="movie-info">
                <div class="movie-details">
                    <h2 class="movie-title">${movie.tituloPelicula}</h2>
                    <p><strong>Director:</strong> ${movie.director}</p>
                    <p><strong>Duración:</strong> ${movie.duracionMin} minutos</p>
                    <p><strong>Clasificación:</strong> ${movie.clasificacion}</p>
                    <p><strong>Estado:</strong> ${movie.estado}</p>
                    <p><strong>Géneros:</strong> ${movie.generos.join(', ')}</p>
                    <button id="funcion-button" class="btn btn-success">Funciones</button>
                </div>
                <div class="movie-image">
                    <img src="${movieImage}" alt="Poster de ${movie.tituloPelicula}" class="poster-img">
                </div>
            </div>
        `;

        // Agregar la funcionalidad al botón de reserva
        document.getElementById('funcion-button').addEventListener('click', () => {
            // Guarda el ID de la película en localStorage
            localStorage.setItem("selectedMovieId", movie.idPelicula);
            // Redirige a la página de funciones
            window.location.href = "/Cliente/Funciones/funciones.html"; 
        });
    } catch (error) {
        console.error('Error al obtener los detalles de la película:', error);
        movieDetails.innerHTML = `<p>Error al cargar los detalles de la película.</p>`;
    }
}

// Llamar a la función para cargar los detalles de la película
fetchMovieDetails();

// Función de cierre de sesión
function logout() {
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    window.location.href = "/Login/login.html";
}

// Verificar si el usuario ha iniciado sesión
function checkLoginStatus() {
    const userRole = localStorage.getItem("userRole");
    document.getElementById("login-button").style.display = userRole ? "none" : "inline-block";
    document.getElementById("logout-button").style.display = userRole ? "inline-block" : "none";
}

// Verificar el estado de login al cargar la página
document.addEventListener('DOMContentLoaded', checkLoginStatus);

