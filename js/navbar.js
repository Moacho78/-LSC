window.addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector(".navbar nav");
    const session = JSON.parse(localStorage.getItem("session"));

    if (session) {
        nav.innerHTML = `
            <a href="index.html">Inicio</a>
            <a href="camera.html">Cámara</a>
            <a href="practice.html">Prácticas</a>

            <div class="nav-user-group">
                <span class="user-link">${session.usuario.nombre}</span>

                <button id="logoutBtn" class="logout-btn">
                    <img src="img/logout.png" alt="Salir">
                </button>
            </div>
        `;

        document.getElementById("logoutBtn").addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("session");
            window.location.href = "login.html";
        });
    }

    // 🔥 LINK ACTIVO
    const currentPage = window.location.pathname.split("/").pop();

    document.querySelectorAll(".navbar a").forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });
});