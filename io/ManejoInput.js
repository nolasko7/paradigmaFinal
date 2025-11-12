import promptSync from 'prompt-sync';
import { ESTADOS, DIFICULTADES, getHoy } from '../utils/constantes.js';
import { Tarea } from '../src/Tarea.js'; // Para JSDoc

const prompt = promptSync({ sigint: true });

// pide un string no vacio para poder empezar a trabajar
/**
 * @param {string} mensaje 
 * @param {number} [max=100]
 * @returns {string | null} El string, o null si se cancela.
 */
const _solicitarStringNoVacio = (mensaje, max = 100) => {
    let valor;
    do {
        valor = prompt(mensaje);
        if (valor === null){
            return null; // El usuario presiono Ctrl+C
        }
        if (valor.trim().length === 0) {
            console.log("❌ Error: La entrada no puede estar vacía.");
        } else if (valor.length > max) {
            console.log(`❌ Error: La entrada no puede exceder los ${max} caracteres.`);
        }
    } while (valor.trim().length === 0 || valor.length > max);
    return valor.trim();
};

// pide un string opcional.
/**
 * @param {string} mensaje 
 * @param {number} [max=500]
 * @returns {string | null} El string, o null si se cancela.
 */
const _solicitarStringOpcional = (mensaje, max = 500) => {
    let valor;
    do {
        valor = prompt(mensaje);
        if (valor === null) {
            return null;
        }
        if (valor.length > max) {
            console.log(`❌ Error: La entrada no puede exceder los ${max} caracteres.`);
        }
    } while (valor.length > max);
    return valor;
};
//pide y valida una fecha de vencimiento
/**
 * @param {string} mensaje
 * @param {boolean} [opcional=false]
 * @returns {Date | null | undefined | string}
 */
export const solicitarVencimiento = (mensaje, opcional = false) =>{
    const regexFecha =  /^\d{4}-\d{2}-\d{2}$/; //^ → inicio de la cadena \d{4} → 4 dígitos (año) - → un guion literal \d{2} → 2 dígitos (mes) - → otro guion \d{2} → 2 dígitos (día) $ → fin de la cadena
    const hoy = new Date(getHoy());

    let input;
    while(true){
        input = prompt(mensaje);

        if (input === null){ //cancelar
            return null;
        }
        
        if (opcional && input === '') { //Omitir
            return undefined
        }

        if (opcional && input.toLowerCase() === 'borrar'){ //eliminar fecha
            return 'BORRAR';
        }

        if (!regexFecha.test(input)){
            console.log("Error, ese no es el formato correcto, usa AAAA-MM-DD");
            continue;
        }

        const fechaInput = new Date(input);  

        if(isNaN(fechaInput.getTime())){//fecha invalida con respecto al mes por ej 
            console.log("Error, fecha invalida");
        }

        if (fechaInput < hoy){
            console.log("Error, la fecha de vencimiento no puede estar en pasado");
            continue;
        }
        // Si la fecha es valida, se devuelve el objeto DATE
        return fechaInput
    }
};


// solicita las propiedades para crear una nueva Tarea.
/**
 * 
 * @returns {object | null} Un objeto de props, o null si se cancela.
 */
export const solicitarPropsCreacion = () => {
    console.clear();
    console.log("--- 1. Nueva Tarea ---");
    
    const titulo = _solicitarStringNoVacio("Título (max 100): ");
    
    if (titulo === null){
        return null;
    }
    
    const descripcion = _solicitarStringOpcional("Descripcion (opcional, max 500): ");
    
    if (descripcion === null){
        return null;
    }
    const props = { titulo, descripcion };
    
    const dificultad = solicitarDificultad("Dificultad (Opcional, Enter para 'Facil'): ", DIFICULTADES.FACIL, true);
    if (dificultad === null) return null; // Cancelar
    if (dificultad) props.dificultad = dificultad;

    const vencimiento = solicitarVencimiento("Vencimiento (AAAA-MM-DD, opcional, Enter para omitir");
    if (vencimiento === null){
        return null;
    }

    if (vencimiento){
        props.vencimiento = vencimiento;
    }
    return props;
};

/**
 * Pide al usuario que seleccione una tarea de una lista.
 * @param {Array<Tarea>} lista - La lista de tareas para elegir.
 * @param {string} accion - El verbo (ej: "modificar", "eliminar").
 * @returns {Tarea | null} La tarea seleccionada, o null si se cancela.
 */
export const seleccionarTareaDeLista = (lista, accion) => {
    if (lista.length === 0) {
        console.log("❌ No se encontraron tareas que coincidan.");
        return null;
    }

    if (lista.length === 1) {
        console.log(`ℹ️ Se encontro 1 tarea: ${lista[0].titulo}`);
        return lista[0];
    }

    console.log(`ℹ️ Se encontraron ${lista.length} tareas. Cual desea ${accion}?`);
    lista.forEach((tarea, index) => {
        console.log(`  [${index + 1}] ${tarea.titulo} [${tarea.estado}]`);
    });

    let eleccion;
    do {
        const input = prompt(`Seleccione un número (1-${lista.length}) o 0 para cancelar: `);
        if (input === null) return null;
        if (input === '0') return null;
        
        eleccion = parseInt(input);
        
    } while (isNaN(eleccion) || eleccion < 1 || eleccion > lista.length);
    
    return lista[eleccion - 1];
};

