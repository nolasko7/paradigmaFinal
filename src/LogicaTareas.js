import { DIFICULTADES, ESTADOS } from '../utils/constantes.js';

/**
 * Módulo de Lógica de Tareas (Paradigma Lógico).
 *
 * Este módulo define "predicados" (funciones que devuelven V/F)
 * y "reglas" (funciones que usan predicados para encontrar resultados)
 * sobre la lista de tareas
 */

/**
 * Determina si una tarea está vencida.
 * @param {Tarea} tarea - La tarea a chequear.
 * @returns {boolean}
 */
const estaVencida = (tarea) => {
  return tarea.estaVencida();
};

/**
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
 * Devuelve una lista de tareas vencidas.
 * @param {Array<Tarea>} lista - La lista de tareas ("hechos").
 * @returns {Array<Tarea>} Una NUEVA lista con las tareas que cumplen la regla.
 */
export const encontrarTareasVencidas = (lista) => {
  // "Encontrar todas las T donde T estaVencida"
  return lista.filter(estaVencida);
};

/**
 * Devuelve una lista de tareas prioritarias.
 * @param {Array<Tarea>} lista - La lista de tareas ("hechos").
 * @returns {Array<Tarea>} Una NUEVA lista con las tareas que cumplen la regla.
 */
export const encontrarTareasPrioritarias = (lista) => {
  // "Encontrar todas las T donde T esPrioritaria"
  return lista.filter(esPrioritaria);
};