package com.tutorias.ui;

import javax.swing.*;
import java.awt.*;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

/**
 * Muestra el taller de refuerzo generado y permite guardarlo en disco.
 */
public class DialogoTaller extends JDialog {
    private static final long serialVersionUID = 1L;

    public DialogoTaller(Frame parent, String tituloMateria, String contenidoTaller) {
        super(parent, "Taller de Refuerzo: " + tituloMateria, true);
        setSize(650, 520);
        setLocationRelativeTo(parent);
        setLayout(new BorderLayout(10, 10));

        JTextArea areaTexto = new JTextArea(contenidoTaller);
        areaTexto.setFont(new Font("Monospaced", Font.PLAIN, 12));
        areaTexto.setEditable(false);
        areaTexto.setMargin(new Insets(10, 10, 10, 10));

        JScrollPane scroll = new JScrollPane(areaTexto);
        add(scroll, BorderLayout.CENTER);

        JPanel pnlBotones = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 10));
        JButton btnCopiar = new JButton("Copiar al Portapapeles");
        btnCopiar.addActionListener(e -> {
            areaTexto.selectAll();
            areaTexto.copy();
            JOptionPane.showMessageDialog(this, "¡Taller copiado al portapapeles!", "Copiado", JOptionPane.INFORMATION_MESSAGE);
        });

        JButton btnExportar = new JButton("Guardar como Archivo (.txt)");
        btnExportar.addActionListener(e -> {
            JFileChooser chooser = new JFileChooser();
            chooser.setSelectedFile(new File("Taller_" + tituloMateria.replaceAll("\\s+", "_") + ".txt"));
            if (chooser.showSaveDialog(this) == JFileChooser.APPROVE_OPTION) {
                try (FileWriter fw = new FileWriter(chooser.getSelectedFile())) {
                    fw.write(contenidoTaller);
                    JOptionPane.showMessageDialog(this, "Taller guardado exitosamente.", "Éxito", JOptionPane.INFORMATION_MESSAGE);
                } catch (IOException ex) {
                    JOptionPane.showMessageDialog(this, "Error al guardar: " + ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
                }
            }
        });

        JButton btnCerrar = new JButton("Cerrar");
        btnCerrar.addActionListener(e -> dispose());

        pnlBotones.add(btnCopiar);
        pnlBotones.add(btnExportar);
        pnlBotones.add(btnCerrar);
        add(pnlBotones, BorderLayout.SOUTH);
    }
}
