package com.tutorias.ui;

import com.tutorias.model.Corte;
import com.tutorias.model.Materia;

import javax.swing.*;
import java.awt.*;
import java.util.UUID;

/**
 * Diálogo para registrar una nueva materia con sus notas de corte y ponderaciones.
 */
public class DialogoNuevaMateria extends JDialog {
    private static final long serialVersionUID = 1L;

    private JTextField txtNombre;
    private JTextField txtCodigo;
    private JSpinner spCreditos;
    private JTextField txtProfesor;
    private JComboBox<String> cbDificultad;
    private JTextField txtNotaMinima;
    private JTextField txtNotaMeta;

    // Cortes
    private JTextField txtNotaC1, txtPctC1;
    private JTextField txtNotaC2, txtPctC2;
    private JTextField txtNotaC3, txtPctC3;
    private JTextField txtTemas;

    private Materia materiaCreada = null;

    public DialogoNuevaMateria(Frame parent) {
        super(parent, "Registrar Nueva Asignatura", true);
        setSize(520, 600);
        setLocationRelativeTo(parent);
        setLayout(new BorderLayout(10, 10));

        JPanel pnlForm = new JPanel(new GridLayout(0, 2, 8, 8));
        pnlForm.setBorder(BorderFactory.createEmptyBorder(15, 15, 15, 15));

        pnlForm.add(new JLabel("Nombre de la Materia:"));
        txtNombre = new JTextField("Cálculo Vectorial");
        pnlForm.add(txtNombre);

        pnlForm.add(new JLabel("Código:"));
        txtCodigo = new JTextField("MAT-301");
        pnlForm.add(txtCodigo);

        pnlForm.add(new JLabel("Créditos Académicos:"));
        spCreditos = new JSpinner(new SpinnerNumberModel(3, 1, 10, 1));
        pnlForm.add(spCreditos);

        pnlForm.add(new JLabel("Docente / Tutor:"));
        txtProfesor = new JTextField("Ing. Carlos Mendoza");
        pnlForm.add(txtProfesor);

        pnlForm.add(new JLabel("Nivel de Dificultad:"));
        cbDificultad = new JComboBox<>(new String[]{"Alta", "Media", "Baja"});
        cbDificultad.setSelectedItem("Alta");
        pnlForm.add(cbDificultad);

        pnlForm.add(new JLabel("Nota Mínima Aprobatoria:"));
        txtNotaMinima = new JTextField("3.0");
        pnlForm.add(txtNotaMinima);

        pnlForm.add(new JLabel("Nota Meta Deseada:"));
        txtNotaMeta = new JTextField("4.0");
        pnlForm.add(txtNotaMeta);

        // Separador de cortes
        pnlForm.add(new JLabel("--- CORTES EVALUATIVOS ---"));
        pnlForm.add(new JLabel("--- NOTAS (Dejar vacío si pendiente) ---"));

        pnlForm.add(new JLabel("Corte 1 (% Ponderación):"));
        txtPctC1 = new JTextField("30");
        pnlForm.add(txtPctC1);
        pnlForm.add(new JLabel("Nota Corte 1 (ej: 3.2):"));
        txtNotaC1 = new JTextField("3.2");
        pnlForm.add(txtNotaC1);

        pnlForm.add(new JLabel("Corte 2 (% Ponderación):"));
        txtPctC2 = new JTextField("35");
        pnlForm.add(txtPctC2);
        pnlForm.add(new JLabel("Nota Corte 2:"));
        txtNotaC2 = new JTextField("2.7");
        pnlForm.add(txtNotaC2);

        pnlForm.add(new JLabel("Corte 3 Final (% Ponderación):"));
        txtPctC3 = new JTextField("35");
        pnlForm.add(txtPctC3);
        pnlForm.add(new JLabel("Nota Corte 3 (o en blanco):"));
        txtNotaC3 = new JTextField(""); // Pendiente
        pnlForm.add(txtNotaC3);

        pnlForm.add(new JLabel("Temas difíciles (separados por coma):"));
        txtTemas = new JTextField("Integrales triples, Teorema de Stokes");
        pnlForm.add(txtTemas);

        add(pnlForm, BorderLayout.CENTER);

        // Botones
        JPanel pnlBotones = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 10));
        JButton btnCancelar = new JButton("Cancelar");
        btnCancelar.addActionListener(e -> dispose());
        
        JButton btnGuardar = new JButton("Guardar Materia");
        btnGuardar.setBackground(new Color(14, 165, 233));
        btnGuardar.setForeground(Color.WHITE);
        btnGuardar.addActionListener(e -> guardarMateria());

        pnlBotones.add(btnCancelar);
        pnlBotones.add(btnGuardar);
        add(pnlBotones, BorderLayout.SOUTH);
    }

    private void guardarMateria() {
        try {
            String nombre = txtNombre.getText().trim();
            if (nombre.isEmpty()) {
                JOptionPane.showMessageDialog(this, "El nombre de la materia es obligatorio.", "Campo Requerido", JOptionPane.WARNING_MESSAGE);
                return;
            }

            int creditos = (Integer) spCreditos.getValue();
            double notaMinima = Double.parseDouble(txtNotaMinima.getText().trim());
            double notaMeta = Double.parseDouble(txtNotaMeta.getText().trim());

            Materia m = new Materia(
                UUID.randomUUID().toString(),
                nombre,
                txtCodigo.getText().trim(),
                creditos,
                txtProfesor.getText().trim(),
                (String) cbDificultad.getSelectedItem(),
                notaMinima,
                notaMeta
            );

            // Agregar cortes
            agregarCorteSiValido(m, "Corte 1", txtPctC1.getText(), txtNotaC1.getText(), "Parcial");
            agregarCorteSiValido(m, "Corte 2", txtPctC2.getText(), txtNotaC2.getText(), "Talleres y Quices");
            agregarCorteSiValido(m, "Corte 3 Final", txtPctC3.getText(), txtNotaC3.getText(), "Examen Final");

            // Temas
            String temas = txtTemas.getText().trim();
            if (!temas.isEmpty()) {
                for (String t : temas.split(",")) {
                    if (!t.trim().isEmpty()) {
                        m.agregarTemaDificil(t.trim());
                    }
                }
            }

            this.materiaCreada = m;
            dispose();

        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this, "Por favor verifica que las notas y porcentajes sean números válidos.", "Error de Formato", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void agregarCorteSiValido(Materia m, String nombreCorte, String strPct, String strNota, String tipo) {
        if (strPct == null || strPct.trim().isEmpty()) return;
        double pct = Double.parseDouble(strPct.trim());
        Double nota = null;
        if (strNota != null && !strNota.trim().isEmpty()) {
            nota = Double.parseDouble(strNota.trim());
        }
        m.agregarCorte(new Corte(nombreCorte, pct, nota, tipo));
    }

    public Materia getMateriaCreada() {
        return materiaCreada;
    }
}
