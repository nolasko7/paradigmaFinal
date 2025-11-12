import fs from 'fs'; // Importamos FileSystem para persistencia

// --- Importaciones de Paradigmas ---

// OOP (La entidad Tarea)
import { Tarea } from './Tarea.js';

// ESTRUCTURADO (Constantes y I/O)
import { ESTADOS, DIFICULTADES } from './utils/constantes.js';
import * as Menu from './io/ManejoMenu.js';
import * as Inputs from './io/ManejoInputs.js';

// FUNCIONAL (Transformaciones de Listas)
import {
  filtrarTareasActivas,
  buscarPorTitulo,
  filtrarPorEstado,
  ordenarTareasPor,
  calcularEstadisticas
} from './services/ServiciosTareas.js';

// LÓGICO (Reglas e Inferencias)
import {
  encontrarTareasVencidas,
  encontrarTareasPrioritarias
} from './logic/LogicaTareas.js';

// --- Configuración del archivo ---
const RUTA_BD = '../data/tareas.json';

// --- Estado de la Aplicación ---
// Esta es la "Base de Hechos" que leeremos desde la BD
let estadoApp = []; // Contendrá instancias de Tarea (OOP)

// =================================================================
//              PARADIGMA IMPERATIVO/ESTRUCTURADO
// =================================================================

/**
 * Lee el archivo JSON y carga las tareas en el estadoApp
*/
function cargarTareas() {
  try {
    if (fs.existsSync(RUTA_BD)) {
      const data = fs.readFileSync(RUTA_BD, 'utf-8');
      const tareasJSON = JSON.parse(data);
      
      // Convertimos JSON a instancias de Tarea
      estadoApp = tareasJSON.map(json => Tarea.fromJSON(json));
      
      Menu.logSuccess(`Cargadas ${estadoApp.length} tareas desde ${RUTA_BD}`);
    } else {
      Menu.logInfo('No se encontró archivo de BD. Se iniciará con lista vacía.');
      estadoApp = [];
    }
  } catch (error) {
    Menu.logError(`Error fatal al cargar tareas: ${error.message}`);
    estadoApp = [];
  }
}

/**
 * Guarda la lista de tareas actual (estadoApp) en el archivo JSON.
 */
function guardarTareas() {
  try {
    // Convertimos instancia a JSON simple
    const tareasJSON = estadoApp.map(tarea => tarea.toJSON());
    fs.writeFileSync(RUTA_BD, JSON.stringify(tareasJSON, null, 2));
  } catch (error) {
    Menu.logError(`Error al guardar tareas: ${error.message}`);
  }
}

// ==============================
//         CASOS DE USO
// ==============================

/** 
 * Creación de una tarea
*/
function casoCrearTarea() {
  // Pide los datos
  const props = Inputs.solicitarPropsCreacion();
  
  if (props) {
    try {
      const nuevaTarea = new Tarea(props);   // Crea la nueva instancia
      estadoApp.push(nuevaTarea);
      Menu.logSuccess('¡Tarea creada exitosamente!');
      Menu.displayTaskDetails(nuevaTarea);
    } catch (error) {
      Menu.logError(error.message);
    }
  } else {
    Menu.logInfo('Creación cancelada.');
  }
}

/** 
 * Modificación de una tarea 
*/
function casoModificarTarea() {
  console.clear();
  Menu.logInfo("--- 3. Modificar Tarea ---");
  
  const activas = filtrarTareasActivas(estadoApp);
  const termino = Inputs.solicitarTerminoBusqueda();
  const encontradas = buscarPorTitulo(activas, termino);
  const tarea = Inputs.seleccionarTareaDeLista(encontradas, 'modificar'); // aca nico laburate eso, supongo q es cuando encuentra muchas tareas, le pregunta al usuario cual desea modificar.
  
  if (!tarea) {
    Menu.logInfo('No existen tareas con ese titulo.');
    return;
  }
  
  Menu.displayTaskDetails(tarea);
  
  const cambios = Inputs.solicitarPropsModificacion(tarea);

  if (cambios) {
    tarea.modificar(cambios);
    Menu.logSuccess('¡Tarea actualizada!');
    Menu.displayTaskDetails(tarea);
  } else {
    Menu.logInfo('Modificación cancelada o sin cambios.');
  }
}

