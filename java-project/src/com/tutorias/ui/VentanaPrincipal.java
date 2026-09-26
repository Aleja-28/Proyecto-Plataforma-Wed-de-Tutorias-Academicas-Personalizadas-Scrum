package com.tutorias.ui;

import com.tutorias.model.Estudiante;
import com.tutorias.model.Materia;
import com.tutorias.service.GeneradorTalleres;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;

/**
 * Ventana Principal de la aplicación en Java Swing para Eclipse.
 */
public class VentanaPrincipal extends JFrame {
    private static final long serialVersionUID = 1L;

    private Estudiante estudiante;
    private JTable tablaMaterias;
    private DefaultTableModel modeloTabla;
    private JLabel lblPromedio;
    private JLabel lblTotalCreditos;

    public VentanaPrincipal(Estudiante estudiante) {
        this.estudiante = estudiante;
        setTitle("Sistema de Tutorías Académicas & Monitoreo de Notas");
        setSize(950, 600);
        setMinimumSize(new Dimension(800, 500));
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout(10, 10));

        // 1. Panel Superior: Encabezado y Datos del Estudiante
        JPanel pnlHeader = crearPanelHeader();
        add(pnlHeader, BorderLayout.NORTH);

        // 2. Panel Central: Tabla de Materias y Métricas
        JPanel pnlCenter = crearPanelTabla();
        add(pnlCenter, BorderLayout.CENTER);

        // 3. Panel Inferior: Botones de Acción
        JPanel pnlFooter = crearPanelBotones();
        add(pnlFooter, BorderLayout.SOUTH);

