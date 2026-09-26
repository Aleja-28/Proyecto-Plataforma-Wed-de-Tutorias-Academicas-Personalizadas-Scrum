import { Subject, GradeCalculationResult } from '../types';

/**
 * Realiza los cálculos matemáticos para una materia:
 * - Nota acumulada ponderada
 * - Nota necesaria en el porcentaje restante para aprobar (Requisito 4)
 * - Nota necesaria para alcanzar la nota objetivo (Requisito 5)
 * - Detección de notas inalcanzables / imposibles (Requisito 6)
 */
export function calculateSubjectGrades(subject: Subject): GradeCalculationResult {
  const cuts = subject.cuts || [];
  const scaleMax = subject.scaleMax || 5.0;
  const minPassing = subject.minPassingGrade || 3.0;
  const target = subject.targetGrade || 4.0;

  let currentAccumulated = 0;
  let completedPercentage = 0;

  cuts.forEach(cut => {
    if (cut.grade !== null && cut.grade !== undefined && !isNaN(cut.grade)) {
      const weight = (cut.percentage || 0) / 100;
      currentAccumulated += cut.grade * weight;
      completedPercentage += cut.percentage || 0;
    }
  });

  const remainingPercentage = Math.max(0, 100 - completedPercentage);
  const remainingWeight = remainingPercentage / 100;

  const currentAverageOverCompleted = completedPercentage > 0 
    ? (currentAccumulated / (completedPercentage / 100))
    : 0;

  let neededGradeToPass = 0;
  let neededGradeToTarget = 0;

  if (remainingWeight > 0) {
    const pointsNeededToPass = minPassing - currentAccumulated;
    neededGradeToPass = pointsNeededToPass / remainingWeight;

    const pointsNeededToTarget = target - currentAccumulated;
    neededGradeToTarget = pointsNeededToTarget / remainingWeight;
  } else {
    // Si ya completó el 100%
    neededGradeToPass = 0;
    neededGradeToTarget = 0;
  }

  const isPassedAlready = currentAccumulated >= minPassing;
  const isUnattainableToPass = !isPassedAlready && (neededGradeToPass > scaleMax);
  const isUnattainableToTarget = (neededGradeToTarget > scaleMax);

  const maxPossibleFinalGrade = Math.min(scaleMax, currentAccumulated + (remainingWeight * scaleMax));
  const minPossibleFinalGrade = currentAccumulated; // Si saca 0 en lo que queda

  return {
    currentAccumulated: Number(currentAccumulated.toFixed(2)),
    completedPercentage,
    remainingPercentage,
    currentAverageOverCompleted: Number(currentAverageOverCompleted.toFixed(2)),
    neededGradeToPass: Number(neededGradeToPass.toFixed(2)),
    neededGradeToTarget: Number(neededGradeToTarget.toFixed(2)),
    isPassedAlready,
    isUnattainableToPass,
    isUnattainableToTarget,
    maxPossibleFinalGrade: Number(maxPossibleFinalGrade.toFixed(2)),
    minPossibleFinalGrade: Number(minPossibleFinalGrade.toFixed(2)),
  };
}

/**
 * Calcula el resumen general de todas las materias activas
 */
export function calculateAcademicSummary(subjects: Subject[]) {
  const activeSubjects = subjects.filter(s => !s.isCompleted);
  const historySubjects = subjects.filter(s => s.isCompleted);

  let totalCredits = 0;
  let weightedGradeSum = 0;
  let subjectsInRisk = 0;
  let subjectsPassed = 0;
  let subjectsAtTarget = 0;

  activeSubjects.forEach(sub => {
    totalCredits += sub.credits;
    const calc = calculateSubjectGrades(sub);
    weightedGradeSum += calc.currentAverageOverCompleted * sub.credits;

    if (calc.isUnattainableToPass || (calc.completedPercentage > 0 && calc.currentAverageOverCompleted < sub.minPassingGrade)) {
      subjectsInRisk++;
    }

    if (calc.isPassedAlready || (calc.completedPercentage === 100 && calc.currentAccumulated >= sub.minPassingGrade)) {
      subjectsPassed++;
    }

    if (calc.currentAverageOverCompleted >= sub.targetGrade) {
      subjectsAtTarget++;
    }
  });

  const overallAverage = totalCredits > 0 ? (weightedGradeSum / totalCredits) : 0;

  return {
    totalActive: activeSubjects.length,
    totalCompleted: historySubjects.length,
    totalCredits,
    overallAverage: Number(overallAverage.toFixed(2)),
    subjectsInRisk,
    subjectsPassed,
    subjectsAtTarget,
  };
}

export function formatGrade(grade: number | null | undefined, scaleMax: number = 5.0): string {
  if (grade === null || grade === undefined || isNaN(grade)) return '-.-';
  return grade.toFixed(scaleMax <= 10 ? 1 : 0);
}
