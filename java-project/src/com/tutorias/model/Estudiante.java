package com.tutorias.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Modelo del estudiante universitario.
 */
public class Estudiante implements Serializable {
    private static final long serialVersionUID = 1L;

    private String nombre;
    private String email;
    private String universidad;
    private String carrera;
    private String semestre;
    private List<Materia> materias;

    public Estudiante(String nombre, String email, String universidad, String carrera, String semestre) {
        this.nombre = nombre;
        this.email = email;
        this.universidad = universidad;
        this.carrera = carrera;
        this.semestre = semestre;
        this.materias = new ArrayList<>();
    }

    public void agregarMateria(Materia m) {
        this.materias.add(m);
    }

    public double getPromedioPonderado() {
        if (materias.isEmpty()) return 0.0;
        double sumaPuntos = 0.0;
        int totalCreditos = 0;

        for (Materia m : materias) {
            double notaEstimada = m.getPorcentajeEvaluado() > 0 
                ? (m.getNotaAcumulada() / (m.getPorcentajeEvaluado() / 100.0))
                : 0.0;
            sumaPuntos += (notaEstimada * m.getCreditos());
            totalCreditos += m.getCreditos();
        }

        return totalCreditos > 0 ? (sumaPuntos / totalCreditos) : 0.0;
    }

    public int getTotalCreditos() {
        int total = 0;
        for (Materia m : materias) {
            total += m.getCreditos();
        }
        return total;
    }

    // Getters y Setters
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getUniversidad() { return universidad; }
    public void setUniversidad(String universidad) { this.universidad = universidad; }
    public String getCarrera() { return carrera; }
    public void setCarrera(String carrera) { this.carrera = carrera; }
    public String getSemestre() { return semestre; }
    public void setSemestre(String semestre) { this.semestre = semestre; }
    public List<Materia> getMaterias() { return materias; }
}
