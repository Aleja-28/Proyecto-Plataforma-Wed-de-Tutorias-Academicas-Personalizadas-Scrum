import { 
  Subject, 
  GradeCalculationResult, 
  CutProgress, 
  SubjectProgressAnalysis, 
  TrendType 
} from '../types';

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
    neededGradeToPass = 0;
    neededGradeToTarget = 0;
  }

  const isPassedAlready = currentAccumulated >= minPassing;
  const isUnattainableToPass = !isPassedAlready && (neededGradeToPass > scaleMax);
  const isUnattainableToTarget = (neededGradeToTarget > scaleMax);

  const maxPossibleFinalGrade = Math.min(scaleMax, currentAccumulated + (remainingWeight * scaleMax));
  const minPossibleFinalGrade = currentAccumulated;

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

export function analyzeSubjectProgress(subject: Subject): SubjectProgressAnalysis {
  const cuts = subject.cuts || [];
  const calc = calculateSubjectGrades(subject);
  
  const cutsProgress: CutProgress[] = [];
  let previousGraded: { grade: number; name: string } | null = null;
  let hasRegressed = false;
  let regressionCutName: string | undefined;
  let regressionAmount: number | undefined;
  let lastDelta: number | null = null;
  let overallTrend: TrendType = 'inicial';

  for (let index = 0; index < cuts.length; index++) {
    const cut = cuts[index];
    const isGraded = cut.grade !== null && cut.grade !== undefined && !isNaN(cut.grade);
    let delta: number | null = null;
    let trend: TrendType = 'inicial';

    if (isGraded) {
      if (previousGraded !== null) {
        delta = Number((cut.grade! - previousGraded.grade).toFixed(2));
        lastDelta = delta;

        if (delta > 0.05) {
          trend = 'ascenso';
          overallTrend = 'ascenso';
        } else if (delta < -0.05) {
          trend = 'retroceso';
          overallTrend = 'retroceso';
          hasRegressed = true;
          regressionCutName = cut.name;
          regressionAmount = delta;
        } else {
          trend = 'estable';
          if (overallTrend !== 'retroceso') {
            overallTrend = 'estable';
          }
        }
      } else {
        trend = 'inicial';
        overallTrend = 'inicial';
      }

      previousGraded = { grade: cut.grade!, name: cut.name };
    }

    const topicsCount = cut.topics?.length || 0;
    const difficultTopicsCount = cut.topics?.filter(t => t.isDifficult).length || 0;

    cutsProgress.push({
      cutIndex: index + 1,
      cutName: cut.name,
      percentage: cut.percentage,
      grade: cut.grade,
      evaluationType: cut.evaluationType,
      evaluationDetails: cut.evaluationDetails,
      deltaFromPrevious: delta,
      trend,
      topicsCount,
      difficultTopicsCount,
    });
  }

  const gradedCutsCount = cutsProgress.filter(c => c.grade !== null).length;

  let statusRecommendation = '';
  if (calc.isPassedAlready) {
    statusRecommendation = '¡Aprobación asegurada! Ya acumulaste los puntos necesarios para pasar.';
  } else if (calc.isUnattainableToPass) {
    statusRecommendation = 'Alerta crítica: Se requiere asesoría docente urgente o plan de nivelación.';
  } else if (hasRegressed) {
    statusRecommendation = `Atención: Hubo un retroceso de ${Math.abs(regressionAmount || 0).toFixed(1)} puntos en ${regressionCutName || 'el último corte'}. Concéntrate en los temas marcados como difíciles.`;
  } else if (overallTrend === 'ascenso') {
    statusRecommendation = `¡Excelente ritmo! Mostraste una mejora de +${(lastDelta || 0).toFixed(1)} puntos. Mantén la disciplina para asegurar tu nota meta.`;
  } else if (gradedCutsCount === 1) {
    statusRecommendation = 'Línea base registrada en el primer corte. Mantén el enfoque en los siguientes cortes.';
  } else {
    statusRecommendation = 'Rendimiento estable. Continúa con los talleres para consolidar tus notas.';
  }

  return {
    subject,
    completedPercentage: calc.completedPercentage,
    gradedCutsCount,
    totalCutsCount: cuts.length,
    overallTrend,
    lastDelta,
    cutsProgress,
    hasRegressed,
    regressionCutName,
    regressionAmount,
    currentAccumulated: calc.currentAccumulated,
    currentAverage: calc.currentAverageOverCompleted,
    isPassedAlready: calc.isPassedAlready,
    isUnattainableToPass: calc.isUnattainableToPass,
    neededToPass: calc.neededGradeToPass,
    neededToTarget: calc.neededGradeToTarget,
    statusRecommendation,
  };
}

export function calculateStudentProgressOverview(subjects: Subject[]) {
  const activeSubjects = subjects.filter(s => !s.isCompleted);
  const analyses = activeSubjects.map(analyzeSubjectProgress);

  let totalPossiblePercentage = activeSubjects.length * 100;
  let totalCompletedPercentage = 0;
  let totalCutsCount = 0;
  let totalGradedCutsCount = 0;

  let countAscenso = 0;
  let countRetroceso = 0;
  let countEstable = 0;
  let countCritico = 0;

  analyses.forEach(a => {
    totalCompletedPercentage += a.completedPercentage;
    totalCutsCount += a.totalCutsCount;
    totalGradedCutsCount += a.gradedCutsCount;

    if (a.isUnattainableToPass) {
      countCritico++;
    } else if (a.hasRegressed) {
      countRetroceso++;
    } else if (a.overallTrend === 'ascenso') {
      countAscenso++;
    } else {
      countEstable++;
    }
  });

  const overallSemesterProgressPercent = totalPossiblePercentage > 0
    ? Math.round((totalCompletedPercentage / totalPossiblePercentage) * 100)
    : 0;

  return {
    totalSubjects: activeSubjects.length,
    overallSemesterProgressPercent,
    totalCutsCount,
    totalGradedCutsCount,
    countAscenso,
    countRetroceso,
    countEstable,
    countCritico,
    analyses,
  };
}
