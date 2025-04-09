// Variables globales para gestionar el estado del juego
let puntosJugador = 0; // Puntos acumulados por el jugador en la ronda actual
let puntosIA = 0; // Puntos acumulados por la IA en la ronda actual
let empates = 0; // Número de empates en la partida
let rondasTotales = 0; // Número total de rondas seleccionadas por el usuario
let rondasJugadas = 0; // Número de rondas jugadas hasta el momento
let rondasGanadasJugador = 0; // Número de rondas ganadas por el jugador
let rondasGanadasIA = 0; // Número de rondas ganadas por la IA
let juegoIniciado = false; // Estado del juego (true si está en curso)
let tiradasActuales = 0; // Número de tiradas realizadas en la ronda actual

/**
 * Gestiona la elección del jugador y determina el resultado de la tirada.
 * @param {string} eleccJugador - La elección del jugador ('piedra', 'papel' o 'tijera').
 */
function eleccJugador(eleccJugador) {
    if (!juegoIniciado) {
        mostrarPanelAlerta('Debe iniciar una partida antes de seleccionar una opción.');
        return;
    }

    const opciones = ['piedra', 'papel', 'tijera'];
    const eleccionIA = opciones[Math.floor(Math.random() * opciones.length)];

    const eleccionIAElemento = document.getElementById('eleccionIA');
    eleccionIAElemento.textContent = `${eleccionIA}`;

    const resultado = determinarGanador(eleccJugador, eleccionIA);

    if (resultado !== 'Es un empate!') {
        tiradasActuales++;
    }

    actualizarMarcadorTiradas();

    if (tiradasActuales === 4 && puntosJugador === puntosIA) {
        mostrarPanelAlerta('¡Empate en la ronda! La siguiente tirada será decisiva.');
        return;
    }

    if (tiradasActuales === 5) {
        if (puntosJugador > puntosIA) {
            rondasGanadasJugador++;
        } else if (puntosIA > puntosJugador) {
            rondasGanadasIA++;
        }

        rondasJugadas++;
        actualizarMarcadorRondas();

        reiniciarPuntos();
        tiradasActuales = 0;

        if (rondasJugadas == rondasTotales) {
            if (rondasGanadasJugador === rondasGanadasIA) {
                mostrarPanelAlerta('¡Empate en las rondas! Se jugará una ronda de desempate al mejor de 5.');
                rondasTotales++;
                actualizarMarcadorDesempate('Ronda de desempate');
            } else {
                finalizarJuego();
            }
        } else {
            mostrarPanelAlerta('¡Ronda terminada! Prepárate para la siguiente ronda.');
        }
    }
}

/**
 * Determina el ganador de una tirada entre el jugador y la IA.
 * @param {string} eleccJugador - Elección del jugador.
 * @param {string} eleccionIA - Elección de la IA.
 * @returns {string} - Resultado de la tirada ('¡Ganaste!', '¡Perdiste!' o 'Es un empate!').
 */
function determinarGanador(eleccJugador, eleccionIA) {
    if (eleccJugador === eleccionIA) {
        const empatesElemento = document.getElementById('empates');
        empates++;
        empatesElemento.textContent = `Empates: ${empates}`;
        return 'Es un empate!';
    } else if (
        (eleccJugador === 'piedra' && eleccionIA === 'tijera') ||
        (eleccJugador === 'papel' && eleccionIA === 'piedra') ||
        (eleccJugador === 'tijera' && eleccionIA === 'papel')
    ) {
        puntosJugador++;
        const puntosJugadorElemento = document.getElementById('puntosJugador');
        puntosJugadorElemento.textContent = `Tus Puntos: ${puntosJugador}`;
        return '¡Ganaste!';
    } else {
        puntosIA++;
        const puntosIAElemento = document.getElementById('puntosIA');
        puntosIAElemento.textContent = `Puntos IA: ${puntosIA}`;
        return '¡Perdiste!';
    }
}

/**
 * Reinicia el estado del juego y actualiza los elementos del DOM.
 */
