const preguntas = [
    { pregunta: "1. ¿Cuál es el símbolo químico del Hierro?", opciones: ["Fe", "Hi", "Ir", "F"], correcta: 0 },
    { pregunta: "2. ¿Cuánto es 15 x 8?", opciones: ["110", "120", "125", "130"], correcta: 1 },
    { pregunta: "3. ¿Cuál es la fórmula del agua?", opciones: ["CO2", "H2O", "NaCl", "HO2"], correcta: 1 },
    { pregunta: "4. ¿Cuál es el valor aproximado de Pi (π)?", opciones: ["3.12", "3.1416", "3.16", "3.18"], correcta: 1 },
    { pregunta: "5. ¿Qué gas es vital para la respiración humana?", opciones: ["Nitrógeno", "Dióxido de carbono", "Oxígeno", "Helio"], correcta: 2 },
    { pregunta: "6. Si x + 5 = 12, ¿cuál es el valor de x?", opciones: ["5", "6", "7", "8"], correcta: 2 },
    { pregunta: "7. ¿Qué pH indica una sustancia neutra?", opciones: ["0", "7", "14", "1"], correcta: 1 },
    { pregunta: "8. ¿Cuál es la raíz cuadrada de 144?", opciones: ["10", "11", "12", "14"], correcta: 2 },
    { pregunta: "9. ¿Cuál es el elemento más abundante en la atmósfera?", opciones: ["Oxígeno", "Hidrógeno", "Nitrógeno", "Carbono"], correcta: 2 },
    { pregunta: "10. ¿Cuál es el área de un triángulo con base 10 y altura 6?", opciones: ["60", "30", "15", "40"], correcta: 1 },
    { pregunta: "11. ¿Qué tipo de enlace comparten electrones entre átomos?", opciones: ["Iónico", "Covalente", "Metálico", "Puente de hidrógeno"], correcta: 1 },
    { pregunta: "12. ¿Cuál es el resultado de 2^5 (2 elevado a la 5)?", opciones: ["10", "16", "32", "64"], correcta: 2 },
    { pregunta: "13. ¿Cuál es el símbolo químico del Oro?", opciones: ["Or", "Au", "Ag", "Go"], correcta: 1 },
    { pregunta: "14. ¿Cuál es la derivada de x^2 respecto a x?", opciones: ["x", "2x", "2", "x/2"], correcta: 1 },
    { pregunta: "15. ¿Cuál es el estado de la materia con volumen y forma definidos?", opciones: ["Líquido", "Gaseoso", "Sólido", "Plasma"], correcta: 2 },
    { pregunta: "16. ¿Cuántos grados suman los ángulos internos de un triángulo?", opciones: ["90°", "180°", "270°", "360°"], correcta: 1 },
    { pregunta: "17. ¿Qué partículas tienen carga negativa en el átomo?", opciones: ["Protones", "Neutrones", "Electrones", "Quarks"], correcta: 2 },
    { pregunta: "18. ¿Cuánto es log10(100)?", opciones: ["1", "2", "10", "100"], correcta: 1 },
    { pregunta: "19. ¿Cuál es el gas que producen las plantas durante la fotosíntesis?", opciones: ["Oxígeno", "CO2", "Metano", "Nitrógeno"], correcta: 0 },
    { pregunta: "20. ¿Cuál es el resultado de (3 + 5) x 4?", opciones: ["23", "28", "32", "35"], correcta: 2 }
];

let indicePregunta = 0;
let aciertos = 0;
let errores = 0;
const maxErrores = 3;
let nombreJugador = "";
let tiempoRestante = 60;
let temporizador;

function iniciarJuego() {
    let inputNombre = document.getElementById("nombre-jugador").value.trim();
    if (inputNombre === "") {
        alert("Por favor ingresa tu nombre para comenzar.");
        return;
    }
    nombreJugador = inputNombre;

    indicePregunta = 0;
    aciertos = 0;
    errores = 0;
    
    document.getElementById("pantalla-inicio").classList.add("oculto");
    document.getElementById("pantalla-final").classList.add("oculto");
    document.getElementById("pantalla-juego").classList.remove("oculto");
    
    actualizarPeligro();
    actualizarFondoYSala();
    iniciarTemporizadorSala();
    mostrarPregunta();
}

function iniciarTemporizadorSala() {
    clearInterval(temporizador);
    tiempoRestante = 60;
    document.getElementById("tiempo-restante").innerText = tiempoRestante + "s";

    temporizador = setInterval(() => {
        tiempoRestante--;
        document.getElementById("tiempo-restante").innerText = tiempoRestante + "s";
        if (tiempoRestante <= 0) {
            clearInterval(temporizador);
            perderJuego("¡Se agotó el tiempo de 1 minuto para esta sala!");
        }
    }, 1000);
}

