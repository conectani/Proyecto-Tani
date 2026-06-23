# Informe de Despliegue, Calidad de Código e Integración Continua (Hito 3)
**Proyecto:** ConnecTani - Aplicación móvil multiplataforma para la gestión de registros clínicos materno-infantiles  
**Institución:** Universidad Tecnológica del Perú (UTP)  
**Curso:** Herramientas de Desarrollo  

---

## 1. Justificación Técnica del Cambio de Stack y Cuadro de Equivalencias

Con la respectiva aprobación del docente, el equipo de desarrollo realizó una migración estratégica del stack tecnológico originalmente planteado en Java hacia un entorno moderno basado en **React Native con Expo Go**. Esta decisión responde a la necesidad de optimizar los recursos de desarrollo, garantizar la portabilidad nativa en dispositivos iOS y Android con una única base de código, y facilitar el despliegue del personal de salud en las actividades de campo de la Asociación Taller de los Niños (TANI) en San Juan de Lurigancho.

Para dar cumplimiento estricto a los criterios de calidad y automatización exigidos en la rúbrica de evaluación, se detalla a continuación el cuadro formal de equivalencias herramientas-tecnológicas aplicadas en este hito:

| Criterio de la Rúbrica | Herramienta Original (Java) | Herramienta Implementada (React Native / JS) | Justificación Técnica |
| :--- | :--- | :--- | :--- |
| **Pruebas Unitarias** | JUnit | **Jest** | Framework de pruebas en JavaScript diseñado con enfoque en la simplicidad y óptimo rendimiento para componentes de React Native. |
| **Cobertura de Código** | JaCoCo | **Istanbul (con reportero LCOV)** | Herramienta de análisis que se integra nativamente con Jest para rastrear enunciados, ramas y líneas de código, generando reportes en formato LCOV compatibles con analizadores en la nube. |
| **Automatización (CI/CD)** | Jenkins | **GitHub Actions** | Plataforma de automatización nativa de GitHub que permite ejecutar flujos de trabajo (pipelines) basados en eventos directamente en la nube, reduciendo la necesidad de servidores locales de integración. |

---

## 2. Bitácora del War Room (Simulación de Crisis - Laboratorio 12)

Ante un incidente crítico detectado en el entorno de producción que afectaba la persistencia de datos de los beneficiarios de la Asociación Taller de los Niños, el equipo técnico se constituyó en un "War Room" virtual para aplicar la metodología de gestión de incidentes ITSM. 

A continuación se presenta el historial estructurado de la sesión de crisis bajo el formato obligatorio `[HH:MM — Decisión — Responsable]`:

*   **19:00 — Detección del Incidente — Alfredo Huchupe**  
    El área de soporte de TI detecta una saturación inusual y bloqueos en la base de datos de Supabase. De forma inmediata, se abre el ticket de Incidente Mayor con Prioridad Alta/Crítica **INC-109** titulado: *"Error de persistencia y concurrencia en la confirmación de citas de telemedicina"*.
*   **19:15 — Análisis Técnico — Rodrigo Mallqui**  
    Se analizan los logs del motor PostgreSQL en Supabase y se detecta un escenario de *Deadlock* concurrente en la tabla de citas. El incidente se escala formalmente al tablero de desarrollo como un Bug prioritario bajo el código **BUG-042**: *"Optimizar lógica de concurrencia y bloqueos en tabla citas de Supabase"*, vinculándolo a la causa raíz de la alerta original.
*   **19:40 — Desarrollo del Parche — Rodrigo Mallqui**  
    Se toma la decisión de aislar el entorno afectado y se levanta de inmediato la rama de desarrollo seguro `bugfix/BUG-042-supabase-concurrency-lock` para codificar la solución técnica e implementar los bloqueos optimistas requeridos.
*   **20:15 — Pruebas Unitarias QA — Wilver Martinez**  
    Como encargado de asegurar la estabilidad, se valida la suite de pruebas locales ejecutando sentencias bajo el entorno de **Jest**. Se verifica de forma exhaustiva que los nuevos componentes lógicos de la persistencia pasen las aserciones sin romper funcionalidades previas, asegurando una cobertura limpia.
*   **20:45 — Despliegue Exitoso — Rodrigo Mallqui / Alfredo Huchupe**  
    Se abre el Pull Request hacia la rama de integración. El Pipeline automatizado de **GitHub Actions** se dispara, validando los análisis estáticos de seguridad (SAST) y calidad en verde a través de SonarCloud y Snyk. Tras la aprobación, se mezcla el código a la rama principal y Alfredo Huchupe procede a cambiar el estado del ticket a **Done**, cerrando formalmente el incidente.

---

## 3. Evidencias de Ejecución del Pipeline y Contenedores (Placeholders)

*Esta sección contiene los espacios reservados para la consolidación de las capturas de pantalla finales del código fuente ejecutado.*

### 3.1. Pipeline de Integración Continua (GitHub Actions)
[RODRIGO COPIAR AQUÍ CAPTURA DE GITHUB ACTIONS EN VERDE]

### 3.2. Análisis Estático de Calidad y Cobertura (SonarCloud)
[RODRIGO COPIAR AQUÍ DASHBOARD DE SONARCLOUD CON EL % DE COBERTURA LCOV]

### 3.3. Despliegue Local del Servidor Web (Docker)
[RODRIGO COPIAR AQUÍ CAPTURA DEL DOCKER DE NGINX LOCAL EN PUERTO 8080 CON LA APP EXPORTADA]
