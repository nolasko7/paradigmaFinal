/**
 * Módulo de Lógica de Tareas (Paradigma Lógico).
 *
 * Este módulo define "predicados" (funciones que devuelven V/F)
 * y "reglas" (funciones que usan predicados para encontrar resultados)
 * sobre la base de conocimiento (la lista de tareas).
 *
 * Todas las funciones aquí son puras.
 */
import { DIFICULTADES, ESTADOS } from '../utils/constantes.js';

// --- PREDICADOS ---

/**
 * [PREDICADO LÓGICO / FUNCIÓN PURA]
 * Determina si una tarea está vencida.
 * @param {Tarea} tarea - La tarea a chequear.
 * @returns {boolean}
 */
const estaVencida = (tarea) => {
  // Reutilizamos el método encapsulado de OOP.
  return tarea.estaVencida();
};

/**
 * [PREDICADO LÓGICO / FUNCIÓN PURA]
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
 * [REGLA LÓGICA / FUNCIÓN PURA]
 * Devuelve una lista de tareas vencidas.
 * @param {Array<Tarea>} lista - La lista de tareas ("hechos").
 * @returns {Array<Tarea>} Una NUEVA lista con las tareas que cumplen la regla.
 */
export const encontrarTareasVencidas = (lista) => {
  // "Encontrar todas las T donde T estaVencida"
  return lista.filter(estaVencida);
};

/**
 * [REGLA LÓGICA / FUNCIÓN PURA]
 * Devuelve una lista de tareas prioritarias.
 * @param {Array<Tarea>} lista - La lista de tareas ("hechos").
 * @returns {Array<Tarea>} Una NUEVA lista con las tareas que cumplen la regla.
 */
export const encontrarTareasPrioritarias = (lista) => {
  // "Encontrar todas las T donde T esPrioritaria"
  return lista.filter(esPrioritaria);
};