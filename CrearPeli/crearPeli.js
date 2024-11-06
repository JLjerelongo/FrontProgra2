// Función para obtener todos los directores, países, clasificaciones y géneros
async function fetchData() {
    try {
      // Obtener los directores
      const responseDirectores = await fetch('https://localhost:7054/api/Cine/directores');
      const directores = await responseDirectores.json();
  
      // Obtener los países
      const responsePaises = await fetch('https://localhost:7054/api/Cine/paises');
      const paises = await responsePaises.json();
  
      // Obtener las clasificaciones
      const responseClasificaciones = await fetch('https://localhost:7054/api/Cine/clasificaciones');
      const clasificaciones = await responseClasificaciones.json();
  
      // Obtener los géneros
      const responseGeneros = await fetch('https://localhost:7054/api/Cine/generos');
      const generos = await responseGeneros.json();

      // Obtener los géneros
      const responseEstados = await fetch('https://localhost:7054/api/Cine/estados');
      const estados = await responseEstados.json();
  
      // Llamar a la función para renderizar los datos en el formulario
      renderForm(directores, paises, clasificaciones, generos, estados);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
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
  
    // Renderizar géneros en un select
    const selectGeneros = document.getElementById('genero');
    generos.forEach(genero => {
      const option = document.createElement('option');
      option.value = genero.idGenero;
      option.textContent = genero.descripcion;
      selectGeneros.appendChild(option);
    });

     // Renderizar clasificaciones en un select
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
    const nombreDirector = document.getElementById('director').value;
    const apellidoDirector = document.getElementById('director').selectedOptions[0].text.split(" ")[1]; // Suponiendo que el formato es "Nombre Apellido"
    
    const generosSeleccionados = Array.from(document.getElementById('genero').selectedOptions)
                                       .map(option => option.value);
  
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
      // Enviar la solicitud POST
      const response = await fetch('https://localhost:7054/api/Cine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(peliculaData),
      });
  
      if (response.ok) {
        alert('Película registrada con éxito');
      } else {
        const error = await response.text();
        alert(`Error al registrar la película: ${error}`);
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      alert('Hubo un error al registrar la película');
    }
  });
  