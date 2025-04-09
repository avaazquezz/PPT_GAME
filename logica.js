let puntosJugador = 0;
let puntosIA = 0;
let empates = 0;
let rondasTotales = 0;
let rondasJugadas = 0;
let rondasGanadasJugador = 0;
let rondasGanadasIA = 0;
let juegoIniciado = false;
let tiradasActuales = 0;

function eleccJugador(eleccJugador) {
    if (!juegoIniciado) {
        mostrarPanelAlerta('Debe iniciar una partida antes de seleccionar una opción.');
        return;
    }

    // Opciones posibles
    const opciones = ['piedra', 'papel', 'tijera'];
    const eleccionIA = opciones[Math.floor(Math.random() * opciones.length)];

    // Mostrar elección de la IA
    const eleccionIAElemento = document.getElementById('eleccionIA');
    eleccionIAElemento.textContent = `${eleccionIA}`;

    // Determinar el ganador de la tirada
    const resultado = determinarGanador(eleccJugador, eleccionIA);

    // Solo incrementar tiradas si no es empate
    if (resultado !== 'Es un empate!') {
        tiradasActuales++;
    }

    // Actualizar el marcador de tiradas
    actualizarMarcadorTiradas();

    // Verificar si se han hecho 4 tiradas y están empatados
    if (tiradasActuales === 4 && puntosJugador === puntosIA) {
        mostrarPanelAlerta('¡Empate en la ronda! La siguiente tirada será decisiva.');
        return; // Detener aquí para esperar la tirada decisiva
    }

    // Verificar si se han completado las 5 tiradas de la ronda
    if (tiradasActuales === 5) {
        // Determinar quién ganó la ronda
        if (puntosJugador > puntosIA) {
            rondasGanadasJugador++;
        } else if (puntosIA > puntosJugador) {
            rondasGanadasIA++;
        }

        // Actualizar el marcador de rondas
        rondasJugadas++;
        actualizarMarcadorRondas();

        // Reiniciar los contadores de tiradas y puntos
        reiniciarPuntos();
        tiradasActuales = 0;

        // Verificar si se han jugado todas las rondas
        if (rondasJugadas == rondasTotales) {
            if (rondasGanadasJugador === rondasGanadasIA) {
                // Mostrar panel de ronda de desempate
                mostrarPanelAlerta('¡Empate en las rondas! Se jugará una ronda de desempate al mejor de 5.');
                rondasTotales++; // Agregar una ronda adicional
                actualizarMarcadorDesempate('Ronda de desempate');
            } else {
                finalizarJuego();
            }
        } else {
            mostrarPanelAlerta('¡Ronda terminada! Prepárate para la siguiente ronda.');
        }
    }
}

function determinarGanador(eleccJugador, eleccionIA) {
    if (eleccJugador === eleccionIA) {
        // Si ambos eligen lo mismo, es empate
        const empatesElemento = document.getElementById('empates');
        empates++;
        empatesElemento.textContent = `Empates: ${empates}`;
        return 'Es un empate!';
    } else if (
        (eleccJugador === 'piedra' && eleccionIA === 'tijera') ||
        (eleccJugador === 'papel' && eleccionIA === 'piedra') ||
        (eleccJugador === 'tijera' && eleccionIA === 'papel')
    ) {
        // Incrementar puntos del jugador
        puntosJugador++;
        const puntosJugadorElemento = document.getElementById('puntosJugador');
        puntosJugadorElemento.textContent = `Tus Puntos: ${puntosJugador}`;
        return '¡Ganaste!';
    } else {
        // Incrementar puntos de la IA
        puntosIA++;
        const puntosIAElemento = document.getElementById('puntosIA');
        puntosIAElemento.textContent = `Puntos IA: ${puntosIA}`;
        return '¡Perdiste!';
    }
}

function eliminarJuego() {
    // Reiniciar las variables globales
    puntosJugador = 0;
    puntosIA = 0;
    empates = 0;
    rondasTotales = 0;
    rondasJugadas = 0;
    rondasGanadasJugador = 0;
    rondasGanadasIA = 0;
    tiradasActuales = 0;

    // Reiniciar el contenido HTML
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

    // Detener el contador de tiempo si está activo
    if (tiempoElemento && tiempoElemento.dataset.intervaloId) {
        clearInterval(tiempoElemento.dataset.intervaloId);
        delete tiempoElemento.dataset.intervaloId;
    }

    // Ocultar el panel de detener juego
    const panelDetener = document.getElementById('panelMensaje');
    if (panelDetener) panelDetener.style.display = 'none';

    // Mostrar el panel de partida eliminada
    mostrarPanelAlerta('¡La partida ha sido eliminada! Puedes iniciar una nueva partida más tarde.');

    // Cambiar el estado del juego a no iniciado
    juegoIniciado = false;
}

