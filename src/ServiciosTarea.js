/**
 * Módulo de Servicios de Tareas (Paradigma Funcional).
 * * Este módulo contiene funciones puras para consultar y transformar
 * listas de tareas. No muta los datos de entrada y no tiene
 * efectos secundarios. Es el "Núcleo Lógico-Funcional" de la aplicación.
 * * Cumple:
 * - Funciones Puras (100% de este módulo).
 * - Inmutabilidad (siempre devuelve nuevas listas).
 * - Uso de HOFs (map, filter, reduce, sort) en lugar de bucles.
 * - Dependencias inyectadas (import).
 */

// Importamos las constantes para usarlas en la lógica
import { DIFICULTADES, DIFICULTADES_ORDEN, ESTADOS } from '../utils/constantes.js';

/**
 * [FUNCIÓN PURA - HOF]
 * Filtra la lista principal para devolver solo las tareas activas
 * (no marcadas como eliminadas por soft delete).
 * Esta es una HOF de utilidad que puede componerse con otras.
 * @param {Array<Tarea>} lista - La lista completa de tareas.
 * @returns {Array<Tarea>} Una NUEVA lista solo con tareas activas.
 */
export const filtrarTareasActivas = (lista) => {
  return lista.filter(t => !t.eliminado);
};

/**
 * [FUNCIÓN PURA - HOF]
 * Busca tareas por un término en el título.
 * @param {Array<Tarea>} lista - La lista de tareas (usualmente ya filtrada por activas).
 * @param {string} titulo - El texto a buscar.
 * @returns {Array<Tarea>} Una NUEVA lista con las tareas que coinciden.
 */
export const buscarPorTitulo = (lista, titulo) => {
  if (!titulo) {
    return [...lista]; // Devuelve una copia si no hay término
  }
  const t = titulo.toLowerCase();
  return lista.filter(tarea => tarea.titulo.toLowerCase().includes(t));
};

/**
 * [FUNCIÓN PURA - HOF]
 * Filtra tareas por un estado específico.
 * @param {Array<Tarea>} lista - La lista de tareas.
 * @param {string} estado - El estado a filtrar.
 * @returns {Array<Tarea>} Una NUEVA lista con las tareas de ese estado.
 */
export const filtrarPorEstado = (lista, estado) => {
  return lista.filter(t => t.estado === estado);
};

/**
 * [FUNCIÓN PURA - HOF]
 * Ordena una lista de tareas por un criterio.
 * @param {Array<Tarea>} lista - La lista a ordenar.
 * @param {'titulo' | 'vencimiento' | 'creacion' | 'dificultad'} criterio - Criterio de orden.
 * @returns {Array<Tarea>} Una NUEVA lista ordenada.
 */
export const ordenarTareasPor = (lista, criterio) => {
  // Usamos [...] para crear una copia y no mutar
  // el array original, ya que .sort() es mutable por defecto.
  const copia = [...lista];

  switch (criterio) {
    case 'titulo':
      // localeCompare es ideal para ordenar texto
      return copia.sort((a, b) => a.titulo.localeCompare(b.titulo));
    
    case 'vencimiento':
      // Maneja tareas con y sin fecha de vencimiento
      return copia.sort((a, b) => {
        if (!a.vencimiento) return 1; // Tareas sin fecha van al final
        if (!b.vencimiento) return -1; // Tareas sin fecha van al final
        return a.vencimiento - b.vencimiento; // Ordena por fecha
      });

    case 'creacion':
      // Ordena por fecha de creación (ascendente)
      return copia.sort((a, b) => a.creacion - b.creacion);

    case 'dificultad':
      // Usa el mapa de orden importado de constantes.js
      return copia.sort((a, b) => {
        const ordenA = DIFICULTADES_ORDEN[a.dificultad] || 0;
        const ordenB = DIFICULTADES_ORDEN[b.dificultad] || 0;
        return ordenA - ordenB;
      });

    default:
      return copia; // Devuelve la copia sin ordenar si el criterio es inválido
  }
};

/**
 * [FUNCIÓN PURA - HOF]
 * Calcula estadísticas sobre la lista de tareas.
 * @param {Array<Tarea>} lista - La lista de tareas.
 * @returns {object} Un objeto con las estadísticas.
 */
export const calcularEstadisticas = (lista) => {
  // .reduce() es la HOF perfecta para agregar una lista a un solo objeto
  const stats = lista.reduce((acumulador, tarea) => {
    // Conteo por estado
    const estado = tarea.estado;
    acumulador.estados[estado] = (acumulador.estados[estado] || 0) + 1;

    // Conteo por dificultad
    const dificultad = tarea.dificultad;
    acumulador.dificultades[dificultad] = (acumulador.dificultades[dificultad] || 0) + 1;

    return acumulador;
  }, {
    // Valor inicial del acumulador
    estados: {},
    dificultades: {}
  });

  return {
    total: lista.length,
    ...stats,
  };
};
