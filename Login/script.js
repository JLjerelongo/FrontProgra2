async function login(event) {
    event.preventDefault(); // Evita el envío del formulario

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    console.log("Datos de inicio de sesión enviados:", { username, password });

    try {
        const response = await fetch("https://localhost:7220/api/Cine/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        
        console.log("Resultado de la respuesta:", result);

        if (response.ok && result.success) {
            // Guarda el rol y el nombre de usuario en localStorage
            localStorage.setItem("userRole", result.role);
            localStorage.setItem("username", username); // Guardar el username para uso futuro

            alert("Inicio de sesión exitoso");

            // Redirige según el rol del usuario
            if (result.role === "Administrador") {
                window.location.href = "/Admin/HomeAdmin/index.html"; // Página principal para administradores
            } else if (result.role === "Cliente") {
                window.location.href = "/Cliente/Home/index.html"; // Página para clientes
            } else {
                document.getElementById("error-message").textContent = "Rol no reconocido. Intenta de nuevo.";
            }
        } else {
            // Muestra el mensaje de error
            document.getElementById("error-message").textContent = result.message || "Usuario o contraseña incorrectos";
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        document.getElementById("error-message").textContent = "Ocurrió un error al conectar con el servidor.";
    }
}

function logout() {
    // Elimina los datos de sesión del localStorage
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");

    // Redirige a la página de inicio de sesión
    window.location.href = "/Login/login.html";
}

// Verificar sesión solo si no estamos en la página de login
document.addEventListener("DOMContentLoaded", function() {
    const userRole = localStorage.getItem("userRole");
    const currentPath = window.location.pathname;

    // Verifica si hay una sesión activa y si el usuario está en una página protegida
    if (!userRole && currentPath !== "/Login/login.html") {
        window.location.href = "/Login/login.html";
    }
});
