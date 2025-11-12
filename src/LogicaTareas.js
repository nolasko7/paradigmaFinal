<<<<<<< HEAD
import { DIFICULTADES, ESTADOS } from '../utils/constantes.js';

=======
>>>>>>> b6221c58e58c06c522b1b260089e9978f1c7bf0e
/**
 * Módulo de Lógica de Tareas (Paradigma Lógico).
 *
 * Este módulo define "predicados" (funciones que devuelven V/F)
 * y "reglas" (funciones que usan predicados para encontrar resultados)
<<<<<<< HEAD
 * sobre la lista de tareas
 */

/**
=======
 * sobre la base de conocimiento (la lista de tareas).
 *
 * Todas las funciones aquí son puras.
 */
import { DIFICULTADES, ESTADOS } from '../utils/constantes.js';

// --- PREDICADOS ---

/**
 * [PREDICADO LÓGICO / FUNCIÓN PURA]
>>>>>>> b6221c58e58c06c522b1b260089e9978f1c7bf0e
 * Determina si una tarea está vencida.
 * @param {Tarea} tarea - La tarea a chequear.
 * @returns {boolean}
 */
const estaVencida = (tarea) => {
<<<<<<< HEAD
=======
  // Reutilizamos el método encapsulado de OOP.
>>>>>>> b6221c58e58c06c522b1b260089e9978f1c7bf0e
  return tarea.estaVencida();
};

/**
<<<<<<< HEAD
=======
 * [PREDICADO LÓGICO / FUNCIÓN PURA]
>>>>>>> b6221c58e58c06c522b1b260089e9978f1c7bf0e
 * Determina si una tarea es de alta prioridad.
 * @param {Tarea} tarea - La tarea a chequear.
 * @returns {boolean}
 */
const esPrioritaria = (tarea) => {
  // La regla es: Dificil y no está terminada.
  return tarea.dificultad === DIFICULTADES.DIFICIL &&
         tarea.estado !== ESTADOS.TERMINADA;
};

// --- REGLAS (se exportan) ---

/**
<<<<<<< HEAD
=======
 * [REGLA LÓGICA / FUNCIÓN PURA]
>>>>>>> b6221c58e58c06c522b1b260089e9978f1c7bf0e
 * Devuelve una lista de tareas vencidas.
 * @param {Array<Tarea>} lista - La lista de tareas ("hechos").
 * @returns {Array<Tarea>} Una NUEVA lista con las tareas que cumplen la regla.
 */
export const encontrarTareasVencidas = (lista) => {
  // "Encontrar todas las T donde T estaVencida"
  return lista.filter(estaVencida);
};

/**
<<<<<<< HEAD
=======
 * [REGLA LÓGICA / FUNCIÓN PURA]
>>>>>>> b6221c58e58c06c522b1b260089e9978f1c7bf0e
 * Devuelve una lista de tareas prioritarias.
 * @param {Array<Tarea>} lista - La lista de tareas ("hechos").
 * @returns {Array<Tarea>} Una NUEVA lista con las tareas que cumplen la regla.
 */
export const encontrarTareasPrioritarias = (lista) => {
  // "Encontrar todas las T donde T esPrioritaria"
  return lista.filter(esPrioritaria);
};