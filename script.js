const apiURL = "https://localhost:7054/api/Cine/peliculas2";
const movieContainer = document.getElementById("movie-container");

// Objeto de imágenes hardcodeadas
const images = {
    "Absolution": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6jWTLDhDIrE_QHFtgI-dK1CnLv9pGTTP5Iw&s",
    "Lost on a mountain in Maine": "https://m.media-amazon.com/images/M/MV5BN2VkMmNmYWYtNmMxMC00ZDU3LTk3MjQtNGQ0YTAzYTA4MTZmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    "Bird": "https://pics.filmaffinity.com/Bird-803359683-mmed.jpg",
    "Heretic": "https://vvsfilms.com/wp-content/uploads/2024/06/vvs-heretic-poster-27x39-1.jpg",
    "100 Yards": "https://m.media-amazon.com/images/M/MV5BMjgzNGEyNmYtNmExNi00ZDAwLWJhYjEtYzkzZmQ0NzA2YjVlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg"
    // Agrega más películas aquí
};

async function fetchMovies() {
    try {
        const response = await fetch(apiURL);
        const movies = await response.json();

        console.log(movies);

        // Limpia el contenedor
        movieContainer.innerHTML = '';

        // Recorre cada película y crea una card
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
        

        // Asignar eventos a los botones después de renderizar las películas
        assignFlipEvents();
    } catch (error) {
        console.error('Error al obtener las películas:', error);
    }
}

function assignFlipEvents() {
    document.querySelectorAll('.ver-detalles').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Evitar que el enlace navegue
            const cardInner = button.closest('.card-inner');
            const cardFront = cardInner.querySelector('.card-front');
            const cardBack = cardInner.querySelector('.card-back');

            cardFront.style.display = 'none'; // Oculta el frente
            cardBack.style.display = 'block'; // Muestra la parte trasera
            cardInner.classList.add('flip'); // Añade clase flip para animar
        });
    });

    document.querySelectorAll('.volver').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Evitar cualquier acción por defecto
            const cardInner = button.closest('.card-inner');
            const cardFront = cardInner.querySelector('.card-front');
            const cardBack = cardInner.querySelector('.card-back');

            cardBack.style.display = 'none'; // Oculta la parte trasera
            cardFront.style.display = 'block'; // Muestra el frente
            cardInner.classList.remove('flip'); // Quita la clase flip para volver a la vista frontal
        });
    });
}

// Llama a la función para cargar las películas cuando la página cargue
document.addEventListener('DOMContentLoaded', fetchMovies);