function eliminarJuego() {
    puntosJugador = 0;
    puntosIA = 0;
    empates = 0;
    rondasTotales = 0;
    rondasJugadas = 0;
    rondasGanadasJugador = 0;
    rondasGanadasIA = 0;
    tiradasActuales = 0;

    const puntosJugadorElemento = document.getElementById('puntosJugador');
    const puntosIAElemento = document.getElementById('puntosIA');
    const empatesElemento = document.getElementById('empates');
    const eleccionIAElemento = document.getElementById('eleccionIA');
    const rondasJugadasTotalesElemento = document.getElementById('rondasJugadasTotales');
    const rondasGanadasJugadorElemento = document.getElementById('rondasGanadasJugador');
    const rondasGanadasIAElemento = document.getElementById('rondasGanadasIA');
    const tiempoElemento = document.getElementById('tiempo');

    if (puntosJugadorElemento) puntosJugadorElemento.textContent = 'Tus Puntos: ';
    if (puntosIAElemento) puntosIAElemento.textContent = 'Puntos IA: ';
    if (empatesElemento) empatesElemento.textContent = 'Empates: ';
    if (eleccionIAElemento) eleccionIAElemento.textContent = '';
    if (rondasJugadasTotalesElemento) rondasJugadasTotalesElemento.textContent = 'Rondas Jugadas: ';
    if (rondasGanadasJugadorElemento) rondasGanadasJugadorElemento.textContent = 'Rondas Ganadas (Jugador): ';
    if (rondasGanadasIAElemento) rondasGanadasIAElemento.textContent = 'Rondas Ganadas (IA): ';
    if (tiempoElemento) tiempoElemento.textContent = '';

    if (tiempoElemento && tiempoElemento.dataset.intervaloId) {
        clearInterval(tiempoElemento.dataset.intervaloId);
        delete tiempoElemento.dataset.intervaloId;
    }

    const panelDetener = document.getElementById('panelMensaje');
    if (panelDetener) panelDetener.style.display = 'none';

    mostrarPanelAlerta('¡La partida ha sido eliminada! Puedes iniciar una nueva partida más tarde.');
    juegoIniciado = false;
}

/**
 * Inicia una nueva partida mostrando el panel de selección de rondas.
 */
function iniciarJuego() {
    if (juegoIniciado) {
        mostrarPanelAlerta('Ya hay una partida en curso. Por favor, termina o elimina la partida actual antes de iniciar una nueva.');
        return;
    }

    const panelRondas = document.getElementById('panelRondas');
    panelRondas.style.display = 'flex';
}

/**
 * Confirma el número de rondas seleccionadas y comienza el juego.
 */
function confirmarRondas() {
    const selectRondas = document.getElementById('numeroRondas');
    rondasTotales = parseInt(selectRondas.value);
    rondasJugadas = 0;
    rondasGanadasJugador = 0;
    rondasGanadasIA = 0;

    actualizarMarcadorRondas();

    const panelRondas = document.getElementById('panelRondas');
    panelRondas.style.display = 'none';

    mostrarPanelAlerta(`¡El juego ha comenzado! Jugarás ${rondasTotales} rondas.`);

    const tiempoElemento = document.getElementById('tiempo');
    let tiempo = 0;

    if (tiempoElemento.dataset.intervaloId) {
        clearInterval(tiempoElemento.dataset.intervaloId);
    }

    const intervaloTiempo = setInterval(() => {
        tiempo++;
        tiempoElemento.textContent = ` ${tiempo}s`;
    }, 1000);

    tiempoElemento.dataset.intervaloId = intervaloTiempo;

    juegoIniciado = true;
}

/**
 * Detiene el juego actual y muestra el panel de pausa.
 */
function detenerJuego() {
    if (!juegoIniciado) {
        mostrarPanelAlerta('Debe haber una partida iniciada para detener el juego.');
        return;
    }

    const tiempoElemento = document.getElementById('tiempo');

    if (tiempoElemento.dataset.intervaloId) {
        clearInterval(tiempoElemento.dataset.intervaloId);
        delete tiempoElemento.dataset.intervaloId;
    }

    const panel = document.getElementById('panelMensaje');
    panel.style.display = 'flex';
}

/**
 * Continúa el juego después de haber sido detenido.
 */
