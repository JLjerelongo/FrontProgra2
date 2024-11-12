// Obtener parámetros de la URL
const urlParams = new URLSearchParams(window.location.search);
const asientos = urlParams.get('asientos');
const total = urlParams.get('total');

// Mostrar los datos en el resumen de compra
document.getElementById('asientos').textContent = asientos;
document.getElementById('total').textContent = total;

// Manejar el envío del formulario
document.getElementById('payment-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Aquí se pueden validar los datos e implementar la lógica de pago
    const email = document.getElementById('email').value;
    const nombre = document.getElementById('nombre').value;
    const dni = document.getElementById('dni').value;
    const numeroTarjeta = document.getElementById('numero-tarjeta').value;
    const codigoSeguridad = document.getElementById('codigo-seguridad').value;
    const mesVencimiento = document.getElementById('mes-vencimiento').value;
    const añoVencimiento = document.getElementById('año-vencimiento').value;
    const medioPago = document.getElementById('medio-pago').value;

    // Ejemplo de validación y procesamiento
    if (email && nombre && dni && numeroTarjeta && codigoSeguridad && mesVencimiento && añoVencimiento && medioPago) {
        alert('Pago realizado con éxito');
        // Redirigir o realizar acciones adicionales según sea necesario
    } else {
        alert('Por favor, complete todos los campos');
    }
});
