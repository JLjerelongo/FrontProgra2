const API_BASE = 'https://localhost:7220/api';
const funcionId = localStorage.getItem("selectedFuncionId"); // Recuperar el id de la función seleccionada
const username = localStorage.getItem("username"); // Recuperar el username del cliente

const urlParams = new URLSearchParams(window.location.search);
const asientos = urlParams.get('asientos');
const total = urlParams.get('total');

// Recuperar el array de selectedSeats desde localStorage
const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats"));
document.getElementById('asientos').textContent = asientos;
document.getElementById('total').textContent = total;

// Llamada para obtener los detalles de la función
async function fetchFuncionDetails() {
    const apiFuncionUrl = `${API_BASE}/Facturas/funcionesPorId?idFuncion=${funcionId}`;

    try {
        const response = await fetch(apiFuncionUrl);
        if (!response.ok) throw new Error('Error al obtener los detalles de la función');

        const funcion = await response.json();

        // Mostrar detalles de la función en el resumen de compra
        document.getElementById('pelicula').textContent = funcion.tituloPelicula;
        document.getElementById('sala').textContent = funcion.salaId;
        document.getElementById('fecha').textContent = new Date(funcion.fecha).toLocaleDateString();
        document.getElementById('horario').textContent = funcion.hora;
        document.getElementById('tipo').textContent = funcion.subtituloId ? 'Subtitulada' : 'Doblada';

    } catch (error) {
        console.error('Error al cargar los detalles de la función:', error);
    }
}

// Función para obtener las descripciones de las butacas
async function fetchButacasDescripcion() {
    const butacasDescripcion = await Promise.all(
        selectedSeats.map(async (idButaca) => {
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

    document.getElementById('butacas').textContent = butacasDescripcion.join(", ");
}

// Función para obtener la información del cliente por su username
async function fetchClienteInfo() {
    const apiClienteUrl = `${API_BASE}/Facturas/clientePorUsername?username=${username}`;

    try {
        const response = await fetch(apiClienteUrl);
        if (!response.ok) throw new Error('Error al obtener la información del cliente');

        const cliente = await response.json();

        // Mostrar el email en el campo y deshabilitarlo para que no sea editable
        const emailField = document.getElementById('email');
        emailField.value = cliente.email;
        emailField.disabled = true;
    } catch (error) {
        console.error('Error al cargar la información del cliente:', error);
    }
}

// Llamar a las funciones para obtener los detalles de la función, descripciones de las butacas y la información del cliente
fetchFuncionDetails();
fetchButacasDescripcion();
fetchClienteInfo();

// Manejar el envío del formulario de pago
document.getElementById('payment-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const dni = document.getElementById('dni').value;
    const numeroTarjeta = document.getElementById('numero-tarjeta').value;
    const codigoSeguridad = document.getElementById('codigo-seguridad').value;
    const mesVencimiento = document.getElementById('mes-vencimiento').value;
    const añoVencimiento = document.getElementById('año-vencimiento').value;
    const medioPago = document.getElementById('medio-pago').value;

    if (nombre && dni && numeroTarjeta && codigoSeguridad && mesVencimiento && añoVencimiento && medioPago) {
        alert('Pago realizado con éxito');
    } else {
        alert('Por favor, complete todos los campos');
    }
});

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