function continuarJuego() {
    const panel = document.getElementById('panelMensaje');
    panel.style.display = 'none';

    const tiempoElemento = document.getElementById('tiempo');
    let tiempo = parseInt(tiempoElemento.textContent.replace(' ', '').replace('s', '').trim());

    if (isNaN(tiempo)) {
        tiempo = 0;
    }

    const intervaloTiempo = setInterval(() => {
        tiempo++;
        tiempoElemento.textContent = `${tiempo}s`;
    }, 1000);
    tiempoElemento.dataset.intervaloId = intervaloTiempo;
}

/**
 * Muestra un panel con un mensaje personalizado.
 * @param {string} mensaje - Mensaje a mostrar en el panel.
 */
function mostrarPanelAlerta(mensaje) {
    const panel = document.getElementById('panelAlerta');
    const mensajeElemento = document.getElementById('mensajeAlerta');
    mensajeElemento.textContent = mensaje;
    panel.style.display = 'flex';
}

/**
 * Cierra el panel de alerta.
 */
function cerrarPanelAlerta() {
    const panel = document.getElementById('panelAlerta');
    panel.style.display = 'none';
}

/**
 * Actualiza el marcador de rondas en el DOM.
 */
function actualizarMarcadorRondas() {
    const rondasGanadasJugadorElemento = document.getElementById('rondasGanadasJugador');
    const rondasJugadasTotalesElemento = document.getElementById('rondasJugadasTotales');
    const rondasGanadasIAElemento = document.getElementById('rondasGanadasIA');

    rondasGanadasJugadorElemento.textContent = `Rondas Ganadas (Jugador): ${rondasGanadasJugador}`;
    rondasJugadasTotalesElemento.textContent = `Rondas Jugadas: ${rondasJugadas}/${rondasTotales}`;
    rondasGanadasIAElemento.textContent = `Rondas Ganadas (IA): ${rondasGanadasIA}`;
}

/**
 * Actualiza el marcador de desempate en el DOM.
 * @param {string} texto - Texto a mostrar en el marcador.
 */
function actualizarMarcadorDesempate(texto) {
    const rondasJugadasTotalesElemento = document.getElementById('rondasJugadasTotales');
    rondasJugadasTotalesElemento.textContent = texto;
}

/**
 * Finaliza el juego y muestra el resultado final.
 */
function finalizarJuego() {
    let mensajeFinal = '¡El juego ha terminado! ';

    if (rondasGanadasJugador > rondasGanadasIA) {
        mensajeFinal += '¡Felicidades, ganaste!';
    } else if (rondasGanadasJugador < rondasGanadasIA) {
        mensajeFinal += 'La IA ganó. ¡Mejor suerte la próxima vez!';
    } else {
        mensajeFinal += 'Es un empate.';
    }

    mostrarPanelAlerta(mensajeFinal);

    reiniciarPuntos();

    const tiempoElemento = document.getElementById('tiempo');
    if (tiempoElemento && tiempoElemento.dataset.intervaloId) {
        clearInterval(tiempoElemento.dataset.intervaloId);
        delete tiempoElemento.dataset.intervaloId;
    }

    juegoIniciado = false;
}

/**
 * Actualiza el marcador de tiradas en el DOM.
 */
function actualizarMarcadorTiradas() {
    const puntosJugadorElemento = document.getElementById('puntosJugador');
    const puntosIAElemento = document.getElementById('puntosIA');
    const empatesElemento = document.getElementById('empates');

    puntosJugadorElemento.textContent = `Tus Puntos: ${puntosJugador}`;
    puntosIAElemento.textContent = `Puntos IA: ${puntosIA}`;
    empatesElemento.textContent = `Empates: ${empates}`;
}

/**
 * Reinicia los puntos de la ronda actual.
 */
function reiniciarPuntos() {
    puntosJugador = 0;
    puntosIA = 0;
    empates = 0;

    const puntosJugadorElemento = document.getElementById('puntosJugador');
    const puntosIAElemento = document.getElementById('puntosIA');
    const empatesElemento = document.getElementById('empates');

    if (puntosJugadorElemento) puntosJugadorElemento.textContent = 'Tus Puntos: 0';
    if (puntosIAElemento) puntosIAElemento.textContent = 'Puntos IA: 0';
    if (empatesElemento) empatesElemento.textContent = 'Empates: 0';
}