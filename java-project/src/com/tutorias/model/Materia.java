package com.tutorias.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Representa una asignatura académica universitaria con sus cortes y cálculos.
 */
public class Materia implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String nombre;
    private String codigo;
    private int creditos;
    private String profesor;
    private String dificultad; // "Baja", "Media", "Alta"
    private double notaMinimaAprobatoria; // ej: 3.0
    private double notaObjetivo;          // ej: 4.0
    private double escalaMaxima;          // ej: 5.0
    private List<Corte> cortes;
    private List<String> temasDificiles;

    public Materia(String id, String nombre, String codigo, int creditos, String profesor, String dificultad, double notaMinima, double notaObjetivo) {
        this.id = id;
        this.nombre = nombre;
        this.codigo = codigo;
        this.creditos = creditos;
        this.profesor = profesor;
        this.dificultad = dificultad;
        this.notaMinimaAprobatoria = notaMinima;
        this.notaObjetivo = notaObjetivo;
        this.escalaMaxima = 5.0;
        this.cortes = new ArrayList<>();
        this.temasDificiles = new ArrayList<>();
    }

    public void agregarCorte(Corte corte) {
        this.cortes.add(corte);
    }

    public void agregarTemaDificil(String tema) {
        this.temasDificiles.add(tema);
    }

    /**
     * Calcula la nota ponderada acumulada hasta el momento.
     */
    public double getNotaAcumulada() {
        double acumulado = 0.0;
        for (Corte c : cortes) {
            if (c.estaCalificado()) {
                acumulado += c.getNota() * (c.getPorcentaje() / 100.0);
            }
        }
        return acumulado;
    }

    /**
     * Devuelve el porcentaje ya calificado (de 0 a 100).
     */
    public double getPorcentajeEvaluado() {
        double pct = 0.0;
        for (Corte c : cortes) {
            if (c.estaCalificado()) {
                pct += c.getPorcentaje();
            }
        }
        return pct;
    }

    /**
     * Devuelve el porcentaje pendiente por calificar.
     */
    public double getPorcentajeRestante() {
        return Math.max(0.0, 100.0 - getPorcentajeEvaluado());
    }

    /**
     * Calcula la nota promedio que el estudiante debe sacar en los cortes restantes para APROBAR.
     * Retorna 0.0 si ya aprobó matemáticamente, o un valor mayor a escalaMaxima si es inalcanzable.
     */
    public double getNotaRequeridaParaAprobar() {
        double restante = getPorcentajeRestante();
        double acumulado = getNotaAcumulada();

        if (acumulado >= notaMinimaAprobatoria) {
            return 0.0; // Ya aprobó
        }
        if (restante <= 0.001) {
            return 999.0; // Ya no hay porcentaje restante
        }

        double puntosFaltantes = notaMinimaAprobatoria - acumulado;
        return (puntosFaltantes / restante) * 100.0;
    }

    /**
     * Calcula la nota promedio que el estudiante debe sacar en los cortes restantes para alcanzar su META.
     */
    public double getNotaRequeridaParaMeta() {
        double restante = getPorcentajeRestante();
        double acumulado = getNotaAcumulada();

        if (acumulado >= notaObjetivo) {
            return 0.0;
        }
        if (restante <= 0.001) {
            return 999.0;
        }

        double puntosFaltantes = notaObjetivo - acumulado;
        return (puntosFaltantes / restante) * 100.0;
    }

    /**
     * Determina el estado del estudiante en la materia.
     */
    public String getEstadoAcademico() {
        double req = getNotaRequeridaParaAprobar();
        double restante = getPorcentajeRestante();

        if (getNotaAcumulada() >= notaMinimaAprobatoria) {
            return "¡Materia Aprobada!";
        }
        if (restante <= 0) {
            return "Materia Reprobada";
        }
        if (req > escalaMaxima) {
            return "Riesgo Crítico (Matemáticamente Inalcanzable)";
        }
        if (req > 4.0) {
            return "Riesgo Alto (Exige > 4.0)";
        }
        if (req > 3.0) {
            return "Alerta Media (Requiere > 3.0)";
        }
        return "Buen Camino";
    }

    // Getters y Setters
    public String getId() { return id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    public int getCreditos() { return creditos; }
    public void setCreditos(int creditos) { this.creditos = creditos; }
    public String getProfesor() { return profesor; }
    public void setProfesor(String profesor) { this.profesor = profesor; }
    public String getDificultad() { return dificultad; }
    public void setDificultad(String dificultad) { this.dificultad = dificultad; }
    public double getNotaMinimaAprobatoria() { return notaMinimaAprobatoria; }
    public void setNotaMinimaAprobatoria(double notaMinimaAprobatoria) { this.notaMinimaAprobatoria = notaMinimaAprobatoria; }
    public double getNotaObjetivo() { return notaObjetivo; }
    public void setNotaObjetivo(double notaObjetivo) { this.notaObjetivo = notaObjetivo; }
    public double getEscalaMaxima() { return escalaMaxima; }
    public List<Corte> getCortes() { return cortes; }
    public List<String> getTemasDificiles() { return temasDificiles; }
}
