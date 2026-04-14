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

mainBtn.addEventListener("click", () => {

    const name = nameInput?.value;
    const department = deptInput?.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password || (!isLogin && (!name || !department))) {
        alert("Completa todos los campos");
        return;
    }

    if (isLogin) {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
            alert("No hay usuarios registrados");
            return;
        }

        if (email === user.email && password === user.password) {

            localStorage.setItem("session", JSON.stringify({
                email: user.email,
                name: user.name
            }));

            window.location.href = "camera.html";

        } else {
            alert("Credenciales incorrectas");
        }

    } else {

        const user = {
            name,
            department,
            email,
            password
        };

        localStorage.setItem("user", JSON.stringify(user));

        alert("Usuario registrado");

        isLogin = true;

        subtitle.textContent = "Inicio de sesión";
        mainBtn.textContent = "Ingresar";
        toggleText.textContent = "¿No tienes cuenta?";
        toggleLink.textContent = "Regístrate";

        nameGroup.style.display = "none";
        deptGroup.style.display = "none";
    }

});

window.addEventListener("DOMContentLoaded", () => {
    const session = localStorage.getItem("session");

    if (session) {
        window.location.href = "camera.html";
    }
});