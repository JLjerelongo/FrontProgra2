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
    console.log("ID de la función:", funcionId); // Verificar que funcionId no sea null o undefined
    if (!funcionId) {
        console.error("El ID de la función no se encuentra en localStorage.");
        return null;
    }

    const apiFuncionUrl = `${API_BASE}/Facturas/funcionesPorId?idFuncion=${funcionId}`;
    console.log("URL de la API para la función:", apiFuncionUrl); // Verificar la URL de la API

    try {
        const response = await fetch(apiFuncionUrl);
        if (!response.ok) throw new Error('Error al obtener los detalles de la función');

        const funcion = await response.json();
        console.log("Detalles de la función obtenidos:", funcion); // Verificar los datos de la función

        // Mostrar detalles de la función en el resumen de compra
        document.getElementById('pelicula').textContent = funcion.tituloPelicula;
        document.getElementById('sala').textContent = funcion.salaId;
        document.getElementById('fecha').textContent = new Date(funcion.fecha).toLocaleDateString();
        document.getElementById('horario').textContent = funcion.hora;
        document.getElementById('tipo').textContent = funcion.subtituloId ? 'Subtitulada' : 'Doblada';

        return funcion; // Asegúrate de retornar el objeto funcion
    } catch (error) {
        console.error('Error al cargar los detalles de la función:', error);
        return null; // Retornar null en caso de error para manejarlo adecuadamente
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
        console.log(cliente); // Verificar el cliente en consola

        // Mostrar el email en el campo y deshabilitarlo para que no sea editable
        const emailField = document.getElementById('email');
        emailField.value = cliente.email;
        emailField.disabled = true;

        return cliente; // Asegurarse de retornar el objeto cliente
    } catch (error) {
        console.error('Error al cargar la información del cliente:', error);
        return null; // Retornar null en caso de error para manejarlo
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


// Función para obtener y mostrar las formas de pago
async function fetchFormasPago() {
    const apiFormasPagoUrl = 'https://localhost:7220/api/Facturas/formas-pago';

    try {
        const response = await fetch(apiFormasPagoUrl);
        if (!response.ok) throw new Error('Error al obtener las formas de pago');

        const formasPago = await response.json();
        const medioPagoSelect = document.getElementById('medio-pago');

        // Filtrar y excluir "Efectivo" antes de agregar las opciones al select
        formasPago.forEach(forma => {
            if (forma.descripcion.toLowerCase() !== "efectivo") { // Filtrar si la descripción es "Efectivo"
                const option = document.createElement('option');
                option.value = forma.idFormaPago;
                option.textContent = forma.descripcion;
                medioPagoSelect.appendChild(option);
            }
        });

    } catch (error) {
        console.error('Error al cargar las formas de pago:', error);
    }
}

// Llamar a la función para cargar las formas de pago cuando se carga la página
fetchFormasPago();

// Manejar el envío del formulario de pago
document.getElementById('payment-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const dni = document.getElementById('dni').value;
    const numeroTarjeta = document.getElementById('numero-tarjeta').value;
    const codigoSeguridad = document.getElementById('codigo-seguridad').value;
    const mesVencimiento = document.getElementById('mes-vencimiento').value;
    const añoVencimiento = document.getElementById('año-vencimiento').value;
    const idFormaPago = document.getElementById('medio-pago').value;

    const cliente = await fetchClienteInfo();
    const funcion = await fetchFuncionDetails();

    if (!cliente) {
        alert('Error al obtener información del cliente. Por favor, inténtalo de nuevo.');
        return;
    }
    if (!funcion) {
        alert('Error al obtener información de la función. Por favor, inténtalo de nuevo.');
        return;
    }

    const butacas = selectedSeats.map(butaca => butaca.id);

    const pagoData = {
        idCliente: parseInt(cliente.idCliente, 10),
        nombreCliente: cliente.nombre,
        apellidoCliente: cliente.apellido,
        documentoCliente: dni,
        emailCliente: cliente.email,
        telefonoCliente: cliente.telefono,
        tituloPelicula: funcion.tituloPelicula,
        fechaFuncion: funcion.fecha,
        horaFuncion: funcion.hora,
        precioTotal: parseFloat(total),
        idButacasSala: selectedSeats,
        idFormaPago: parseInt(idFormaPago, 10),
        idBoleteria: 3,
        idFuncion: funcion.idFuncion,
        cantidadEntradas: butacas.length
    };

    console.log("Datos enviados en el POST:", pagoData);

    try {
        const response = await fetch(`${API_BASE}/Facturas/comprar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pagoData)
        });

        if (!response.ok) throw new Error('Error en el procesamiento del pago');

        console.log('POST realizado con éxito:', response);

        // Almacenar los datos relevantes para mostrarlos en la página de tickets
        localStorage.setItem("ticketsData", JSON.stringify({
            funcion: funcion,
            asientos: selectedSeats,
            pelicula: funcion.tituloPelicula,
            fecha: funcion.fecha,
            hora: funcion.hora
        }));

        // Actualizar el estado de las butacas a no disponibles
        await actualizarEstadoButacas(selectedSeats); // Llamada para cambiar disponibilidad

        // Redirigir a la página de tickets
        window.location.href = "/Cliente/Tickets/tickets.html";
    } catch (error) {
        console.error('Error al realizar el pago:', error);
        alert('Error al procesar el pago');
    }
});



// Función para actualizar el estado de las butacas a no disponibles
async function actualizarEstadoButacas(asientosComprados) {
    const updateRequests = asientosComprados.map(async (idButaca) => {
        const apiButacaUrl = `${API_BASE}/Facturas/actualizarButaca?idButaca=${idButaca}`;

        try {
            const response = await fetch(apiButacaUrl, {
                method: 'PUT', // Cambia a 'PUT' si el endpoint requiere este método
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ disponible: false }) // Cambia el estado a false
            });

            if (!response.ok) {
                throw new Error(`Error al actualizar la disponibilidad de la butaca con ID ${idButaca}`);
            }

            console.log(`Butaca ${idButaca} actualizada a no disponible`);
        } catch (error) {
            console.error(`Error al actualizar la disponibilidad de la butaca con ID ${idButaca}:`, error);
        }
    });

    await Promise.all(updateRequests); // Espera que todas las solicitudes de actualización se completen
}