function iniciarJuego() {

    if (juegoIniciado) {
        mostrarPanelAlerta('Ya hay una partida en curso. Por favor, termina o elimina la partida actual antes de iniciar una nueva.');
        return;
    }

    // Mostrar el panel para seleccionar el número de rondas
    const panelRondas = document.getElementById('panelRondas');
    panelRondas.style.display = 'flex';
}

function confirmarRondas() {
    const selectRondas = document.getElementById('numeroRondas');
    rondasTotales = parseInt(selectRondas.value);
    rondasJugadas = 0;
    rondasGanadasJugador = 0;
    rondasGanadasIA = 0;

    // Actualizar el marcador de rondas
    actualizarMarcadorRondas();

    const panelRondas = document.getElementById('panelRondas');
    panelRondas.style.display = 'none';


    mostrarPanelAlerta(`¡El juego ha comenzado! Jugarás ${rondasTotales} rondas.`);

    // Iniciar el contador de tiempo
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

    // Cambiar el estado del juego a iniciado
    juegoIniciado = true;
}

function detenerJuego() {
    if (!juegoIniciado) {
        mostrarPanelAlerta('Debe haber una partida iniciada para detener el juego.');
        return;
    }

    const tiempoElemento = document.getElementById('tiempo');

    // Detener el contador de tiempo si está activo
    if (tiempoElemento.dataset.intervaloId) {
        clearInterval(tiempoElemento.dataset.intervaloId);
        delete tiempoElemento.dataset.intervaloId;
    }

    // Mostrar el panel de mensaje en el HTML
    const panel = document.getElementById('panelMensaje');
    panel.style.display = 'flex';
}

function continuarJuego() {
    const panel = document.getElementById('panelMensaje');
    panel.style.display = 'none';

    // Reanudar el contador de tiempo
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

// Función para mostrar el panel con un mensaje
function mostrarPanelAlerta(mensaje) {
    const panel = document.getElementById('panelAlerta');
    const mensajeElemento = document.getElementById('mensajeAlerta');
    mensajeElemento.textContent = mensaje;
    panel.style.display = 'flex';
}

// Función para cerrar el panel
function cerrarPanelAlerta() {
    const panel = document.getElementById('panelAlerta');
    panel.style.display = 'none';
}

function actualizarMarcadorRondas() {
    const rondasGanadasJugadorElemento = document.getElementById('rondasGanadasJugador');
    const rondasJugadasTotalesElemento = document.getElementById('rondasJugadasTotales');
    const rondasGanadasIAElemento = document.getElementById('rondasGanadasIA');

    rondasGanadasJugadorElemento.textContent = `Rondas Ganadas (Jugador): ${rondasGanadasJugador}`;
    rondasJugadasTotalesElemento.textContent = `Rondas Jugadas: ${rondasJugadas}/${rondasTotales}`;
    rondasGanadasIAElemento.textContent = `Rondas Ganadas (IA): ${rondasGanadasIA}`;
}

function actualizarMarcadorDesempate(texto) {
    const rondasJugadasTotalesElemento = document.getElementById('rondasJugadasTotales');
    rondasJugadasTotalesElemento.textContent = texto;
}

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

    // Reiniciar los valores de puntos
    reiniciarPuntos();

    // Detener el contador de tiempo
    const tiempoElemento = document.getElementById('tiempo');
    if (tiempoElemento && tiempoElemento.dataset.intervaloId) {
        clearInterval(tiempoElemento.dataset.intervaloId);
        delete tiempoElemento.dataset.intervaloId;
    }

    // Reiniciar el estado del juego
    juegoIniciado = false;
}

function actualizarMarcadorTiradas() {
    const puntosJugadorElemento = document.getElementById('puntosJugador');
    const puntosIAElemento = document.getElementById('puntosIA');
    const empatesElemento = document.getElementById('empates');

    puntosJugadorElemento.textContent = `Tus Puntos: ${puntosJugador}`;
    puntosIAElemento.textContent = `Puntos IA: ${puntosIA}`;
    empatesElemento.textContent = `Empates: ${empates}`;
}

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