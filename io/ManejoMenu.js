import {Tarea} from '../src/Tarea.js'

// FUnciones de feedback para el usuario
/**@param {string} message */
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
        const dif = `[${task.dificultad}]`.padEnd(10);
        console.log(`\n${estado} \n${dif} \n${task.titulo} \n${vencimiento}`);
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
    console.log(`Total de tareas activas: ${stats.totalActivas}\n`);

    console.log("Tareas por estado: ");
    if (stats.totalActivas > 0){
        //object.entries convierte el objeto con sus estadisticas a un array, entonces si el objeto tiene pendiente = 5, lo pasa como ['pendiente', 5] para cuando lo pase a un foreach, me da el key y la cantidad,
        Object.entries(stats.porEstado).forEach(([estado, count]) => {
            //junto con el ToFixed devuelve un numero con un redoneo de un decimal
            const percentage = ((count / stats.totalActivas) * 100).toFixed(1);
            console.log(` - ${estado.padEnd(12)}: ${count} (${percentage}%)`);
        });
    } else {
        console.log("No se han creado estadisticas de tareas");
    }
}