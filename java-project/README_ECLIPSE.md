# Guía de Ejecución en Eclipse IDE - Sistema de Tutorías Académicas (Java Swing)

Este proyecto está preparado para ser ejecutado en **Eclipse IDE** sin necesidad de configurar librerías externas complejas, utilizando **Java estándar (Java 8, 11, 17 o 21)** y **Java Swing**.

---

## 🚀 Pasos para Crear y Ejecutar el Proyecto en Eclipse

### Paso 1: Crear un nuevo proyecto en Eclipse
1. Abre **Eclipse IDE**.
2. En el menú superior, selecciona **File > New > Java Project**.
3. En **Project name**, escribe: `TutoriasAcademicas`.
4. En **Execution environment JRE**, selecciona cualquier versión disponible (JavaSE-11, JavaSE-17, JavaSE-21 o JavaSE-1.8).
5. Si te pregunta si deseas crear `module-info.java`, marca **"Don't Create"**.
6. Haz clic en **Finish**.

### Paso 2: Copiar los paquetes y archivos a la carpeta `src`
Dentro de la carpeta `src` de tu nuevo proyecto en Eclipse, copia o crea los paquetes y clases correspondientes:

```text
src/
 ├── com.tutorias/
 │    └── Main.java                      <- Punto de entrada (public static void main)
 ├── com.tutorias.model/
 │    ├── Corte.java                     <- Modelo de cada corte evaluativo y porcentaje
 │    ├── Materia.java                   <- Modelo de la asignatura y fórmulas matemáticas
 │    └── Estudiante.java                <- Modelo del perfil del estudiante y promedio ponderado
 ├── com.tutorias.service/
 │    └── GeneradorTalleres.java         <- Generador de talleres y ejercicios de refuerzo
 └── com.tutorias.ui/
      ├── VentanaPrincipal.java          <- Interfaz gráfica principal con tabla de notas
      ├── DialogoNuevaMateria.java       <- Formulario emergente para registrar materias
      └── DialogoTaller.java             <- Visor y exportador de guías de estudio
```

### Paso 3: Ejecutar la Aplicación
1. En el explorador de paquetes de Eclipse (*Package Explorer*), despliega la carpeta `src/com.tutorias/`.
2. Haz clic derecho sobre **`Main.java`**.
3. Selecciona **Run As > Java Application**.
4. ¡Listo! Se abrirá la ventana gráfica con tus materias precargadas, cálculo de promedio ponderado, nota mínima necesaria para aprobar, simulación y generador de talleres.

---

## 🎯 Características Académicas del Proyecto

1. **Arquitectura Limpia (MVC)**:
   - **Modelo (`com.tutorias.model`)**: Encapsula datos y reglas de negocio académicas (`Materia`, `Corte`, `Estudiante`).
   - **Servicios (`com.tutorias.service`)**: Algoritmo de generación de talleres y guías de estudio según temas difíciles.
   - **Vista/Controlador (`com.tutorias.ui`)**: Componentes de interfaz gráfica en Java Swing (`JFrame`, `JTable`, `JDialog`, `JScrollPane`).
2. **Cálculos Matemáticos Universitarios**:
   - `getNotaAcumulada()`: Ponderación de cortes evaluados.
   - `getPorcentajeRestante()`: Porcentaje pendiente por calificar.
   - `getNotaRequeridaParaAprobar()`: Nota exacta que el estudiante debe promediar para alcanzar la aprobación (3.0 o configurable).
   - `getPromedioPonderado()`: Promedio ponderado por número de créditos de cada materia.
3. **Persistencia y Exportación**:
   - Botón para exportar el taller de refuerzo generado a un archivo de texto `.txt` directamente en tu disco.