/**
 * Pide al usuario los campos para modificar una tarea.
 * @param {Tarea} tarea - La tarea que se esta modificando.
 * @returns {object | null} Un objeto con los cambios, o null si no se cambio nada.
 */
export const solicitarPropsModificacion = (tarea) => {
    console.clear();
    console.log("--- 3. Modificar Tarea ---");
    console.log("(Deje en blanco para no cambiar el valor)");

    const cambios = {};

    // 1. Título
    const titulo = _solicitarStringOpcional(`Título [${tarea.titulo}]: `, 100);
    if (titulo === null) return null; // Cancelar
    if (titulo) cambios.titulo = titulo;

    // 2. Descripcion
    const desc = _solicitarStringOpcional(`Descripcion [${tarea.descripcion || 'N/A'}]: `, 500);
    if (desc === null) return null;
    if (desc) cambios.descripcion = desc;

    // 3. Estado
    const estado = solicitarEstado(`Estado [${tarea.estado}]: `, tarea.estado, true);
    if (estado === null) return null;
    if (estado) cambios.estado = estado;

    // 4. Dificultad
    const dificultad = solicitarDificultad(`Dificultad [${tarea.dificultad}]: `, tarea.dificultad, true);
    if (dificultad === null) return null;
    if (dificultad) cambios.dificultad = dificultad;

    if (Object.keys(cambios).length === 0) {
        return null; // No hubo cambios
    }
    return cambios;
};

/**
 * Pide un término de búsqueda al usuario.
 * @returns {string} (Vacío si no se ingresa nada)
 */
export const solicitarTerminoBusqueda = () => {
    const termino = prompt("Ingrese término de búsqueda (Enter para ver todas): ");
    return termino === null ? '' : termino.trim();
};

/**
 * Pide un criterio de orden al usuario.
 * @returns {string | null}
 */
export const solicitarCriterioOrden = () => {
    console.log("\nComo desea ordenar las tareas?");
    console.log("  [1] Por Título (A-Z)");
    console.log("  [2] Por Fecha de Creacion (Mas antiguas primero)");
    console.log("  [3] Por Fecha de Vencimiento");
    console.log("  [4] Por Dificultad (Facil > Difícil)");
    console.log("  [Enter] Sin orden específico");
    
    const input = prompt("Seleccione una opcion: ");
    if (input === null) return null;
    switch(input) {
        case '1': return 'titulo';
        case '2': return 'creacion';
        case '3': return 'vencimiento';
        case '4': return 'dificultad';
        default: return null;
    }
};

/**
 * Pide un estado al usuario (para modificar).
 * @param {string} mensaje - El mensaje del prompt.
 * @param {string} [defaultVal] - Valor por defecto.
 * @param {boolean} [opcional=false] - Si es true, Enter no cambia el valor.
 * @returns {string | undefined} El estado seleccionado, o undefined si no se cambia.
 */
export const solicitarEstado = (mensaje, defaultVal, opcional = false) => {
    console.log(mensaje);
    console.log(`  [1] ${ESTADOS.PENDIENTE}`);
    console.log(`  [2] ${ESTADOS.EN_CURSO}`);
    console.log(`  [3] ${ESTADOS.TERMINADA}`);
    console.log(`  [4] ${ESTADOS.CANCELADA}`);
    if (opcional) console.log("  [Enter] No cambiar");
    
    const input = prompt("Seleccione: ");
    if (input === null) return null; // Cancelar
    if (opcional && input === '') return undefined;

    switch(input) {
        case '1': return ESTADOS.PENDIENTE;
        case '2': return ESTADOS.EN_CURSO;
        case '3': return ESTADOS.TERMINADA;
        case '4': return ESTADOS.CANCELADA;
        default: return defaultVal || ESTADOS.PENDIENTE; // Default si es obligatorio
    }
};

/**
 * Pide una dificultad al usuario.
 * @param {string} mensaje - El mensaje del prompt.
 * @param {string} [defaultVal] - Valor por defecto.
 * @param {boolean} [opcional=false] - Si es true, Enter no cambia el valor.
 * @returns {string | undefined} La dificultad seleccionada, o undefined si no se cambia.
 */
export const solicitarDificultad = (mensaje, defaultVal, opcional = false) => {
    console.log(mensaje);
    console.log(`  [1] ${DIFICULTADES.FACIL}`);
    console.log(`  [2] ${DIFICULTADES.MEDIA}`);
    console.log(`  [3] ${DIFICULTADES.DIFICIL}`);  
    if (opcional) console.log("  [Enter] No cambiar");
    
    const input = prompt("Seleccione: ");
    if (input === null) return null; // Cancelar
    if (opcional && input === '') return undefined;

    switch(input) {
        case '1': return DIFICULTADES.FACIL;
        case '2': return DIFICULTADES.MEDIA;
        case '3': return DIFICULTADES.DIFiCIL;
        default: return defaultVal || DIFICULTADES.FACIL;
    }
};

/**
 * Pide al usuario que presione Enter para continuar.
 * (Funcion impura de I/O)
 */
export const pressEnterToContinue = () => {
    prompt("\nPresione ENTER para volver al menú...");
};

/**
 * Pide una opcion del menú principal.
 * @returns {string}
 */
export const solicitarOpcionMenu = () => {
    const opcion = prompt("Selecciona una opcion: ");
    return opcion === null ? '0' : opcion; // Salir si presiona Ctrl+C
};