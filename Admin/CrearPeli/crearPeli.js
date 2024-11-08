// Función para obtener todos los directores, países, clasificaciones y géneros
async function fetchData() {
  try {
    // Obtener los directores
    const responseDirectores = await fetch('https://localhost:7220/api/Cine/directores');
    const directores = await responseDirectores.json();

    // Obtener los países
    const responsePaises = await fetch('https://localhost:7220/api/Cine/paises');
    const paises = await responsePaises.json();

    // Obtener las clasificaciones
    const responseClasificaciones = await fetch('https://localhost:7220/api/Cine/clasificaciones');
    const clasificaciones = await responseClasificaciones.json();

    // Obtener los géneros
    const responseGeneros = await fetch('https://localhost:7220/api/Cine/generos');
    const generos = await responseGeneros.json();

    // Obtener los estados
    const responseEstados = await fetch('https://localhost:7220/api/Cine/estados');
    const estados = await responseEstados.json();

    console.log(estados);

    // Llamar a la función para renderizar los datos en el formulario
    renderForm(directores, paises, clasificaciones, generos, estados);
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    alert('Hubo un error al cargar los datos necesarios para el formulario.');
  }
}

// Función para renderizar el formulario con los datos obtenidos
function renderForm(directores, paises, clasificaciones, generos, estados) {
  // Renderizar directores en un select
  const selectDirectores = document.getElementById('director');
  directores.forEach(director => {
    const option = document.createElement('option');
    option.value = director.idDirector;
    option.textContent = `${director.nombre} ${director.apellido}`;
    selectDirectores.appendChild(option);
  });

  // Renderizar países en un select
  const selectPaises = document.getElementById('pais');
  paises.forEach(pais => {
    const option = document.createElement('option');
    option.value = pais.idPais;
    option.textContent = pais.pais;
    selectPaises.appendChild(option);
  });

  // Renderizar clasificaciones en un select
  const selectClasificaciones = document.getElementById('clasificacion');
  clasificaciones.forEach(clasificacion => {
    const option = document.createElement('option');
    option.value = clasificacion.idClasificacion;
    option.textContent = clasificacion.descripcion;
    selectClasificaciones.appendChild(option);
  });

  // Renderizar géneros como checkboxes
  const generoContainer = document.getElementById('genero-container');
  generos.forEach(genero => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `genero-${genero.idGenero}`;
    checkbox.value = genero.idGenero;
    checkbox.classList.add('form-check-input');

    const label = document.createElement('label');
    label.setAttribute('for', checkbox.id);
    label.textContent = genero.descripcion;
    label.classList.add('form-check-label');

    const div = document.createElement('div');
    div.classList.add('form-check');
    div.classList.add('form-check-inline');

    div.appendChild(checkbox);
    div.appendChild(label);

    generoContainer.appendChild(div);
  });

  // Renderizar estados en un select
  const selectEstados = document.getElementById('estado');
  estados.forEach(estado => {
    const option = document.createElement('option');
    option.value = estado.idEstado;
    option.textContent = estado.estado;
    selectEstados.appendChild(option);
  });
}

// Llamar a la función para obtener y renderizar los datos al cargar la página
document.addEventListener('DOMContentLoaded', fetchData);

// Manejo del envío del formulario de registro de película
document.getElementById('formRegistrarPelicula').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Obtener los valores seleccionados en el formulario
  const tituloPelicula = document.getElementById('tituloPelicula').value;
  const duracionMin = document.getElementById('duracionMin').value;
  const idClasificacion = document.getElementById('clasificacion').value;
  const idPais = document.getElementById('pais').value;
  const idEstado = document.getElementById('estado').value;
  const nombreDirector = document.getElementById('director').selectedOptions[0].text.split(" ")[0]
  const apellidoDirector = document.getElementById('director').selectedOptions[0].text.split(" ")[1]; // Suponiendo que el formato es "Nombre Apellido"

  const generosSeleccionados = Array.from(document.getElementById('genero-container').querySelectorAll('input:checked'))
    .map(checkbox => checkbox.value);

  // Verificar que todos los campos necesarios estén completos
  if (!tituloPelicula || !duracionMin || !idClasificacion || !idPais || !idEstado || !nombreDirector || !apellidoDirector || generosSeleccionados.length === 0) {
    alert('Por favor complete todos los campos del formulario.');
    return;
  }

  // Estructura de datos para el POST
  const peliculaData = {
    tituloPelicula: tituloPelicula,
    duracionMin: duracionMin,
    idClasificacion: idClasificacion,
    idPais: idPais,
    idEstado: idEstado,
    nombreDirector: nombreDirector,
    apellidoDirector: apellidoDirector,
    generosSeleccionados: generosSeleccionados
  };

  try {
    const response = await fetch('https://localhost:7220/api/Cine', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(peliculaData),
    });
  
    if (response.ok) {
      const result = await response.json();  // Parseamos el JSON
      alert(result.message);  // Muestra el mensaje
    } else {
      const error = await response.json();  // En caso de error, también se maneja como JSON
      alert(error.message);  // Muestra el mensaje de error
    }
  } catch (error) {
    console.error('Error al enviar el formulario:', error);
    alert('Hubo un error al registrar la película');
  }
  
});

// Función para cerrar sesión
function logout() {
  // Elimina los datos de sesión del localStorage
  localStorage.removeItem("userRole");
  localStorage.removeItem("username");

  // Redirige a la página de inicio de sesión
  window.location.href = "/Login/login.html";
}

// Verificar autenticación al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  const userRole = localStorage.getItem("userRole");

  // Si no hay una sesión activa, redirigir al login
  if (!userRole) {
      window.location.href = "/Login/login.html";
  }
});