function mostrarPregunta() {
    if (indicePregunta >= preguntas.length) {
        clearInterval(temporizador);
        ganarJuego();
        return;
    }

    let q = preguntas[indicePregunta];
    document.getElementById("texto-pregunta").innerText = q.pregunta;

    let contenedor = document.getElementById("contenedor-opciones");
    contenedor.innerHTML = "";

    q.opciones.forEach((opcion, index) => {
        let btn = document.createElement("button");
        btn.innerText = opcion;
        btn.className = "opcion-btn";
        btn.onclick = () => responder(index);
        contenedor.appendChild(btn);
    });
}

function responder(indiceSeleccionado) {
    let q = preguntas[indicePregunta];
    let salaAnterior = Math.floor(aciertos / 3) + 1;

    if (indiceSeleccionado === q.correcta) {
        aciertos++;
    } else {
        errores++;
        actualizarPeligro();
        if (errores >= maxErrores) {
            clearInterval(temporizador);
            perderJuego("El nivel de peligro alcanzó el máximo acumulado.");
            return;
        }
    }

    indicePregunta++;
    let salaNueva = Math.floor(aciertos / 3) + 1;

    // Reiniciar temporizador de 1 minuto solo al cambiar de sala
    if (salaNueva !== salaAnterior && salaNueva <= 7) {
        iniciarTemporizadorSala();
    }

    actualizarFondoYSala();
    mostrarPregunta();
}

function actualizarPeligro() {
    let porcentaje = Math.min((errores / maxErrores) * 100, 100);
    document.getElementById("nivel-peligro").innerText = Math.round(porcentaje) + "%";
    document.getElementById("indicador-peligro").style.width = porcentaje + "%";

    let opacidad = (errores / maxErrores) * 0.6;
    document.getElementById("alarma-overlay").style.background = `rgba(255, 0, 0, ${opacidad})`;
}

function actualizarFondoYSala() {
    let numeroSala = Math.floor(aciertos / 3) + 1;
    if (numeroSala > 7) numeroSala = 7;

    document.getElementById("numero-sala").innerText = "Sala " + numeroSala;
    let contenedor = document.getElementById("fondo-laboratorio");
    contenedor.className = "contenedor sala-" + numeroSala;
}

function guardarPuntaje(puntos) {
    let podio = JSON.parse(localStorage.getItem("podioFrida")) || [];
    podio.push({ nombre: nombreJugador, puntos: puntos });
    podio.sort((a, b) => b.puntos - a.puntos);
    podio = podio.slice(0, 3); // Mantener top 3
    localStorage.setItem("podioFrida", JSON.stringify(podio));
    mostrarPodio(podio);
}

function mostrarPodio(podio) {
    let lista = document.getElementById("lista-podio");
    lista.innerHTML = "";
    if (podio.length === 0) {
        lista.innerHTML = "<li>Sin registros aún</li>";
        return;
    }
    podio.forEach(jugador => {
        let li = document.createElement("li");
        li.innerText = `${jugador.nombre} - ${jugador.puntos} aciertos`;
        lista.appendChild(li);
    });
}

function ganarJuego() {
    document.getElementById("pantalla-juego").classList.add("oculto");
    document.getElementById("pantalla-final").classList.remove("oculto");
    
    document.getElementById("contenedor-img-final").innerHTML = '<img src="fridatraje.png" class="img-frida">';
    document.getElementById("titulo-final").innerText = "¡Misión Cumplida!";
    document.getElementById("mensaje-final").innerText = `¡Felicidades, ${nombreJugador}! Lograste superar todas las salas con ${aciertos} aciertos.`;

    guardarPuntaje(aciertos);
}

function perderJuego(motivo) {
    document.getElementById("pantalla-juego").classList.add("oculto");
    document.getElementById("pantalla-final").classList.remove("oculto");
    
    document.getElementById("contenedor-img-final").innerHTML = '<img src="fridaenojada.png.jpeg" class="img-frida">';
    document.getElementById("titulo-final").innerText = "¡Te has equivocado!";
    document.getElementById("mensaje-final").innerText = `${nombreJugador}, ${motivo} Lograste ${aciertos} aciertos.`;

    guardarPuntaje(aciertos);
}

function reiniciarJuego() {
    document.getElementById("alarma-overlay").style.background = "rgba(255, 0, 0, 0)";
    document.getElementById("nombre-jugador").value = "";
    document.getElementById("pantalla-final").classList.add("oculto");
    document.getElementById("pantalla-inicio").classList.remove("oculto");
}