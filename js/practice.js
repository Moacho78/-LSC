let currentVideo = null;
let questions = [];
let answers = {};
let currentQuestionIndex = 0;


async function loadPalabras() {
    try {
        const session = JSON.parse(localStorage.getItem("session"));

        const token = session?.token;

        console.log(token);

        const res = await fetch("http://localhost:3000/api/palabra/palabras", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        const timeline = document.querySelector(".timeline");
        timeline.innerHTML = "";

        data.data.forEach((item) => {
            timeline.innerHTML += `
                <div class="item">
                    <div class="circle"></div>
                    <div class="content" onclick="loadVideo('${item._id}', '${item.palabra}')">
                        ${item.palabra}
                    </div>
                </div>
            `;
        });

    } catch (error) {
        console.error("Error cargando palabras:", error);
    }
}



async function loadVideo(id, palabra) {
    currentVideo = id;
    const session = JSON.parse(localStorage.getItem("session"));
    const token = session?.token;

    document.getElementById("videoContainer").innerHTML =
        `<p>Cargando ${palabra}...</p>`;

    document.querySelectorAll(".item")
        .forEach(el => el.classList.remove("active"));

    // activar el seleccionado
    event.target.closest(".item").classList.add("active");

    try {

        const res = await fetch(`http://localhost:3000/api/palabra/palabras/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await res.json();


        const videoUrl = data.data.video_referencia;
        const mp4Url = videoUrl.replace("/upload/", "/upload/f_mp4/");


        document.getElementById("videoContainer").innerHTML = `
    <video controls width="800">
        <source src="${mp4Url}" type="video/mp4">
    </video>
`;

    } catch (error) {
        console.error("Error cargando video:", error);
    }
}

/* PREGUNTAS */
async function loadQuestions(id) {

    console.log(id);
    const session = JSON.parse(localStorage.getItem("session"));
    const token = session?.token;

    try {

        const res = await fetch(`http://localhost:3000/api/palabra/palabras/${id}/evaluacion`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await res.json();


        questions = data.data.preguntas;
        currentQuestionIndex = 0;

        renderQuestion();


    } catch (error) {
        console.error("Error cargando video:", error);
    }


}

/* MODAL */
function openModal() {
    console.log("Intentando abrir modal");

    if (!currentVideo) {
        alert("Selecciona un video");
        return;
    }

    if (questions.length === 0) {
        loadQuestions(currentVideo);
    }

    const modal = document.getElementById("questionModal");
    if (!modal) return console.error("Modal no encontrado");

    modal.style.display = "flex";

    currentQuestionIndex = 0;
    answers = {};

    renderQuestion();
}

function closeModal() {
    const modal = document.getElementById("questionModal");
    if (modal) modal.style.display = "none";
}

/* RENDER */
function renderQuestion(direction = "next") {
    const form = document.getElementById("quizForm");
    if (!form) return;

    const q = questions[currentQuestionIndex];

    let html = `<div class="question"><p>${q.enunciado}</p>`;

    q.opciones.forEach((opt, index) => {
        const checked = answers[currentQuestionIndex] == index ? "checked" : "";

        html += `
            <label>
                <input 
                    type="radio" 
                    name="question_${currentQuestionIndex}" 
                    value="${index}" 
                    ${checked}
                    onchange="saveAnswer(${currentQuestionIndex}, ${index})"
                >
                ${opt}
            </label>`;
    });

    html += `</div><div class="modal-buttons">`;

    if (currentQuestionIndex > 0)
        html += `<button type="button" onclick="prevQuestion()">Atrás</button>`;

    if (currentQuestionIndex < questions.length - 1)
        html += `<button type="button" onclick="nextQuestion()">Continuar</button>`;
    else
        html += `<button type="button" onclick="showSummary()">Finalizar</button>`;

    html += `</div>`;

    form.innerHTML = html;
}

/* NAV */
function nextQuestion() {
    currentQuestionIndex++;
    renderQuestion("next");
}

function prevQuestion() {
    currentQuestionIndex--;
    renderQuestion("back");
}

/* GUARDAR */
function saveAnswer(questionIndex, optionIndex) {
    answers[questionIndex] = optionIndex;
}

function showSummary() {
    let html = `<h3 style="text-align:center;">Confirmar respuestas</h3>`;

    questions.forEach((q, i) => {
        const respuesta = answers[i] != null
            ? q.opciones[answers[i]]
            : "No respondida";

        html += `
            <div class="summary-item">
                <strong>${q.enunciado}</strong><br>
                ${respuesta}
            </div>
        `;
    });

    html += `
        <button class="summary-btn" type="button" onclick="submitQuiz()">
            Confirmar respuestas
        </button>
    `;

    document.getElementById("quizForm").innerHTML = html;
}

// Resultado 
function submitQuiz() {
    let correct = 0;

    questions.forEach((q, i) => {
        const userAnswer = answers[i];

        if (userAnswer !== undefined && userAnswer !== null) {
            if ((parseInt(userAnswer) + 1) === q.respuesta_correcta) {
                correct++;
            }
        }
    });

    const score = document.getElementById("scoreDisplay");

    if (score) {
        score.innerText = `Resultado: ${correct}/${questions.length}`;
    }

    closeModal();
}

/* EVENTO BOTÓN */
document.addEventListener("DOMContentLoaded", () => {
    loadPalabras();
    document.getElementById("openQuiz")
        ?.addEventListener("click", openModal);
});

/* 🔥 FIX GLOBAL */
window.loadVideo = loadVideo;
window.closeModal = closeModal;
window.nextQuestion = nextQuestion;
window.prevQuestion = prevQuestion;
window.showSummary = showSummary;
window.submitQuiz = submitQuiz;