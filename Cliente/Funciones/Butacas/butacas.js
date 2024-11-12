const API_BASE = 'https://localhost:7220/api';
const funcionId = localStorage.getItem("selectedFuncionId"); // Recuperar el id de la función seleccionada
const apiButacasUrl = `${API_BASE}/Facturas/butacas-disponibles/${funcionId}`;
const seatingArea = document.getElementById('seating-area');
const counter = document.getElementById('counter');
const total = document.getElementById('total');
let ticketPrice = 1500; // Precio por butaca
let selectedSeats = [];

console.log(selectedSeats);

async function fetchButacas() {
    try {
        const response = await fetch(apiButacasUrl);
        if (!response.ok) throw new Error('Error al obtener las butacas');
        const butacas = await response.json();
        renderButacas(butacas);
    } catch (error) {
        console.error('Error al cargar las butacas:', error);
    }
}

function renderButacas(butacas) {
    seatingArea.innerHTML = ''; // Limpiar asientos previos

    const rows = ['A', 'B', 'C']; // Etiquetas de filas
    let seatIndex = 0; // Para acceder a cada butaca del array butacas

    rows.forEach((row, rowIndex) => {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row');

        const rowLabel = document.createElement('div');
        rowLabel.classList.add('row-label');
        rowLabel.innerText = row;
        rowDiv.appendChild(rowLabel);

        const seatGroup = document.createElement('div');
        seatGroup.classList.add('seat-group');

        for (let i = 0; i < 10; i++) { // 10 asientos por fila
            const seatDiv = document.createElement('div');
            seatDiv.classList.add('seat');

            // Verificamos si la butaca existe y si está disponible o vendida
            const butaca = butacas[seatIndex];
            if (butaca) {
                if (!butaca.disponible) {
                    seatDiv.classList.add('sold');
                } else {
                    seatDiv.classList.add('available');
                    seatDiv.addEventListener('click', () => toggleSeatSelection(seatDiv, butaca));
                }
            } else {
                // Si la butaca está indefinida, agregar una clase para diferenciarla
                seatDiv.classList.add('unavailable');
            }

            seatGroup.appendChild(seatDiv);
            seatIndex++; // Incrementa el índice de butaca
        }

        rowDiv.appendChild(seatGroup);
        seatingArea.appendChild(rowDiv);
    });
} 

function toggleSeatSelection(seatDiv, butaca) {
    // Asegurarse de que la butaca tenga un ID antes de modificar la selección
    if (butaca && 'idButaca' in butaca) {
        if (seatDiv.classList.contains('selected')) {
            seatDiv.classList.remove('selected');
            // Eliminar el ID de selectedSeats
            selectedSeats = selectedSeats.filter(id => id !== butaca.idButaca);
        } else {
            seatDiv.classList.add('selected');
            // Agregar el ID a selectedSeats si no existe ya en el array
            if (!selectedSeats.includes(butaca.idButaca)) {
                selectedSeats.push(butaca.idButaca);
            }
        }
        updateSelectedCount();
        console.log("Selected Seats:", selectedSeats); // Verificar los IDs de asientos seleccionados
    }
}

function updateSelectedCount() {
    const selectedSeatsCount = selectedSeats.length;
    counter.innerText = selectedSeatsCount;
    total.innerText = selectedSeatsCount * ticketPrice;
}

// Llamar a fetchButacas cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', fetchButacas);

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

document.addEventListener('DOMContentLoaded', checkLoginStatus);
