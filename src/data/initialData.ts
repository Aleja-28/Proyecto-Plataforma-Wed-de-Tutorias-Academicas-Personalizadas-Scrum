import { Subject, UserProfile } from '../types';

export const initialUser: UserProfile = {
  id: 'usr-1',
  name: 'Camila Rodriguez',
  email: 'camila.rodriguez@universidad.edu.co',
  institution: 'Universidad Nacional de Colombia',
  career: 'Ingeniería de Sistemas',
  semester: '4to Semestre',
  avatarSeed: 'Camila',
  isDemo: true,
};

export const initialSubjects: Subject[] = [
  {
    id: 'sub-1',
    name: 'Cálculo Diferencial e Integral',
    code: 'MAT-201',
    credits: 4,
    professor: 'Dr. Alejandro Morales',
    classroom: 'Edif. 401 - Aula 302',
    difficulty: 'alta',
    scaleMax: 5.0,
    minPassingGrade: 3.0,
    targetGrade: 4.2,
    semesterPeriod: '2026-1',
    notes: 'Enfocarse en optimización y regla de la cadena para el corte final.',
    isCompleted: false,
    cuts: [
      {
        id: 'cut-1-1',
        name: 'Corte 1 (30%)',
        percentage: 30,
        grade: 2.8,
        evaluationType: 'parcial',
        evaluationDetails: 'Examen escrito individual de límites y continuidad',
        topics: [
          {
            id: 'top-1',
            name: 'Límites indeterminados y al infinito',
            isDifficult: true,
            notes: 'Dificultad con indeterminaciones del tipo 0/0 y formas exponenciales.',
            keyConcepts: ['Factorización', 'Racionalización', 'Límites trigonométricos notables']
          },
          {
            id: 'top-2',
            name: 'Continuidad en puntos y trozos',
            isDifficult: false,
            keyConcepts: ['Límites laterales', 'Teorema del Valor Intermedio']
          }
        ]
      },
      {
        id: 'cut-1-2',
        name: 'Corte 2 (35%)',
        percentage: 35,
        grade: 3.2,
        evaluationType: 'mixto',
        evaluationDetails: 'Parcial 70% + 3 Quices en línea 30%',
        topics: [
          {
            id: 'top-3',
            name: 'Regla de la Cadena y Derivación Implícita',
            isDifficult: true,
            notes: 'Confusión al diferenciar variables dependientes e independientes en funciones trigonométricas inversas.',
            keyConcepts: ['Derivada de composición', 'Derivación logarítmica', 'Tasas de cambio relacionadas']
          },
          {
            id: 'top-4',
            name: 'Aplicaciones: Máximos y Mínimos',
            isDifficult: false,
            keyConcepts: ['Criterio de la primera y segunda derivada', 'Puntos críticos']
          }
        ]
      },
      {
        id: 'cut-1-3',
        name: 'Corte 3 (35%)',
        percentage: 35,
        grade: null, // Pendiente por cursar
        evaluationType: 'parcial',
        evaluationDetails: 'Examen final acumulativo y taller integrador',
        topics: [
          {
            id: 'top-5',
            name: 'Integrales por Sustitución y por Partes',
            isDifficult: true,
            notes: 'Reconocimiento rápido del método de integración a usar (ILATE).',
            keyConcepts: ['Método por sustitución', 'Fórmula de integración por partes', 'Fracciones parciales']
          },
          {
            id: 'top-6',
            name: 'Teorema Fundamental del Cálculo y Áreas',
            isDifficult: false,
            keyConcepts: ['Área entre dos curvas', 'Sólidos de revolución']
          }
        ]
      }
    ]
  },
  {
    id: 'sub-2',
    name: 'Estructuras de Datos y Algoritmos',
    code: 'SIS-304',
    credits: 3,
    professor: 'Ing. Laura Valenzuela',
    classroom: 'Lab Cómputo 4',
    difficulty: 'media',
    scaleMax: 5.0,
    minPassingGrade: 3.0,
    targetGrade: 4.5,
    semesterPeriod: '2026-1',
    isCompleted: false,
    cuts: [
      {
        id: 'cut-2-1',
        name: 'Corte 1 (30%)',
        percentage: 30,
        grade: 4.3,
        evaluationType: 'proyecto',
        evaluationDetails: 'Implementación de listas enlazadas dobles y pilas en C++',
        topics: [
          {
            id: 'top-201',
            name: 'Punteros y Gestión Dinámica de Memoria',
            isDifficult: false,
            keyConcepts: ['Malloc/Free', 'Memory Leaks', 'Referencias']
          },
          {
            id: 'top-202',
            name: 'Listas Enlazadas Circulares',
            isDifficult: true,
            notes: 'Manejo de nodos centinela y condiciones de borde en borrado.',
            keyConcepts: ['Nodos dobles', 'Punteros cabeza y cola']
          }
        ]
      },
      {
        id: 'cut-2-2',
        name: 'Corte 2 (30%)',
        percentage: 30,
        grade: 3.9,
        evaluationType: 'parcial',
        evaluationDetails: 'Evaluación teórica-práctica de árboles binarios y balanceo AVL',
        topics: [
          {
            id: 'top-203',
            name: 'Árboles AVL y Rotaciones',
            isDifficult: true,
            notes: 'Determinar el factor de equilibrio tras inserciones dobles.',
            keyConcepts: ['Rotación simple izquierda/derecha', 'Rotación doble RL/LR']
          }
        ]
      },
      {
        id: 'cut-2-3',
        name: 'Corte 3 (40%)',
        percentage: 40,
        grade: null,
        evaluationType: 'proyecto',
        evaluationDetails: 'Proyecto final: Grafo de navegación y algoritmo Dijkstra',
        topics: [
          {
            id: 'top-204',
            name: 'Grafos: BFS, DFS y Dijkstra',
            isDifficult: false,
            keyConcepts: ['Matriz de adyacencia', 'Cola de prioridad', 'Ruta mínima']
          }
        ]
      }
    ]
  },
  {
    id: 'sub-3',
    name: 'Física de Ondas y Fluidos',
    code: 'FIS-202',
    credits: 3,
    professor: 'Fís. Roberto Silva',
    classroom: 'Lab Física II',
    difficulty: 'critica',
    scaleMax: 5.0,
    minPassingGrade: 3.0,
    targetGrade: 3.8,
    semesterPeriod: '2026-1',
    notes: 'Materia con alta exigencia matemática en ecuaciones diferenciales de onda.',
    isCompleted: false,
    cuts: [
      {
        id: 'cut-3-1',
        name: 'Corte 1 (30%)',
        percentage: 30,
        grade: 1.8,
        evaluationType: 'parcial',
        evaluationDetails: 'Parcial de oscilaciones forzadas y resonancia',
        topics: [
          {
            id: 'top-301',
            name: 'Movimiento Armónico Simple y Amortiguado',
            isDifficult: true,
            notes: 'Ecuación diferencial de segundo orden y cálculo de factor de amortiguamiento gamma.',
            keyConcepts: ['Ecuación diferencial MAS', 'Oscilador subamortiguado', 'Factor Q']
          }
        ]
      },
      {
        id: 'cut-3-2',
        name: 'Corte 2 (30%)',
        percentage: 30,
        grade: 2.1,
        evaluationType: 'laboratorio',
        evaluationDetails: 'Informes de laboratorio y quiz práctico de ondas sonoras',
        topics: [
          {
            id: 'top-302',
            name: 'Ondas Estacionarias y Efecto Doppler',
            isDifficult: true,
            notes: 'Cálculo de frecuencias observadas con fuente y receptor en movimiento relativo angular.',
            keyConcepts: ['Tubos abiertos y cerrados', 'Frecuencia aparente', 'Interferencia']
          }
        ]
      },
      {
        id: 'cut-3-3',
        name: 'Corte 3 (40%)',
        percentage: 40,
        grade: null, // Pendiente
        evaluationType: 'parcial',
        evaluationDetails: 'Examen de hidrodinámica y ecuación de Bernoulli',
        topics: [
          {
            id: 'top-303',
            name: 'Ecuación de Continuidad y Bernoulli',
            isDifficult: true,
            notes: 'Problemas de tanques con orificios y pérdidas de carga.',
            keyConcepts: ['Conservación de energía en fluidos', 'Tubo de Venturi', 'Viscosidad']
          }
        ]
      }
    ]
  },
  {
    id: 'sub-4',
    name: 'Comunicación y Ética Profesional',
    code: 'HUM-105',
    credits: 2,
    professor: 'Mg. Carmen Restrepo',
    classroom: 'Aula Magna 102',
    difficulty: 'baja',
    scaleMax: 5.0,
    minPassingGrade: 3.0,
    targetGrade: 4.8,
    semesterPeriod: '2026-1',
    isCompleted: false,
    cuts: [
      {
        id: 'cut-4-1',
        name: 'Corte 1 (30%)',
        percentage: 30,
        grade: 4.6,
        evaluationType: 'taller',
        topics: [{ id: 'top-401', name: 'Ensayo argumentativo', isDifficult: false }]
      },
      {
        id: 'cut-4-2',
        name: 'Corte 2 (35%)',
        percentage: 35,
        grade: 4.7,
        evaluationType: 'exposicion',
        topics: [{ id: 'top-402', name: 'Dilemas éticos en IA y tecnología', isDifficult: false }]
      },
      {
        id: 'cut-4-3',
        name: 'Corte 3 (35%)',
        percentage: 35,
        grade: null,
        evaluationType: 'proyecto',
        topics: [{ id: 'top-403', name: 'Código deontológico', isDifficult: false }]
      }
    ]
  },
  // Historial de materias cursadas con resultados (Requisito 13)
  {
    id: 'sub-hist-1',
    name: 'Álgebra Lineal',
    code: 'MAT-102',
    credits: 3,
    professor: 'Dr. Hernán Gómez',
    difficulty: 'alta',
    scaleMax: 5.0,
    minPassingGrade: 3.0,
    targetGrade: 4.0,
    semesterPeriod: '2025-2',
    isCompleted: true,
    finalGrade: 3.9,
    cuts: [
      { id: 'c-h1', name: 'Corte 1 (30%)', percentage: 30, grade: 3.5, evaluationType: 'parcial', topics: [] },
      { id: 'c-h2', name: 'Corte 2 (35%)', percentage: 35, grade: 4.1, evaluationType: 'parcial', topics: [] },
      { id: 'c-h3', name: 'Corte 3 (35%)', percentage: 35, grade: 4.0, evaluationType: 'parcial', topics: [] },
    ]
  },
  {
    id: 'sub-hist-2',
    name: 'Introducción a la Programación',
    code: 'SIS-101',
    credits: 3,
    professor: 'Ing. Mauricio Díaz',
    difficulty: 'media',
    scaleMax: 5.0,
    minPassingGrade: 3.0,
    targetGrade: 4.5,
    semesterPeriod: '2025-2',
    isCompleted: true,
    finalGrade: 4.6,
    cuts: [
      { id: 'c-h4', name: 'Corte 1 (30%)', percentage: 30, grade: 4.5, evaluationType: 'quices', topics: [] },
      { id: 'c-h5', name: 'Corte 2 (35%)', percentage: 35, grade: 4.8, evaluationType: 'proyecto', topics: [] },
      { id: 'c-h6', name: 'Corte 3 (35%)', percentage: 35, grade: 4.5, evaluationType: 'parcial', topics: [] },
    ]
  },
  {
    id: 'sub-hist-3',
    name: 'Química General',
    code: 'QUI-101',
    credits: 3,
    professor: 'Dra. Beatriz Santos',
    difficulty: 'media',
    scaleMax: 5.0,
    minPassingGrade: 3.0,
    targetGrade: 3.5,
    semesterPeriod: '2025-1',
    isCompleted: true,
    finalGrade: 3.4,
    cuts: [
      { id: 'c-h7', name: 'Corte 1 (30%)', percentage: 30, grade: 3.0, evaluationType: 'parcial', topics: [] },
      { id: 'c-h8', name: 'Corte 2 (35%)', percentage: 35, grade: 3.3, evaluationType: 'laboratorio', topics: [] },
      { id: 'c-h9', name: 'Corte 3 (35%)', percentage: 35, grade: 3.8, evaluationType: 'parcial', topics: [] },
    ]
  }
];
