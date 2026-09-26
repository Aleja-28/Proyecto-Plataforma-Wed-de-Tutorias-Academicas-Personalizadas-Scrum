package com.tutorias.service;

import com.tutorias.model.Materia;
import java.util.List;

/**
 * Genera talleres de refuerzo y guías de estudio personalizadas
 * basadas en los temas de mayor dificultad de la materia.
 */
public class GeneradorTalleres {

    public static String generarTallerTexto(Materia materia, String nombreEstudiante) {
        StringBuilder sb = new StringBuilder();

        sb.append("=========================================================================\n");
        sb.append("         TALLER DE REFUERZO ACADÉMICO PERSONALIZADO                    \n");
        sb.append("=========================================================================\n\n");
        sb.append("Estudiante: ").append(nombreEstudiante).append("\n");
        sb.append("Asignatura: ").append(materia.getNombre()).append(" (").append(materia.getCodigo()).append(")\n");
        sb.append("Profesor:   ").append(materia.getProfesor()).append("\n");
        sb.append("Dificultad: ").append(materia.getDificultad().toUpperCase()).append("\n");
        sb.append("Nota Acumulada Actual: ").append(String.format("%.2f", materia.getNotaAcumulada()))
          .append(" (").append(String.format("%.0f", materia.getPorcentajeEvaluado())).append("% evaluado)\n");

        double reqAprobar = materia.getNotaRequeridaParaAprobar();
        if (reqAprobar > 0 && reqAprobar <= materia.getEscalaMaxima()) {
            sb.append("META DE APROBACIÓN: Necesitas promediar mínimo ")
              .append(String.format("%.2f", reqAprobar))
              .append(" en el ").append(String.format("%.0f", materia.getPorcentajeRestante()))
              .append("% restante.\n");
        } else if (reqAprobar <= 0) {
            sb.append("ESTADO: ¡Ya has asegurado la nota mínima aprobatoria!\n");
        } else {
            sb.append("ALERTA: Se requiere tutoría urgente y revisión de cortes con el docente.\n");
        }

        sb.append("\n-------------------------------------------------------------------------\n");
        sb.append("SECCIÓN 1: TEMAS CRÍTICOS IDENTIFICADOS PARA REFUERZO\n");
        sb.append("-------------------------------------------------------------------------\n");

        List<String> temas = materia.getTemasDificiles();
        if (temas.isEmpty()) {
            sb.append(" • Repaso general de conceptos fundamentales del semestre.\n");
            sb.append(" • Resolución de problemas prácticos aplicados a situaciones reales.\n");
        } else {
            int num = 1;
            for (String t : temas) {
                sb.append(" ").append(num++).append(". ").append(t).append("\n");
            }
        }

        sb.append("\n-------------------------------------------------------------------------\n");
        sb.append("SECCIÓN 2: EJERCICIOS PRÁCTICOS PROPUESTOS\n");
        sb.append("-------------------------------------------------------------------------\n");
        sb.append("Ejercicio 1 (Nivel Conceptual):\n");
        sb.append(" Explica con tus propias palabras la base teórica del tema principal.\n");
        sb.append(" Elabora un mapa mental o diagrama de flujo relacionando las fórmulas clave.\n\n");

        sb.append("Ejercicio 2 (Nivel Aplicado):\n");
        sb.append(" Resuelve un caso típico planteado paso a paso, justificando cada operación matemática\n");
        sb.append(" o razonamiento lógico antes de calcular el resultado final.\n\n");

        sb.append("Ejercicio 3 (Nivel Desafío - Preparación para Parcial):\n");
        sb.append(" Simula condiciones de examen: resuelve un problema complejo en un tiempo límite de 25 minutos\n");
        sb.append(" sin consultar notas previas y verifica la solución contra la respuesta esperada.\n\n");

        sb.append("-------------------------------------------------------------------------\n");
        sb.append("SECCIÓN 3: ESTRATEGIA DE ESTUDIO RECOMENDADA\n");
        sb.append("-------------------------------------------------------------------------\n");
        sb.append("1. Técnica Pomodoro: 25 minutos de estudio activo + 5 minutos de descanso.\n");
        sb.append("2. Técnica Feynman: Explícale el ejercicio a un compañero o en voz alta sin mirar fórmulas.\n");
        sb.append("3. Asistencia a Tutorías Universitarias: Agenda sesión con el monitor antes del examen final.\n\n");
        sb.append("=========================================================================\n");
        sb.append("  Generado por el Sistema de Tutorías Académicas Personalizadas - 2026   \n");
        sb.append("=========================================================================\n");

        return sb.toString();
    }
}
