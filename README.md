
---

# ConnecTani: Sistema de Gestión de Salud Materno-Infantil

[![ConnecTani DevSecOps Pipeline](https://github.com/conectani/Proyecto-Tani/actions/workflows/ci.yml/badge.svg)](https://github.com/conectani/Proyecto-Tani/actions/workflows/ci.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=conectani_Proyecto-Tani&metric=alert_status)](https://sonarcloud.io/dashboard?id=conectani_Proyecto-Tani)

## 🚀 Demostración en Vivo (Live Demos)
- **Web Oficial en cPanel Hosting Real:** [https://aramotech.com/tani](https://aramotech.com/tani)
- **Servidor Cloud Azure App Service:** [https://connectani-app-service-gxetgrhjgwgabpd7.southcentralus-01.azurewebsites.net](https://connectani-app-service-gxetgrhjgwgabpd7.southcentralus-01.azurewebsites.net)

**Universidad:** Universidad Tecnológica del Perú (UTP)
**Curso:** Herramientas de Desarrollo
**Docente:** Jose Luis Milla Flores
**Estudiantes:**
- Rodrigo Ricardo Mallqui Ordoñez (Dev 1)
- Alfredo Huchupe Lira (Dev 2)
- Johan Nicola (Dev 3)
- Wilver M. (Dev 4 - Auditor)
- Luis Fernando Risco (Dev 5)

**Fecha de inicio:** 31 de marzo de 2026
**Fecha de finalización:** 21 de julio de 2026

## Agradecimiento y Dedicatoria
Dedicado a la Asociación Taller de los Niños (TANI) por permitirnos contribuir a su noble labor en el distrito de San Juan de Lurigancho.

## Resumen
ConnecTani es una aplicación móvil desarrollada en React Native y Expo, diseñada para optimizar la gestión de historiales clínicos materno-infantiles de la ONG TANI en sus labores de campo.
**Abstract**
ConnecTani is a mobile application developed with React Native and Expo, designed to optimize the management of maternal and child health records for the TANI NGO during field operations.

## Realidad Problemática y Justificación
La ONG TANI requiere un sistema ágil y accesible desde dispositivos móviles para gestionar los datos de salud, ya que actualmente el registro en campo presenta cuellos de botella. La justificación de este proyecto radica en la reducción de tiempos de registro, la eliminación de redundancias y la disponibilidad de la información en tiempo real mediante una arquitectura moderna.

## Objetivos
**General:** Desarrollar una aplicación móvil multiplataforma para la gestión integral de registros de salud de la ONG TANI.
**Específicos:**
1. Diseñar la interfaz de usuario móvil.
2. Implementar el entorno de desarrollo utilizando Expo y React Native.
3. Configurar y aplicar el flujo de trabajo colaborativo Gitflow en el equipo.
4. Desplegar la aplicación para pruebas de campo.

## Marco Teórico y Metodología
El proyecto se fundamenta en el desarrollo de aplicaciones multiplataforma utilizando React Native. Para el gobierno del código y control de versiones, se emplea Git y GitHub. La metodología de trabajo es ágil, basada en el marco de trabajo Scrum adaptado, utilizando tableros Kanban automatizados mediante GitHub Projects para gestionar las ramas (features, hotfixes, rollbacks).

## Cronograma de Actividades
- Semana 1-4: Diseño de UI/UX y modelado de datos.
- Semana 5: Configuración de Repositorio, Protección de Ramas y Gitflow (Hito 1).
- Semana 6-10: Desarrollo de Módulos Core y resolución de conflictos.
- Semana 11-15: Integración Continua, Pruebas y Despliegue.

## Palabras Clave
React Native, Expo, Desarrollo Móvil, Gestión, Salud Familiar, Gitflow.
Proyecto-Tani/
├── README.md                # Corazón del proyecto y guía de presentación [cite: 20, 122]
├── .gitignore               # Exclusiones de archivos temporales y dependencias [cite: 21, 123]
├── LICENSE                  # Licencia del proyecto [cite: 29, 124]
├── docs/                    # Núcleo de la documentación académica [cite: 31, 125]
│   ├── 01_requisitos.md     # Definición de requisitos funcionales y no funcionales [cite: 22, 130]
│   ├── 02_conflictos.md     # Informe detallado de resolución de Merge Conflicts [cite: 35]
│   ├── 03_marco_teorico.md  # Fundamentación teórica y estado del arte [cite: 132]
│   ├── 04_metodologia.md    # Descripción del enfoque de investigación y SDLC [cite: 133]
│   └── 05_cronograma.md     # Planificación de actividades (Diagrama de Gantt) [cite: 134]
├── src/                     # Código fuente de la aplicación (React Native/Expo) [cite: 41, 129]
│   ├── app/                 # Vistas y navegación de ConnecTani
│   ├── components/          # Componentes reutilizables de la interfaz
│   └── assets/              # Recursos visuales e imágenes del sistema
├── informes/                # Carpeta de entregables formales en PDF [cite: 46, 149]
│   ├── informe_apf1.pdf     # Entrega oficial del Hito 1 [cite: 49, 150]
│   └── informe_final.pdf    # Reporte integral del proyecto [cite: 152]
└── resultados/              # Evidencias visuales y reportes de CI [cite: 52, 145]
    ├── capturas_pantalla/   # Screenshots de la aplicación funcionando [cite: 55]
    └── resumen_ci.md        # Reporte de integración continua (Hito 3) [cite: 56]
