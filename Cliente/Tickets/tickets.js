const API_BASE = 'https://localhost:7220/api';

// Función para obtener las descripciones de las butacas
async function fetchButacasDescripcion(asientos) {
    const butacasDescripcion = await Promise.all(
        asientos.map(async (idButaca) => {
            const apiButacaUrl = `${API_BASE}/Facturas/butacas-porId?idButaca=${idButaca}`;
            try {
                const response = await fetch(apiButacaUrl);
                if (!response.ok) throw new Error('Error al obtener la descripción de la butaca');

                const descripcion = await response.text();
                return descripcion; // Ejemplo: "Fila A - Asiento 5"
            } catch (error) {
                console.error(`Error al cargar la descripción de la butaca con ID ${idButaca}:`, error);
                return "Descripción no disponible"; // En caso de error
            }
        })
    );

    return butacasDescripcion; // Retorna el array de descripciones
}

// Función para mostrar los tickets comprados
async function mostrarTickets() {
    // Recuperar los datos de los tickets desde localStorage
    const ticketsData = JSON.parse(localStorage.getItem("ticketsData"));

    if (!ticketsData) {
        document.getElementById("tickets-container").textContent = "No se encontraron tickets.";
        return;
    }

    const { funcion, asientos, pelicula, fecha, hora } = ticketsData;
    const ticketsContainer = document.getElementById("tickets-container");

    // Obtener las descripciones de los asientos
    const butacasDescripcion = await fetchButacasDescripcion(asientos);

    // Crear una tarjeta para cada asiento/ticket con la descripción completa
    butacasDescripcion.forEach((descripcion, index) => {
        const ticketDiv = document.createElement("div");
        ticketDiv.classList.add("card", "mb-3");

        ticketDiv.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">Ticket ${index + 1}</h5>
                <p><strong>Película:</strong> ${pelicula}</p>
                <p><strong>Fecha:</strong> ${new Date(fecha).toLocaleDateString()}</p>
                <p><strong>Hora:</strong> ${hora}</p>
                <p><strong>Sala:</strong> ${funcion.salaId}</p>
                <p><strong>Tipo:</strong> ${funcion.subtituloId ? 'Subtitulada' : 'Doblada'}</p>
                <p><strong>Asiento:</strong> ${descripcion}</p> <!-- Muestra la descripción completa del asiento -->
            </div>
        `;
        ticketsContainer.appendChild(ticketDiv);
    });
}

// Función para redirigir al catálogo
function volverAlCatalogo() {
    window.location.href = "/Cliente/Home/index.html";
}

// Llamar a la función para mostrar los tickets al cargar la página
document.addEventListener("DOMContentLoaded", mostrarTickets);
