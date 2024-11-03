document.getElementById('movie-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío del formulario por defecto

    // Obtener los valores del formulario
    const titulo = document.getElementById('titulo').value;
    const anio = parseInt(document.getElementById('anio').value, 10); // Convertir a entero
    const director = document.getElementById('director').value;
    const genero = parseInt(document.getElementById('genero').value, 10); // Convertir a entero

    // Crear objeto de la película
    const nuevaPelicula = {
        id: 0, // Puede ser 0 para indicar una nueva película
        titulo: titulo,
        director: director,
        anio: anio,
        estreno: true, // Cambia esto según tus necesidades
        idGenero: genero,
        generoNavigation: {
            id: genero, // Usar el mismo id del género que se seleccionó
            nombre: "string", // Cambia esto a lo que necesites
            peliculas: []
        }
    };

    // Aquí iría la lógica para enviar la película a la API
    fetch('https://localhost:7223/api/Peliculas', { // URL de tu API
        method: 'POST',
        headers: {
            'accept': '*/*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevaPelicula)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('No se pudo insertar la película');
        }
        return response.json();
    })
    .then(data => {
        // Mostrar mensaje de éxito
        showMessage('Película insertada correctamente', 'success');
        // Reiniciar el formulario
        document.getElementById('movie-form').reset();
    })
    .catch(error => {
        // Mostrar mensaje de error
        showMessage('Error al insertar la película: ' + error.message, 'danger');
    });
});

// Función para mostrar mensajes
function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.className = `alert alert-${type}`;
    messageDiv.innerText = message;
    messageDiv.style.display = 'block'; // Mostrar el mensaje
}
