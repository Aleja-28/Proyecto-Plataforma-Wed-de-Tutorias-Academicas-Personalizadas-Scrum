package com.tutorias.model;

import java.io.Serializable;

/**
 * Representa un corte o periodo evaluativo de una materia.
 */
public class Corte implements Serializable {
    private static final long serialVersionUID = 1L;

    private String nombre;
    private double porcentaje; // ej: 30 para 30%
    private Double nota;       // null si aún no se ha calificado
    private String tipoEvaluacion; // ej: Parcial, Taller, Proyecto

    public Corte(String nombre, double porcentaje, Double nota, String tipoEvaluacion) {
        this.nombre = nombre;
        this.porcentaje = porcentaje;
        this.nota = nota;
        this.tipoEvaluacion = tipoEvaluacion;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public double getPorcentaje() {
        return porcentaje;
    }

    public void setPorcentaje(double porcentaje) {
        this.porcentaje = porcentaje;
    }

    public Double getNota() {
        return nota;
    }

    public void setNota(Double nota) {
        this.nota = nota;
    }

    public boolean estaCalificado() {
        return nota != null;
    }

    public String getTipoEvaluacion() {
        return tipoEvaluacion;
    }

    public void setTipoEvaluacion(String tipoEvaluacion) {
        this.tipoEvaluacion = tipoEvaluacion;
    }

    @Override
    public String toString() {
        return nombre + " (" + porcentaje + "%): " + (nota != null ? String.format("%.1f", nota) : "Pendiente");
    }
}
