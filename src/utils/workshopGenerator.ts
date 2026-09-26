import { Subject, Workshop, ExerciseItem, StudyMaterial, Topic } from '../types';
import { calculateSubjectGrades } from './gradeCalculations';

export function generateCustomWorkshop(subject: Subject, studentName: string): Workshop {
  const calc = calculateSubjectGrades(subject);

  // Extraer todos los temas de la materia
  const allTopics: Topic[] = [];
  subject.cuts.forEach(cut => {
    (cut.topics || []).forEach(t => allTopics.push(t));
  });

  // Filtrar temas marcados como difíciles
  const difficultTopics = allTopics.filter(t => t.isDifficult);
  const targetTopics = difficultTopics.length > 0 ? difficultTopics : allTopics;
  const targetTopicNames = targetTopics.map(t => t.name);

  // Si no hay temas registrados aún, usar el nombre de la materia
  if (targetTopicNames.length === 0) {
    targetTopicNames.push(`Fundamentos y temas clave de ${subject.name}`);
  }

  // Generar ejercicios de refuerzo adaptados
  const exercises: ExerciseItem[] = [];

  targetTopics.slice(0, 4).forEach((topic, idx) => {
    const topicLabel = topic.name;
    const concepts = (topic.keyConcepts && topic.keyConcepts.length > 0)
      ? topic.keyConcepts.join(', ')
      : 'conceptos fundamentales del corte';

    // Ejercicio 1: Conceptual / Básico
    exercises.push({
      id: `ex-${idx}-1`,
      topicName: topicLabel,
      difficulty: 'básico',
      question: `Define el principio teórico central de "${topicLabel}" y describe paso a paso cómo se aplican los siguientes conceptos: ${concepts}.`,
      hint: `Comienza identificando los supuestos iniciales, las condiciones de frontera o las fórmulas base antes de operar algebraicamente.`,
      sampleSolution: `Esquema de solución: 1) Declarar variables conocidas y desconocidas. 2) Aplicar la definición formal. 3) Comprobar la coherencia dimensional o lógica.`
    });

    // Ejercicio 2: Práctico / Intermedio
    exercises.push({
      id: `ex-${idx}-2`,
      topicName: topicLabel,
      difficulty: 'intermedio',
      question: `Desarrolla un ejercicio práctico representativo de evaluación para "${topicLabel}". Realiza el procedimiento completo justificando cada transformación matemática o lógica.`,
      hint: `Presta especial atención a los errores comunes en este tema: ${topic.notes || 'revisión rigurosa de signos, simplificación y casos de indeterminación'}.`,
      sampleSolution: `Paso a paso: Descomponer el problema en sub-problemas menores y verificar que el resultado intermedio cumpla con el dominio admisible.`
    });

    // Ejercicio 3: Reto de examen / Avanzado
    exercises.push({
      id: `ex-${idx}-3`,
      topicName: topicLabel,
      difficulty: 'avanzado',
      question: `Problema de aplicación avanzada tipo parcial: Analiza un caso donde "${topicLabel}" interactúe con el corte siguiente de la materia. Formula la solución analítica óptima.`,
      hint: `Integra dos conceptos simultáneos. Si estás atascado, prueba una sustitución auxiliar o un gráfico representativo.`,
      sampleSolution: `Solución modelo estructurada con validación final por método alternativo.`
    });
  });

  // Materiales de estudio y refuerzo recomendados (Requisito 10)
  const materials: StudyMaterial[] = [
    {
      id: 'mat-1',
      title: `Guía Maestra de Estudio: ${subject.name}`,
      type: 'guia',
      description: 'Documento de repaso intensivo con los teoremas clave, algoritmos estándar y checklist de preparación para el examen.',
      keyPoints: [
        'Resumen en fichas nemotécnicas de los temas de mayor ponderación',
        '20 ejercicios típicos de parcial con soluciones analíticas',
        'Checklist de verificación de errores comunes antes de entregar la prueba'
      ]
    },
    {
      id: 'mat-2',
      title: 'Formulario y Mapa Conceptual de Relaciones',
      type: 'formula',
      description: 'Hoja de trucos y formulario condensado para memorización rápida de identidades, leyes y reglas de derivación/algoritmos.',
      keyPoints: [
        'Propiedades fundamentales y equivalencias directas',
        'Casos especiales y advertencias de dominio',
        'Algoritmos paso a paso para resolver en menos de 10 minutos por problema'
      ]
    },
    {
      id: 'mat-3',
      title: 'Ruta de Video-Tutorías y Demostraciones Visuales',
      type: 'video',
      description: 'Selección de clases magistrales recomendadas por profesores universitarios para visualizar el concepto intuitivamente.',
      url: 'https://youtube.com',
      keyPoints: [
        'Animación geométrica y visualización de la intuición teórica',
        'Resolución en pizarra de ejercicios tipo examen parcial',
        'Estrategias de gestión del tiempo en la evaluación final'
      ]
    },
    {
      id: 'mat-4',
      title: 'Banco de Casos Prácticos Resueltos',
      type: 'resumen',
      description: 'Solucionario guiado con retroalimentación explícita para autoevaluación contra reloj.',
      keyPoints: [
        'Autoevaluación con cronómetro de 45 minutos',
        'Rúbrica de autocalificación según criterios del docente'
      ]
    }
  ];

  const conceptualSummary = `Este taller de refuerzo académico personalizado está diseñado especialmente para la asignatura ${subject.name}. El estudiante requiere actualmente una nota de ${calc.neededGradeToPass.toFixed(2)} sobre ${subject.scaleMax.toFixed(1)} para asegurar la aprobación de la materia${subject.targetGrade ? ` y ${calc.neededGradeToTarget.toFixed(2)} para alcanzar la meta de excelencia académica (${subject.targetGrade.toFixed(1)})` : ''}. Se priorizan los temas reportados con mayor nivel de complejidad y fricción de aprendizaje: ${targetTopicNames.slice(0, 3).join(', ')}.`;

  const recommendedTechniques = [
    'Técnica Feynman: Explica cada concepto en voz alta con palabras sencillas sin consultar el texto.',
    'Práctica espaciada: Resuelve 2 problemas por la mañana y 2 por la tarde en lugar de maratones continuas.',
    'Bloque de simulación de examen: Resuelve el bloque avanzado con temporizador estricto sin mirar apuntes.',
    'Revisión cruzada con tutor: Presenta las soluciones en tu sesión personalizada para pulir la notación formal.'
  ];

  return {
    id: `workshop-${Date.now()}`,
    subjectId: subject.id,
    subjectName: subject.name,
    generatedDate: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
    studentName: studentName || 'Estudiante',
    targetTopics: targetTopicNames,
    durationEstimateMinutes: 90,
    difficulty: subject.difficulty,
    instructions: `Resuelve este taller en hojas cuadriculadas o formato digital. Marca los ejercicios donde requieras apoyo directo de tu tutor académico. Recuerda comprobar la solución al finalizar cada problema.`,
    exercises,
    conceptualSummary,
    recommendedTechniques,
    materials
  };
}
