window.addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector(".navbar nav");
    const session = JSON.parse(localStorage.getItem("session"));

    if (session) {
        // limpiar botones actuales
        nav.innerHTML = `
            <a href="index.html">Inicio</a>
            <a href="camera.html">Cámara</a>
            <span style="margin-left:20px;">👤 ${session.email}</span>
            <button id="logoutBtn" class="btn-nav">Salir</button>
        `;

        document.getElementById("logoutBtn").addEventListener("click", () => {
            localStorage.removeItem("session");
            window.location.href = "login.html";
        });
    }
});