/**
 * Eliminacion de una tarea (soft-delete)
 */
function casoEliminarTarea() {
  console.clear();
  Menu.logInfo("--- 4. Eliminar Tarea ---");

  const activas = filtrarTareasActivas(estadoApp);
  const termino = Inputs.solicitarTerminoBusqueda();
  const encontradas = buscarPorTitulo(activas, termino);
  const tarea = Inputs.seleccionarTareaDeLista(encontradas, 'eliminar'); // aca lo mismo que en modificar.
  
  if (!tarea) {
    Menu.logInfo('No existen tareas con ese titulo.');
    return;
  }
  
  tarea.marcarEliminada();
  
  Menu.logSuccess(`Tarea "${tarea.titulo}" marcada como eliminada.`);
}

/**
 * Mostrar lista de Tareas
 */
function casoListarTareasDetalle() {
  console.clear();
  Menu.logInfo("--- 2. Listar Tareas en Detalle ---");

  // filtra las tareas activas (Funcional)
  const activas = filtrarTareasActivas(estadoApp);
  if (activas.length === 0) {
    Menu.logInfo("No hay tareas activas para mostrar.");
    return;
  }
  
  activas.forEach(Menu.displayTaskDetails);
}



/** 
 * Ordena las Tareas 
*/ 
function casoOrdenarTareas() {
  console.clear();
  Menu.logInfo("--- 5. Buscar u Ordenar Tareas ---");
  
  // 1. Filtramos las tareas activas (Funcional)
  let resultado = filtrarTareasActivas(estadoApp);
  
  // 2. Solicitamos termino (Imperativo)
  const termino = Inputs.solicitarTerminoBusqueda();
  
  // 3. Buscamos por titulo (Funcional)
  resultado = buscarPorTitulo(resultado, termino);
  
  // 4. Pedir criterio de orden (Imperativo)
  const criterio = Inputs.solicitarCriterioOrden();
  
  // 5. Aplicar orden (Funcional)
  if (criterio) {
    resultado = ordenarTareasPor(resultado, criterio);
  }

  Menu.displayTaskList(resultado);
}

/** 
 * Hace un reporte con las estadisticas de las tareas
*/

function casoReportes() {
  console.clear();
  Menu.logInfo("--- 6. Reportes y Estadísticas ---");
  
  const activas = filtrarTareasActivas(estadoApp);
  
  console.log("Sub-menú de Reportes:");
  console.log(" [1] Estadísticas Generales");
  console.log(" [2] Reporte: Tareas VENCIDAS");
  console.log(" [3] Reporte: Tareas PRIORITARIAS");
  const opcion = prompt("Seleccione reporte: ");

  switch(opcion) {
    case '1':
      const stats = calcularEstadisticas(activas);
      Menu.displayStatistics({ ...stats, totalActivas: activas.length, porEstado: stats.estados, porDificultad: stats.dificultades });
      break;
    case '2':
      const vencidas = encontrarTareasVencidas(activas);
      Menu.displayTaskList(vencidas);
      break;
    case '3':
      const prioritarias = encontrarTareasPrioritarias(activas);
      Menu.displayTaskList(prioritarias);
      break;
    default:
      Menu.logInfo("Opción de reporte no válida.");
  }
}

/**
 * Bucle principal de la aplicación.
 */


function iniciar() {
  cargarTareas(); // Carga las tareas al iniciar 
  let continuar = true;

  while (continuar) {
    Menu.displayMenu(); 
    const opcion = prompt('Seleccione una opción: ');
    
    switch (opcion) {
      case '1': casoCrearTarea(); break;
      case '2': casoListarTareasDetalle(); break;
      case '3': casoModificarTarea(); break;
      case '4': casoEliminarTarea(); break;
      case '5': casoOrdenarTareas(); break;
      case '6': casoReportes(); break;
      case '0':
        continuar = false;
        break;
      default:
        Menu.logError('Opción no válida.');
        break;
    }
    
    if (continuar) {
      prompt('\nPresione ENTER para continuar...');
    }
  }

  guardarTareas(); // Guarda las tareas al salir
  Menu.logInfo('Saliendo del programa...');
}

// --- Iniciar la aplicación ---
iniciar();