package com.tutorias;

import com.tutorias.model.Corte;
import com.tutorias.model.Estudiante;
import com.tutorias.model.Materia;
import com.tutorias.ui.VentanaPrincipal;

import javax.swing.SwingUtilities;
import javax.swing.UIManager;

/**
 * Clase principal que inicializa el sistema de tutorías y monitoreo de notas en Java para Eclipse.
 */
public class Main {

    public static void main(String[] args) {
        // Establecer Look and Feel nativo del sistema operativo
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception ignored) {
        }

        SwingUtilities.invokeLater(() -> {
            Estudiante estudiante = crearDatosIniciales();
            VentanaPrincipal ventana = new VentanaPrincipal(estudiante);
            ventana.setVisible(true);
        });
    }

    private static Estudiante crearDatosIniciales() {
        Estudiante est = new Estudiante(
            "Camila Rodríguez",
            "camila.rodriguez@universidad.edu.co",
            "Universidad Nacional",
            "Ingeniería de Sistemas",
            "4to Semestre"
        );

        // 1. Materia: Cálculo Diferencial
        Materia m1 = new Materia("1", "Cálculo Diferencial", "MAT-201", 4, "Dr. Alejandro Morales", "Alta", 3.0, 4.2);
        m1.agregarCorte(new Corte("Corte 1", 30.0, 2.8, "Parcial"));
        m1.agregarCorte(new Corte("Corte 2", 35.0, 3.4, "Talleres y Quices"));
        m1.agregarCorte(new Corte("Corte 3 Final", 35.0, null, "Examen Final")); // Pendiente
        m1.agregarTemaDificil("Límites indeterminados y regla de L'Hôpital");
        m1.agregarTemaDificil("Optimización y máximos/mínimos con derivadas");
        est.agregarMateria(m1);

        // 2. Materia: Física Mecánica
        Materia m2 = new Materia("2", "Física Mecánica", "FIS-102", 3, "Dra. Marcela Valencia", "Media", 3.0, 3.8);
        m2.agregarCorte(new Corte("Corte 1", 30.0, 3.9, "Laboratorios y Parcial"));
        m2.agregarCorte(new Corte("Corte 2", 35.0, 3.5, "Cinemática y Dinámica"));
        m2.agregarCorte(new Corte("Corte 3 Final", 35.0, null, "Trabajo Final"));
        m2.agregarTemaDificil("Leyes de Newton en planos inclinados con fricción");
        m2.agregarTemaDificil("Conservación de la energía mecánica");
        est.agregarMateria(m2);

        // 3. Materia: Estructuras de Datos
        Materia m3 = new Materia("3", "Estructuras de Datos", "SIS-205", 3, "Ing. Roberto Gómez", "Alta", 3.0, 4.5);
        m3.agregarCorte(new Corte("Corte 1", 30.0, 4.4, "Listas y Pilas"));
        m3.agregarCorte(new Corte("Corte 2", 35.0, 4.0, "Árboles Binarios"));
        m3.agregarCorte(new Corte("Corte 3 Final", 35.0, null, "Proyecto Final y Grafos"));
        m3.agregarTemaDificil("Árboles AVL y balanceo");
        m3.agregarTemaDificil("Algoritmos de Dijkstra en Grafos");
        est.agregarMateria(m3);

        return est;
    }
}
