document.addEventListener("DOMContentLoaded", function(){

const videoElement = document.querySelector('.input_video');
const canvasElement = document.querySelector('.output_canvas');
const canvasCtx = canvasElement.getContext('2d');

const resultadoDiv = document.getElementById("resultado");
const posiblesDiv = document.getElementById("posibles");
const manualesDiv = document.getElementById("manuales");
const noManualesDiv = document.getElementById("no-manuales");

const btnCamara = document.getElementById("btnCamara");
const btnAnalisis = document.getElementById("btnAnalisis");

// ✅ ESTADO INICIAL (CLAVE)
videoElement.style.display = "none";
canvasElement.style.display = "none";

canvasElement.width = 640;
canvasElement.height = 480;

let cameraOn = false;
let analyzing = false;

let previousRightHand = { current: null };
let previousLeftHand = { current: null };

// ================= FUNCIONES =================
function distance(a, b){
  return Math.sqrt(
    Math.pow(a.x - b.x, 2) +
    Math.pow(a.y - b.y, 2)
  );
}

// ================= MANOS =================
function analyzeHandAdvanced(handLandmarks, previousPositionRef){

  if(!handLandmarks) return null;

  const wrist = handLandmarks[0];
  const thumbTip = handLandmarks[4];
  const indexTip = handLandmarks[8];
  const middleTip = handLandmarks[12];
  const ringTip = handLandmarks[16];
  const pinkyTip = handLandmarks[20];

  function isFingerExtended(tip, base){
    return tip.y < base.y;
  }

  const thumbExtended = thumbTip.x > handLandmarks[3].x;
  const indexExtended = isFingerExtended(indexTip, handLandmarks[6]);
  const middleExtended = isFingerExtended(middleTip, handLandmarks[10]);
  const ringExtended = isFingerExtended(ringTip, handLandmarks[14]);
  const pinkyExtended = isFingerExtended(pinkyTip, handLandmarks[18]);

  let configuracion = "Desconocida";

  if(indexExtended && middleExtended && ringExtended && pinkyExtended && thumbExtended){
    configuracion = "Mano abierta";
  } else if(!indexExtended && !middleExtended && !ringExtended && !pinkyExtended && !thumbExtended){
    configuracion = "Puño cerrado";
  } else if(indexExtended && !middleExtended){
    configuracion = "Índice";
  }

  let orientacion = "Neutral";
  if(thumbTip.x < wrist.x) orientacion = "Palma izquierda";
  if(thumbTip.x > wrist.x) orientacion = "Palma derecha";

  let movimiento = "Quieto";
  if(previousPositionRef.current){
    const dx = wrist.x - previousPositionRef.current.x;
    const dy = wrist.y - previousPositionRef.current.y;

    if(Math.abs(dx) > 0.02 || Math.abs(dy) > 0.02){
      if(Math.abs(dx) > Math.abs(dy)){
        movimiento = dx > 0 ? "Movimiento derecha" : "Movimiento izquierda";
      } else {
        movimiento = dy > 0 ? "Movimiento abajo" : "Movimiento arriba";
      }
    }
  }

  previousPositionRef.current = {x: wrist.x, y: wrist.y};

  return { configuracion, orientacion, movimiento };
}

// ================= ROSTRO =================
function analyzeFaceAdvanced(faceLandmarks){

  if(!faceLandmarks) return null;

  const eyebrow = faceLandmarks[70];
  const eye = faceLandmarks[159];
  const eyebrowDist = Math.abs(eyebrow.y - eye.y);

  let cejas = "Neutras";
  if(eyebrowDist > 0.04) cejas = "Levantadas";
  if(eyebrowDist < 0.02) cejas = "Fruncidas";

  const upperLip = faceLandmarks[13];
  const lowerLip = faceLandmarks[14];
  const mouthDist = Math.abs(upperLip.y - lowerLip.y);

  let boca = "Cerrada";
  if(mouthDist > 0.03) boca = "Abierta";
  if(mouthDist > 0.06) boca = "Muy abierta";

  const mouthLeft = faceLandmarks[61];
  const mouthRight = faceLandmarks[291];
  const smileWidth = Math.abs(mouthLeft.x - mouthRight.x);
  if(smileWidth > 0.25) boca = "Sonriendo";

  const eyeTop = faceLandmarks[159];
  const eyeBottom = faceLandmarks[145];
  const eyeOpen = Math.abs(eyeTop.y - eyeBottom.y);

  let ojos = "Normales";
  if(eyeOpen < 0.01) ojos = "Cerrados";
  if(eyeOpen > 0.03) ojos = "Muy abiertos";

  const nose = faceLandmarks[1];
  const chin = faceLandmarks[152];

  let cabeza = "Recta";
  if(nose.x < chin.x - 0.02) cabeza = "Inclinada derecha";
  if(nose.x > chin.x + 0.02) cabeza = "Inclinada izquierda";

  return { cejas, boca, ojos, cabeza };
}

// ================= DISPLAY =================
function displayResults(rightHand, leftHand, face){

  resultadoDiv.innerHTML = `<strong>${rightHand?.configuracion || leftHand?.configuracion || "Sin detección"}</strong>`;

  posiblesDiv.innerHTML = `
    ${rightHand ? rightHand.configuracion : ""}
    ${leftHand ? "<br>" + leftHand.configuracion : ""}
  `;

  let manualHTML = "";

  if(rightHand){
    manualHTML += `✋ Derecha: ${rightHand.configuracion}<br>
    ${rightHand.orientacion}<br>
    ${rightHand.movimiento}<br><br>`;
  }

  if(leftHand){
    manualHTML += `🤚 Izquierda: ${leftHand.configuracion}<br>
    ${leftHand.orientacion}<br>
    ${leftHand.movimiento}`;
  }

  manualesDiv.innerHTML = manualHTML;

  if(face){
    noManualesDiv.innerHTML = `
      Cejas: ${face.cejas}<br>
      Boca: ${face.boca}<br>
      Ojos: ${face.ojos}<br>
      Cabeza: ${face.cabeza}
    `;
  } else {
    noManualesDiv.innerHTML = "Sin datos";
  }
}

// ================= MEDIAPIPE =================
const holistic = new Holistic({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`
});

holistic.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  refineFaceLandmarks: true,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
});

holistic.onResults((results) => {

  if(!analyzing) return;

  canvasCtx.clearRect(0,0,canvasElement.width,canvasElement.height);
  canvasCtx.drawImage(results.image,0,0,canvasElement.width,canvasElement.height);

  if(results.rightHandLandmarks){
  drawConnectors(
    canvasCtx,
    results.rightHandLandmarks,
    HAND_CONNECTIONS,
    { color: "#4FC3F7", lineWidth: 2 }
  );
}

if(results.leftHandLandmarks){
  drawConnectors(
    canvasCtx,
    results.leftHandLandmarks,
    HAND_CONNECTIONS,
    { color: "#4FC3F7", lineWidth: 2 }
  );
}

if(results.faceLandmarks){
  drawConnectors(
    canvasCtx,
    results.faceLandmarks,
    FACEMESH_TESSELATION,
    { color: "#81D4FA", lineWidth: 0.5 }
  );
}

  const rightHand = analyzeHandAdvanced(results.rightHandLandmarks, previousRightHand);
  const leftHand = analyzeHandAdvanced(results.leftHandLandmarks, previousLeftHand);
  const face = analyzeFaceAdvanced(results.faceLandmarks);

  displayResults(rightHand, leftHand, face);
});

// ================= CÁMARA =================
const camera = new Camera(videoElement,{
  onFrame: async () => {
    await holistic.send({image: videoElement});
  },
  width:640,
  height:480
});

// ================= BOTONES =================
btnCamara.addEventListener("click", () => {

  if(!cameraOn){

    videoElement.style.display = "block";

    camera.start();

    cameraOn = true;
    btnCamara.textContent = "Apagar cámara";
    btnAnalisis.disabled = false;

  }else{

    videoElement.style.display = "none";
    canvasElement.style.display = "none";

    camera.stop();

    cameraOn = false;
    analyzing = false;

    btnCamara.textContent = "Activar cámara";
    btnAnalisis.textContent = "Iniciar análisis";
    btnAnalisis.disabled = true;
  }
});

btnAnalisis.addEventListener("click", () => {

  if(!analyzing){

    analyzing = true;

    canvasElement.style.display = "block"; // 🔥 clave
    videoElement.style.display = "block";

    btnAnalisis.textContent = "Detener análisis";

  }else{

    analyzing = false;

    canvasElement.style.display = "none";

    btnAnalisis.textContent = "Iniciar análisis";
  }
});

});