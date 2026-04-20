let currentVideo = null;
let questions = [];
let answers = {};
let currentQuestionIndex = 0;

/* VIDEO */
function loadVideo(id) {
    currentVideo = id;

    document.getElementById("videoContainer").innerHTML =
        `<p>Video ${id} cargado</p>`;

    document.querySelectorAll(".item")
        .forEach(el => el.classList.remove("active"));

    document.querySelectorAll(".item")[id - 1]
        ?.classList.add("active");

    loadQuestions();
}

/* PREGUNTAS */
function loadQuestions() {
    questions = [
        { id:"q1", text:"¿Pregunta 1?", options:["A","B","C"], correct:"A"},
        { id:"q2", text:"¿Pregunta 2?", options:["A","B","C"], correct:"B"},
        { id:"q3", text:"¿Pregunta 3?", options:["A","B","C"], correct:"C"},
        { id:"q4", text:"¿Pregunta 4?", options:["A","B","C"], correct:"A"},
        { id:"q5", text:"¿Pregunta 5?", options:["A","B","C"], correct:"B"}
    ];
}

/* MODAL */
function openModal() {
    console.log("Intentando abrir modal");

    if (!currentVideo) {
        alert("Selecciona un video");
        return;
    }

    if (questions.length === 0) {
        loadQuestions();
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

    let html = `<div class="question"><p>${q.text}</p>`;

    q.options.forEach(opt => {
        const checked = answers[q.id] === opt ? "checked" : "";
        html += `
            <label>
                <input type="radio" name="${q.id}" value="${opt}" ${checked}>
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

    const anim = direction === "back" ? "fade-slide-back" : "fade-slide";

    form.innerHTML = `<div class="${anim}">${html}</div>`;
}

/* NAV */
function nextQuestion() {
    saveAnswer();
    currentQuestionIndex++;
    renderQuestion("next");
}

function prevQuestion() {
    saveAnswer();
    currentQuestionIndex--;
    renderQuestion("back");
}

/* GUARDAR */
function saveAnswer() {
    const q = questions[currentQuestionIndex];
    const sel = document.querySelector(`input[name="${q.id}"]:checked`);
    if (sel) answers[q.id] = sel.value;
}

/* RESUMEN */
function showSummary() {
    let html = `<h3>Confirmar respuestas</h3>`;

    questions.forEach(q => {
        html += `<p>${q.text}: ${answers[q.id] || "No respondida"}</p>`;
    });

    html += `<button type="button" onclick="submitQuiz()">Confirmar</button>`;

    document.getElementById("quizForm").innerHTML = html;
}

/* RESULTADO */
function submitQuiz() {
    let correct = 0;

    questions.forEach(q => {
        if (answers[q.id] === q.correct) correct++;
    });

    document.getElementById("scoreDisplay").innerText =
        `Resultado: ${correct}/5`;

    closeModal();
}

/* EVENTO BOTÓN */
document.addEventListener("DOMContentLoaded", () => {
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