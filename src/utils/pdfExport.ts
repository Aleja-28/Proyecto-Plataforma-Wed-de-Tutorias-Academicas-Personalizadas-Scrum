import jsPDF from 'jspdf';
import { Workshop, Subject } from '../types';
import { calculateSubjectGrades } from './gradeCalculations';

export function exportWorkshopToPDF(workshop: Workshop, subject: Subject): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const calc = calculateSubjectGrades(subject);
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  let y = margin;

  // Header Bar en Azul Clarito y Acento Amarillo
  // Color primario azul cielo: RGB(14, 165, 233) -> #0ea5e9
  doc.setFillColor(14, 165, 233);
  doc.rect(0, 0, pageWidth, 24, 'F');

  // Acento amarillo dorado: RGB(245, 158, 11) -> #f59e0b
  doc.setFillColor(245, 158, 11);
  doc.rect(0, 24, pageWidth, 3, 'F');

  // Título cabecera
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('TUTORÍAS ACADÉMICAS PERSONALIZADAS', margin, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Taller de Refuerzo Académico & Nivelación Diagnóstica', margin, 18);

  // Fecha cabecera derecha
  doc.setFontSize(8);
  doc.text(`Generado: ${workshop.generatedDate}`, pageWidth - margin - 40, 15);

  y = 36;

  // Caja de Información de Materia y Estudiante
  doc.setFillColor(240, 249, 255); // sky-50
  doc.setDrawColor(186, 230, 253); // sky-200
  doc.roundedRect(margin, y, pageWidth - (margin * 2), 26, 3, 3, 'FD');

  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`Materia: ${workshop.subjectName}`, margin + 4, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Estudiante: ${workshop.studentName}`, margin + 4, y + 13);
  doc.text(`Nivel de Dificultad: ${subject.difficulty.toUpperCase()} | Créditos: ${subject.credits}`, margin + 4, y + 19);

  // Columna derecha de la caja con notas
  const rightX = pageWidth / 2 + 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Diagnóstico de Calificaciones:', rightX, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nota acumulada actual: ${calc.currentAccumulated.toFixed(2)} / ${subject.scaleMax.toFixed(1)} (${calc.completedPercentage}% calificado)`, rightX, y + 13);
  
  // Nota necesaria
  if (calc.isPassedAlready) {
    doc.setTextColor(22, 101, 52);
    doc.text('¡Materia ya aprobada con el acumulado!', rightX, y + 19);
  } else if (calc.isUnattainableToPass) {
    doc.setTextColor(185, 28, 28);
    doc.text(`¡ALERTA! Requiere ${calc.neededGradeToPass.toFixed(2)} (Tope: ${subject.scaleMax.toFixed(1)})`, rightX, y + 19);
  } else {
    doc.setTextColor(3, 105, 161);
    doc.text(`Nota requerida para aprobar (${subject.minPassingGrade.toFixed(1)}): ${calc.neededGradeToPass.toFixed(2)} en lo restante`, rightX, y + 19);
  }

  y += 32;

  // Temas de mayor dificultad abordados
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('TEMAS DE REFUERZO PRIORITARIOS (MAYOR DIFICULTAD):', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const topicsText = workshop.targetTopics.length > 0 
    ? workshop.targetTopics.map((t, i) => `${i + 1}. ${t}`).join('  |  ')
    : 'Fundamentos generales del curso';
  
  const splitTopics = doc.splitTextToSize(topicsText, pageWidth - (margin * 2));
  doc.text(splitTopics, margin, y);
  y += (splitTopics.length * 4.5) + 4;

  // Resumen Conceptual
  doc.setFillColor(254, 243, 199); // amber-100
  doc.setDrawColor(251, 191, 36); // amber-400
  doc.roundedRect(margin, y, pageWidth - (margin * 2), 16, 2, 2, 'FD');
  
  doc.setTextColor(146, 64, 14); // amber-800
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('CONSEJO DE TUTORÍA:', margin + 4, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const tipText = doc.splitTextToSize(
    'Enfoca tu tiempo de estudio en los ejercicios intermedios y avanzados. Comprueba el desarrollo analítico paso a paso sin omitir pasos algebraicos. Pregunta a tu tutor cualquier duda sobre la regla de signos y condiciones de frontera.',
    pageWidth - (margin * 2) - 8
  );
  doc.text(tipText, margin + 4, y + 10);

  y += 22;

  // Sección de Ejercicios
  doc.setTextColor(14, 165, 233);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('EJERCICIOS PRÁCTICOS DE REFUERZO', margin, y);
  y += 6;

  workshop.exercises.forEach((ex, index) => {
    // Si se pasa de la página, crear nueva página
    if (y > pageHeight - 35) {
      doc.addPage();
      y = margin;
      
      // Header mini en nueva página
      doc.setFillColor(14, 165, 233);
      doc.rect(0, 0, pageWidth, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text(`Taller de Refuerzo: ${workshop.subjectName} - Continuación`, margin, 5.5);
      y += 12;
    }

    // Caja de Ejercicio
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(226, 232, 240); // slate-200
    
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    
    const diffBadge = `[Nivel: ${ex.difficulty.toUpperCase()}]`;
    doc.text(`Ejercicio #${index + 1} (${ex.topicName}) ${diffBadge}`, margin, y);
    y += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);

    const questionLines = doc.splitTextToSize(ex.question, pageWidth - (margin * 2));
    doc.text(questionLines, margin, y);
    y += (questionLines.length * 4.2) + 2;

    // Pista pedagógica
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    const hintLines = doc.splitTextToSize(`Pista orientadora: ${ex.hint}`, pageWidth - (margin * 2));
    doc.text(hintLines, margin, y);
    y += (hintLines.length * 3.8) + 6;

    // Espacio punteado para solución del estudiante
    doc.setDrawColor(203, 213, 225);
    doc.setLineDashPattern([1, 2], 0);
    doc.line(margin, y, pageWidth - margin, y);
    y += 4;
    doc.line(margin, y, pageWidth - margin, y);
    y += 7;
    doc.setLineDashPattern([], 0); // restablecer línea normal
  });

  // Footer en todas las páginas
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`Página ${i} de ${pageCount} | Plataforma Web de Tutorías Académicas Personalizadas`, margin, pageHeight - 8);
    doc.text('Desarrollado para éxito académico estudiantil', pageWidth - margin - 55, pageHeight - 8);
  }

  // Descargar PDF
  const safeFilename = `Taller_Refuerzo_${workshop.subjectName.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
  doc.save(safeFilename);
}
