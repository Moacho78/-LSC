window.addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector(".navbar nav");
    const session = JSON.parse(localStorage.getItem("session"));

    if (session) {
        nav.innerHTML = `
            <a href="index.html">Inicio</a>
            <a href="camera.html">Cámara</a>
            <a href="practice.html">Prácticas</a>
            <span style="margin-left:20px;">👤 ${session.usuario.nombre}</span>
            <button id="logoutBtn" class="btn-nav">Salir</button>
        `;

        document.getElementById("logoutBtn").addEventListener("click", () => {
            localStorage.removeItem("session");
            window.location.href = "login.html";
        });
    }
    //Mantener Activo la pagina en la que se esta presente
    const currentPage = window.location.pathname.split("/").pop();

    document.querySelectorAll(".navbar a").forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });
});