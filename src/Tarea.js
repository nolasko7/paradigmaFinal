import { randomUUID } from 'crypto'; // Para el ID único

// Constantes exportadas para ser usadas por todos los módulos
export const ESTADOS = Object.freeze({
  PENDIENTE: 'Pendiente',
  EN_CURSO: 'En Curso',
  TERMINADA: 'Terminada',
  CANCELADA: 'Cancelada',
});

export const DIFICULTADES = Object.freeze({
  FACIL: 'Fácil',
  MEDIO: 'Medio',
  DIFICIL: 'Difícil',
});

/**
 * Constructor de la entidad Tarea (Paradigma OOP).
 * @param {object} props - Propiedades iniciales.
 * @param {string} props.titulo - Título (max 100).
 * @param {string} [props.descripcion] - Descripción (max 500).
 * @param {string} [props.dificultad] - Dificultad (default: Fácil).
 * @param {Date | null} [props.vencimiento] - Fecha de vencimiento.
 */
export function Tarea(props) {
  // --- Validación de Reglas de Negocio (El "Guardián" de OOP) ---
  if (!props.titulo || typeof props.titulo !== 'string' || props.titulo.trim().length === 0) {
    throw new Error('El "titulo" es obligatorio.');
  }
  if (props.titulo.length > 100) {
    throw new Error('El "titulo" no puede exceder los 100 caracteres.');
  }
  if (props.descripcion && props.descripcion.length > 500) {
    throw new Error('La "descripcion" no puede exceder los 500 caracteres.');
  }
  // (Aquí irían más validaciones)

  // --- Atributos Internos (Estado) ---
  this.id = randomUUID(); // ID Único
  this.titulo = props.titulo.trim();
  this.descripcion = props.descripcion || '';
  this.estado = ESTADOS.PENDIENTE;
  this.dificultad = props.dificultad || DIFICULTADES.FACIL;
  
  this.creacion = new Date();
  this.ultimaEdicion = new Date(this.creacion.getTime());
  this.vencimiento = props.vencimiento || null;

  /**
   * Atributo para Soft Delete.
   * Si es 'true', la tarea no se debe mostrar en las listas
   * pero permanecerá en la base de datos.
   */
  this.eliminado = false; 
}

/**
 * [COMPORTAMIENTO OOP]
 * Modifica la tarea de forma MUTABLE (cambia el estado interno).
 * @param {object} cambios - Objeto con los campos a cambiar.
 */
Tarea.prototype.modificar = function(cambios) {
  if (cambios.titulo) {
    // Aquí también se debería validar
    this.titulo = cambios.titulo;
  }
  if (cambios.descripcion) {
    this.descripcion = cambios.descripcion;
  }
  if (cambios.estado && Object.values(ESTADOS).includes(cambios.estado)) {
    this.estado = cambios.estado;
  }
  if (cambios.dificultad && Object.values(DIFICULTADES).includes(cambios.dificultad)) {
    this.dificultad = cambios.dificultad;
  }
  if (cambios.vencimiento !== undefined) {
    // (validar que sea Date o null)
    this.vencimiento = cambios.vencimiento;
  }

  // Toda modificación actualiza la fecha de última edición
  this.ultimaEdicion = new Date();
  console.log(`Tarea [${this.id.substring(0, 6)}] modificada.`);
};

/**
 * [COMPORTAMIENTO OOP - SOFT DELETE]
 * Marca la tarea como eliminada. No la borra físicamente.
 */
Tarea.prototype.marcarEliminada = function() {
  this.eliminado = true;
  this.ultimaEdicion = new Date();
  console.log(`Tarea [${this.id.substring(0, 6)}] marcada como eliminada.`);
};

/**
 * [COMPORTAMIENTO OOP - Encapsulación]
 * Oculta la lógica de cómo saber si una tarea está vencida.
 * @returns {boolean}
 */
Tarea.prototype.estaVencida = function() {
  if (!this.vencimiento || this.estado === ESTADOS.TERMINADA) {
    return false;
  }
  const hoy = new Date().setHours(0, 0, 0, 0);
  const venc = new Date(this.vencimiento).setHours(0, 0, 0, 0);
  return venc < hoy;
};

/**
 * [COMPORTAMIENTO OOP]
 * Devuelve una representación simple para la persistencia en JSON.
 * Los métodos de prototipo no se guardan en JSON.
 */
Tarea.prototype.toJSON = function() {
  return {
    id: this.id,
    titulo: this.titulo,
    descripcion: this.descripcion,
    estado: this.estado,
    dificultad: this.dificultad,
    creacion: this.creacion.toISOString(),
    ultimaEdicion: this.ultimaEdicion.toISOString(),
    vencimiento: this.vencimiento ? this.vencimiento.toISOString() : null,
    eliminado: this.eliminado,
  };
};

/**
 * [COMPORTAMIENTO OOP - Método Estático]
 * Re-hidrata una tarea desde un objeto JSON simple,
 * restaurando su prototipo para que los métodos funcionen.
 * @param {object} data - Datos leídos desde tareas.json
 * @returns {Tarea} Una instancia de Tarea.
 */
Tarea.fromJSON = function(data) {
  // 1. Creamos una instancia "vacía" de Tarea
  const tarea = new Tarea({ titulo: data.titulo }); // (El constructor valida el título)

  // 2. Sobrescribimos todos los datos con los de la BD
  Object.assign(tarea, {
    ...data,
    // Convertimos los strings de fecha a objetos Date
    creacion: new Date(data.creacion),
    ultimaEdicion: new Date(data.ultimaEdicion),
    vencimiento: data.vencimiento ? new Date(data.vencimiento) : null,
  });

  return tarea;
};