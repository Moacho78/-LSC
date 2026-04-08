let isLogin = true;

const mainBtn = document.getElementById("mainBtn");
const toggleText = document.getElementById("toggleText");
const toggleLink = document.getElementById("toggleLink");
const subtitle = document.getElementById("subtitle");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

/* 🔄 CAMBIO LOGIN / REGISTER */
toggleLink.addEventListener("click", (e) => {
    e.preventDefault();
    isLogin = !isLogin;

    if (isLogin) {
        subtitle.innerText = "Registro e inicio de sesión";
        mainBtn.innerText = "Ingresar";
        toggleText.innerText = "¿No tienes cuenta?";
        toggleLink.innerText = "Regístrate";
    } else {
        subtitle.innerText = "Crear cuenta";
        mainBtn.innerText = "Registrarse";
        toggleText.innerText = "¿Ya tienes cuenta?";
        toggleLink.innerText = "Inicia sesión";
    }
});

/* 🚀 ACCIÓN PRINCIPAL */
mainBtn.addEventListener("click", async () => {

    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
        alert("Completa todos los campos");
        return;
    }

    if (isLogin) {
        try {
            const response = await fetch("http://localhost:3000/api/usuarios/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Error en el login");
                return;
            }

            // 🔥 GUARDAR SESIÓN 
            localStorage.setItem("session", JSON.stringify(data));

            alert("Login exitoso");
            window.location.href = "camera.html";

        } catch (error) {
            console.error(error);
            alert("Error al conectar con el servidor");
        }

    } else {
        // REGISTRO (puedes luego también hacerlo con fetch si tienes endpoint)
        const user = { email, password };
        localStorage.setItem("user", JSON.stringify(user));

        alert("Usuario registrado");

        isLogin = true;
        mainBtn.innerText = "Ingresar";
        subtitle.innerText = "Registro e inicio de sesión";
        toggleText.innerText = "¿No tienes cuenta?";
        toggleLink.innerText = "Regístrate";
    }

});

/* 🔥 AUTO LOGIN */
window.addEventListener("DOMContentLoaded", () => {
    const session = localStorage.getItem("session");

    if (session) {
        window.location.href = "camera.html";
    }
});