        actualizarTabla();
    }

    private JPanel crearPanelHeader() {
        JPanel pnl = new JPanel(new BorderLayout(15, 10));
        pnl.setBackground(new Color(240, 249, 255)); // Azul clarito
        pnl.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createMatteBorder(0, 0, 1, 0, new Color(186, 230, 253)),
            BorderFactory.createEmptyBorder(15, 20, 15, 20)
        ));

        JPanel pnlInfo = new JPanel(new GridLayout(2, 1, 4, 4));
        pnlInfo.setOpaque(false);

        JLabel lblTitulo = new JLabel("Panel Académico Universitario");
        lblTitulo.setFont(new Font("Segoe UI", Font.BOLD, 18));
        lblTitulo.setForeground(new Color(12, 74, 110));

        JLabel lblSub = new JLabel("Estudiante: " + estudiante.getNombre() + " | " + estudiante.getCarrera() + " (" + estudiante.getSemestre() + ") - " + estudiante.getUniversidad());
        lblSub.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        lblSub.setForeground(new Color(51, 65, 85));

        pnlInfo.add(lblTitulo);
        pnlInfo.add(lblSub);

        JPanel pnlStats = new JPanel(new FlowLayout(FlowLayout.RIGHT, 15, 5));
        pnlStats.setOpaque(false);

        lblPromedio = new JLabel("Promedio: 0.00");
        lblPromedio.setFont(new Font("Segoe UI", Font.BOLD, 14));
        lblPromedio.setForeground(new Color(180, 83, 9)); // Tono ámbar/dorado
        lblPromedio.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(253, 230, 138), 1, true),
            BorderFactory.createEmptyBorder(6, 12, 6, 12)
        ));
        lblPromedio.setOpaque(true);
        lblPromedio.setBackground(new Color(254, 252, 232));

        lblTotalCreditos = new JLabel("Créditos: 0");
        lblTotalCreditos.setFont(new Font("Segoe UI", Font.BOLD, 12));

        pnlStats.add(lblTotalCreditos);
        pnlStats.add(lblPromedio);

        pnl.add(pnlInfo, BorderLayout.CENTER);
        pnl.add(pnlStats, BorderLayout.EAST);
        return pnl;
    }

    private JPanel crearPanelTabla() {
        JPanel pnl = new JPanel(new BorderLayout(5, 5));
        pnl.setBorder(BorderFactory.createEmptyBorder(0, 20, 0, 20));

        String[] columnas = {
            "Asignatura", "Código", "Créditos", "Dificultad", 
            "Acumulado", "% Restante", "Req. Aprobar", "Req. Meta", "Estado"
        };

        modeloTabla = new DefaultTableModel(columnas, 0) {
            private static final long serialVersionUID = 1L;
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };

        tablaMaterias = new JTable(modeloTabla);
        tablaMaterias.setRowHeight(28);
        tablaMaterias.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        tablaMaterias.getTableHeader().setFont(new Font("Segoe UI", Font.BOLD, 12));
        tablaMaterias.getTableHeader().setBackground(new Color(241, 245, 249));

        JScrollPane scroll = new JScrollPane(tablaMaterias);
        pnl.add(scroll, BorderLayout.CENTER);
        return pnl;
    }

    private JPanel crearPanelBotones() {
        JPanel pnl = new JPanel(new FlowLayout(FlowLayout.RIGHT, 12, 15));
        pnl.setBorder(BorderFactory.createEmptyBorder(0, 20, 10, 20));

        JButton btnNuevaMateria = new JButton("+ Registrar Materia");
        btnNuevaMateria.setFont(new Font("Segoe UI", Font.BOLD, 12));
        btnNuevaMateria.setBackground(new Color(14, 165, 233));
        btnNuevaMateria.setForeground(Color.WHITE);
        btnNuevaMateria.addActionListener(e -> abrirDialogoNuevaMateria());

        JButton btnGenerarTaller = new JButton("Generar Taller de Refuerzo");
        btnGenerarTaller.setFont(new Font("Segoe UI", Font.BOLD, 12));
        btnGenerarTaller.setBackground(new Color(245, 158, 11));
        btnGenerarTaller.setForeground(Color.WHITE);
        btnGenerarTaller.addActionListener(e -> generarTallerSeleccionado());

        JButton btnSimulador = new JButton("Simulador de Nota");
        btnSimulador.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        btnSimulador.addActionListener(e -> abrirSimulador());

        JButton btnEliminar = new JButton("Eliminar Materia");
        btnEliminar.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        btnEliminar.addActionListener(e -> eliminarMateriaSeleccionada());

        pnl.add(btnSimulador);
        pnl.add(btnEliminar);
        pnl.add(btnGenerarTaller);
        pnl.add(btnNuevaMateria);
        return pnl;
    }

    public void actualizarTabla() {
        modeloTabla.setRowCount(0);

        for (Materia m : estudiante.getMaterias()) {
            double reqAprobar = m.getNotaRequeridaParaAprobar();
            String strReqAprobar = reqAprobar <= 0 ? "Aprobada" : (reqAprobar > m.getEscalaMaxima() ? "Inalcanzable" : String.format("%.2f", reqAprobar));
            
            double reqMeta = m.getNotaRequeridaParaMeta();
            String strReqMeta = reqMeta <= 0 ? "Lograda" : (reqMeta > m.getEscalaMaxima() ? "Inalcanzable" : String.format("%.2f", reqMeta));

            Object[] fila = {
                m.getNombre(),
                m.getCodigo(),
                m.getCreditos(),
                m.getDificultad(),
                String.format("%.2f", m.getNotaAcumulada()),
                String.format("%.0f%%", m.getPorcentajeRestante()),
                strReqAprobar,
                strReqMeta,
                m.getEstadoAcademico()
            };
            modeloTabla.addRow(fila);
        }

        lblPromedio.setText(String.format("Promedio: %.2f", estudiante.getPromedioPonderado()));
        lblTotalCreditos.setText("Total Créditos: " + estudiante.getTotalCreditos());
    }

    private void abrirDialogoNuevaMateria() {
        DialogoNuevaMateria dlg = new DialogoNuevaMateria(this);
        dlg.setVisible(true);

        Materia nueva = dlg.getMateriaCreada();
        if (nueva != null) {
            estudiante.agregarMateria(nueva);
            actualizarTabla();
            JOptionPane.showMessageDialog(this, "Materia '" + nueva.getNombre() + "' registrada con éxito.", "Guardado", JOptionPane.INFORMATION_MESSAGE);
        }
    }

    private void generarTallerSeleccionado() {
        int fila = tablaMaterias.getSelectedRow();
        if (fila == -1) {
            JOptionPane.showMessageDialog(this, "Por favor selecciona una materia de la tabla para generar el taller.", "Seleccionar Materia", JOptionPane.WARNING_MESSAGE);
            return;
        }

        Materia m = estudiante.getMaterias().get(fila);
        String contenido = GeneradorTalleres.generarTallerTexto(m, estudiante.getNombre());
        DialogoTaller dlg = new DialogoTaller(this, m.getNombre(), contenido);
        dlg.setVisible(true);
    }

    private void abrirSimulador() {
        int fila = tablaMaterias.getSelectedRow();
        if (fila == -1) {
            JOptionPane.showMessageDialog(this, "Selecciona una materia para simular la nota faltante.", "Seleccionar Materia", JOptionPane.WARNING_MESSAGE);
            return;
        }

        Materia m = estudiante.getMaterias().get(fila);
        String entrada = JOptionPane.showInputDialog(this, "¿Qué nota final deseas obtener en " + m.getNombre() + "?", String.valueOf(m.getNotaObjetivo()));
        if (entrada != null && !entrada.trim().isEmpty()) {
            try {
                double metaDeseada = Double.parseDouble(entrada.trim());
                double restante = m.getPorcentajeRestante();
                if (restante <= 0) {
                    JOptionPane.showMessageDialog(this, "Esta materia ya tiene el 100% calificado.", "Sin porcentaje restante", JOptionPane.INFORMATION_MESSAGE);
                    return;
                }
                double necesaria = ((metaDeseada - m.getNotaAcumulada()) / restante) * 100.0;
                String mensaje = String.format("Para obtener una nota final de %.2f:\n\n" +
                                               "• Ponderación restante: %.0f%%\n" +
                                               "• Nota promedio requerida en los cortes restantes: %.2f / %.1f\n\n%s",
                                               metaDeseada, restante, necesaria, m.getEscalaMaxima(),
                                               necesaria > m.getEscalaMaxima() 
                                               ? "⚠️ Nota: Matemáticamente supera la escala máxima (5.0)."
                                               : necesaria <= 0 
                                               ? "✅ ¡Ya aseguraste esa nota con lo acumulado!" 
                                               : "🎯 ¡Objetivo alcanzable con dedicación y refuerzo!");
                JOptionPane.showMessageDialog(this, mensaje, "Resultado de Simulación", JOptionPane.INFORMATION_MESSAGE);
            } catch (NumberFormatException ex) {
                JOptionPane.showMessageDialog(this, "Ingresa un número válido.", "Error", JOptionPane.ERROR_MESSAGE);
            }
        }
    }

    private void eliminarMateriaSeleccionada() {
        int fila = tablaMaterias.getSelectedRow();
        if (fila == -1) {
            JOptionPane.showMessageDialog(this, "Selecciona la materia que deseas eliminar.", "Seleccionar", JOptionPane.WARNING_MESSAGE);
            return;
        }

        Materia m = estudiante.getMaterias().get(fila);
        int resp = JOptionPane.showConfirmDialog(this, "¿Estás seguro de eliminar '" + m.getNombre() + "'?", "Confirmar Eliminación", JOptionPane.YES_NO_OPTION);
        if (resp == JOptionPane.YES_OPTION) {
            estudiante.getMaterias().remove(fila);
            actualizarTabla();
        }
    }
}
