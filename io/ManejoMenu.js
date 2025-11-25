import {Tarea} from '../src/Tarea.js'
import { DIFICULTADES } from '../utils/constantes.js';
// FUnciones de feedback para el usuario
/**@param {string} message */

const EMOJIS_DIFICULTAD = {
    [DIFICULTADES.FACIL]: '🟢 (Facil)',
    [DIFICULTADES.MEDIA]: '🟡 (Media)',
    [DIFICULTADES.DIFICIL]: '🔴 (Dificil)',
}

export const logSuccess = (message) =>{
    console.log(`✅ ${message}`);
}
/**@param {string} message */
export const logError = (message) =>{
    console.log(`❌ ${message}`);
}
/**@param {string} message */
export const logInfo = (message) =>{
    console.log(`ℹ️ ${message}`)
}

//Funciones de visualizacion 
export const displayMenu = () =>{
    console.clear();
    console.log("======================================");
    console.log("   Gestor de Tareas (Multi-Paradigma) ");
    console.log("======================================");
    console.log("1. Crear Tarea");
    console.log("2. Listar Tareas en detalle");
    console.log("3. Actualizar Tarea");
    console.log("4. Eliminar Tarea");
    console.log("5. Buscar u Ordenar Tareas");
    console.log("6. Ver Reportes y Estadísticas");
    console.log("0. Salir");
    console.log("--------------------------------------");
}

//Listar tareas de forma resumida
/** @param {Array<Tarea>} tasks */
export const displayTaskList = (tasks) =>{
    if (tasks.length === 0){
        console.log("No hay tareas para mostrar");
        return;
    }
    //busca 1x1 y muestra
    tasks.forEach((task) =>{
        const vencimiento = task.estaVencida() ? `(TAREA VENCIDA)` : '';
        //padEnd & padFirst sirve para rellenar el string con caracteres del tamaño seteado 
        const estado = `[${task.estado}]`.padEnd(12);
        const difTexto = EMOJIS_DIFICULTAD[task.dificultad] || `[${task.dificultad}]`;
        console.log(`\n${estado} \n${difTexto} \n${task.titulo} \n${vencimiento}`);
        console.log(`\n ID = ${task.id}`)
    });
};

//Muestra todos los detalles de la tarea seleccionada, solo 1
/**@param {Tarea} Task */
export const displayTaskDetails = (task) => {
    console.log("\n--- Detalles de la Tarea ---");
    console.log(`  ID:           ${task.id}`);
    console.log(`  Título:       ${task.titulo}`);
    console.log(`  Descripción:  ${task.descripcion || '(Sin descripción)'}`);
    console.log(`  Estado:       ${task.estado}`);
    console.log(`  Dificultad:   ${task.dificultad}`);
    console.log(`  Creación:     ${task.creacion.toISOString()}`);
    console.log(`  Últ. Edición: ${task.ultimaEdicion.toISOString()}`);
    console.log(`  Vencimiento:  ${task.vencimiento ? task.vencimiento.toISOString() : '(Sin fecha)'}`);
    console.log(`  ¿Vencida?:    ${task.estaVencida() ? 'Sí' : 'No'}`);
    console.log(`  ¿Eliminada?:  ${task.eliminado ? 'Sí' : 'No'}`); // Usamos la propiedad 'eliminado' por si hay un soft delete sobre esa tarea
    console.log("------------------------------");
}

//reportes de estadisticas
/** @param {object} stats */
export const displayStatistics = (stats) =>{
    console.log("--- Estadisticas de tareas ---");
    console.log(`Total de tareas activas: ${stats.total}\n`);
    if (stats.total > 0) {
        console.log("Tareas por estado: ");
    
        Object.entries(stats.porEstado).forEach(([estado, data]) =>{
            console.log(` - ${estado}: ${data.cantidad} (${data.porcentaje}%)`);
        });

        console.log("\nTareas por dificultad: ");
        Object.entries(stats.porDificultad).forEach(([dificultad, data]) =>{
            const label = EMOJIS_DIFICULTAD[dificultad] || dificultad;
            console.log(` - ${label}: ${data.cantidad} (${data.porcentaje}%)`);
        });
    } else {
        console.log("No hay tareas para mostrar estadísticas.");
    }
}