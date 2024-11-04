// Ruta base de tu API
const apiURL = 'https://localhost:7054/api/Cine/peliculas2';
const apiGeneros = 'https://localhost:7054/api/Cine/generos';

// Referencias a elementos del DOM
const movieContainer = document.getElementById('movie-container');
const genreFilter = document.getElementById('genre-filter');

// Objeto de imágenes hardcodeadas
const images = {
    "Absolution": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6jWTLDhDIrE_QHFtgI-dK1CnLv9pGTTP5Iw&s",
    "Lost on a mountain in Maine": "https://m.media-amazon.com/images/M/MV5BN2VkMmNmYWYtNmMxMC00ZDU3LTk3MjQtNGQ0YTAzYTA4MTZmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    "Bird": "https://pics.filmaffinity.com/Bird-803359683-mmed.jpg",
    "Heretic": "https://vvsfilms.com/wp-content/uploads/2024/06/vvs-heretic-poster-27x39-1.jpg",
    "100 Yards": "https://m.media-amazon.com/images/M/MV5BMjgzNGEyNmYtNmExNi00ZDAwLWJhYjEtYzkzZmQ0NzA2YjVlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg"
};

// Cargar géneros al iniciar la página
async function loadGenres() {
    try {
        const response = await fetch(apiGeneros);
        const genres = await response.json();

        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre.idGenero;  // Usar idGenero como valor
            option.textContent = genre.descripcion;  // Usar descripcion como texto
            genreFilter.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar géneros:', error);
    }
}

async function fetchMovies() {
    try {
        const response = await fetch(apiURL);
        const movies = await response.json();

        console.log(movies);
        movieContainer.innerHTML = '';

        movies.forEach(movie => {
            const movieImage = images[movie.tituloPelicula] || "https://via.placeholder.com/300x400";
            const generos = movie.generos ? movie.generos.join(", ") : "Sin género";
        
            const movieCard = `
                <div class="col-md-4 mb-4">
                    <div class="card card-inner">
                        <div class="card-front">
                            <div class="card-body">
                                <img src="${movieImage}" class="card-img-top" alt="${movie.tituloPelicula}">
                                <h5 class="card-title">${movie.tituloPelicula}</h5>
                                <p class="card-text">
                                    <strong>Director:</strong> ${movie.director}<br>
                                </p>
                                <button class="btn btn-primary ver-detalles">Ver detalles</button>
                            </div>
                        </div>
                        <div class="card-back">
                            <div class="card-body">
                                <h5 class="card-title">Detalles de ${movie.tituloPelicula}</h5>
                                <strong>Duración:</strong> ${movie.duracionMin} minutos<br>
                                <strong>Clasificación:</strong> ${movie.clasificacion}<br>
                                <strong>Estado:</strong> ${movie.estado}<br>
                                <strong>País:</strong> ${movie.pais}<br>
                                <strong>Géneros:</strong> ${generos}<br>
                                <button class="btn btn-secondary volver">Volver</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            movieContainer.innerHTML += movieCard;
        });

        assignFlipEvents();
    } catch (error) {
        console.error('Error al obtener las películas:', error);
    }
}

function assignFlipEvents() {
    document.querySelectorAll('.ver-detalles').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const cardInner = button.closest('.card-inner');
            const cardFront = cardInner.querySelector('.card-front');
            const cardBack = cardInner.querySelector('.card-back');

            cardFront.style.display = 'none';
            cardBack.style.display = 'block';
            cardInner.classList.add('flip');
        });
    });

    document.querySelectorAll('.volver').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const cardInner = button.closest('.card-inner');
            const cardFront = cardInner.querySelector('.card-front');
            const cardBack = cardInner.querySelector('.card-back');

            cardBack.style.display = 'none';
            cardFront.style.display = 'block';
            cardInner.classList.remove('flip');
        });
    });
}

// Filtrar películas según género seleccionado
async function filterMoviesByGenre() {
    const selectedGenreId = genreFilter.value; // Obtenemos el id del género seleccionado

    try {
        const response = await fetch(apiURL); // Ruta para obtener todas las películas
        const movies = await response.json();

        // Cargar los géneros para poder comparar con su descripción
        const genreResponse = await fetch(apiGeneros);
        const genres = await genreResponse.json();

        // Encontrar la descripción del género seleccionado usando su id
        const selectedGenre = genres.find(genre => genre.idGenero == selectedGenreId)?.descripcion;

        // Si se selecciona un género, filtrar películas; si no, mostrar todas
        const filteredMovies = selectedGenre 
            ? movies.filter(movie => movie.generos.includes(selectedGenre))  // Compara con el nombre del género
            : movies;

        displayMovies(filteredMovies);
    } catch (error) {
        console.error('Error al filtrar películas:', error);
    }
}



// Mostrar películas
function displayMovies(movies) {
    movieContainer.innerHTML = ''; // Limpiar el contenedor

    movies.forEach(movie => {
        const movieImage = images[movie.tituloPelicula] || "https://via.placeholder.com/300x400";
        const generos = movie.generos ? movie.generos.join(", ") : "Sin género";

        const movieCard = `
            <div class="col-md-4 mb-4">
                <div class="card card-inner">
                    <div class="card-front">
                        <div class="card-body">
                            <img src="${movieImage}" class="card-img-top" alt="${movie.tituloPelicula}">
                            <h5 class="card-title">${movie.tituloPelicula}</h5>
                            <p class="card-text">
                                <strong>Director:</strong> ${movie.director}<br>
                            </p>
                            <button class="btn btn-primary ver-detalles">Ver detalles</button>
                        </div>
                    </div>
                    <div class="card-back">
                        <div class="card-body">
                            <h5 class="card-title">Detalles de ${movie.tituloPelicula}</h5>
                            <strong>Duración:</strong> ${movie.duracionMin} minutos<br>
                            <strong>Clasificación:</strong> ${movie.clasificacion}<br>
                            <strong>Estado:</strong> ${movie.estado}<br>
                            <strong>País:</strong> ${movie.pais}<br>
                            <strong>Géneros:</strong> ${generos}<br>
                            <button class="btn btn-secondary volver">Volver</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        movieContainer.innerHTML += movieCard;
    });

    assignFlipEvents(); // Vuelve a asignar eventos después de mostrar las películas
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadGenres();
    fetchMovies();
});

genreFilter.addEventListener('change', filterMoviesByGenre);
