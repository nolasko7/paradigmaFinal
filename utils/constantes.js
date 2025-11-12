/* Módulo de Constantes (Paradigma Estructurado).
Evita el uso de "magic strings" o variables globales.*/

/**
@typedef {'Facil' | 'Media' | 'Dificil'} Dificultad 
@typedef {'Pendiente' | 'En Curso' | 'Terminada' | 'Cancelada'} Estado
*/

export const ESTADOS = Object.freeze({
    PENDIENTE: 'Pendiente',
    EN_CURSO: 'En Curso',
    TERMINADA: 'Terminada',
    CANCELADA: 'Cancelada',
});

export const DIFICULTADES = Object.freeze({
    FACIL: 'Facil',
    MEDIA: 'Media',
    DIFICIL: 'Dificil',
});

/**
 
Mapa de valores numéricos para ordenar por dificultad.
Útil para el paradigma funcional (sort).*/
export const DIFICULTADES_ORDEN = Object.freeze({
    [DIFICULTADES.FACIL]: 1,
    [DIFICULTADES.MEDIA]: 2,
    [DIFICULTADES.DIFICIL]: 3,
});

export const getHoy = () => {
    return new Date().toISOString().split('T')[0];
};