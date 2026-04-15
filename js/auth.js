let isLogin = true;

const subtitle = document.getElementById("subtitle");
const mainBtn = document.getElementById("mainBtn");
const toggleText = document.getElementById("toggleText");
const toggleLink = document.getElementById("toggleLink");

const nameGroup = document.getElementById("nameGroup");
const deptGroup = document.getElementById("deptGroup");

const nameInput = document.getElementById("name");
const deptInput = document.getElementById("department");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

toggleLink.addEventListener("click", (e) => {
    e.preventDefault();

    const groups = document.querySelectorAll(".form-group");

    groups.forEach(el => el.classList.add("fade"));

    setTimeout(() => {
        isLogin = !isLogin;

        if (isLogin) {
            subtitle.textContent = "Inicio de sesión";
            mainBtn.textContent = "Ingresar";
            toggleText.textContent = "¿No tienes cuenta?";
            toggleLink.textContent = "Regístrate";

            nameGroup.style.display = "none";
            deptGroup.style.display = "none";
        } else {
            subtitle.textContent = "Crear cuenta";
            mainBtn.textContent = "Registrarse";
            toggleText.textContent = "¿Ya tienes cuenta?";
            toggleLink.textContent = "Inicia sesión";

            nameGroup.style.display = "flex";
            deptGroup.style.display = "flex";
        }

        setTimeout(() => {
            groups.forEach(el => el.classList.remove("fade"));
        }, 5);

    }, 200);
});

mainBtn.addEventListener("click", async () => {

    const name = nameInput?.value;
    const department = deptInput?.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password || (!isLogin && (!name || !department))) {
        alert("Completa todos los campos");
        return;
    }

    if (isLogin) {
        try {

            //Logica de inicio de sesion

            const response = await fetch("http://localhost:3000/api/usuarios/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Credenciales incorrectas");
                return;
            }

            // Guardar sesión
            localStorage.setItem("session", JSON.stringify(data));

            window.location.href = "camera.html";
            //Finaliza logica de inicio de sesion
        } catch (error) {
            console.error(error);
            alert("Error al conectar con el servidor");
        }
    } else {
        try {
            //logica de registro de usuarios
            const response = await fetch("http://localhost:3000/api/usuarios/registro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    nombre: name,
                    departamento: department,
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Error al registrar usuario");
                return;
            }

            // 🔥 OPCIÓN 2 (si prefieres NO auto login):

            isLogin = true;
            subtitle.textContent = "Inicio de sesión";
            mainBtn.textContent = "Ingresar";
            toggleText.textContent = "¿No tienes cuenta?";
            toggleLink.textContent = "Regístrate";

            nameGroup.style.display = "none";
            deptGroup.style.display = "none";
            //cierra logica de registro de usuarios  
        } catch (error) {
            console.error(error);
            alert("Error al conectar con el servidor");
        }
    }

});

window.addEventListener("DOMContentLoaded", () => {
    const session = localStorage.getItem("session");

    if (session) {
        window.location.href = "camera.html";
    }
});