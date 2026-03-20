# Financial Product Management - FullStack Monorepro

Este repositorio centraliza el desarrollo del sistema de gestión de productos financieros, integrando tanto el **Frontend** como el **Backend** en una estructura de monorepositorio organizada y profesional.

---

## Estructura del Proyecto

El proyecto se divide en dos módulos principales:

### [Frontend (Angular)](./frontend/)
Interfaz de usuario moderna construida con Angular v21.2.0, enfocada en la experiencia de usuario y la integridad de los datos.
*   **Tecnologías:** Angular, Signals, RxJS, Vitest, SCSS.
*   **Arquitectura:** Clean Architecture (Domain, Application, Infrastructure, Presentation).
*   **[Ver documentación detallada](./frontend/README.md)**

### [Backend (Node.js/Express)](./backend/)
API robusta para la gestión persistente del catálogo de productos financieros.
*   **Tecnologías:** Node.js, Express, TypeScript.
*   **Funcionalidad:** Gestión CRUD de productos financieros.

---

## Guía de Inicio Rápido

### Clonar el Repositorio
```bash
git clone https://github.com/Omar-Sebastian28/SebastianMinaya.git
cd SebastianMinaya
```

### Ejecutar el Proyecto
Para una visualización completa, se recomienda ejecutar ambos servicios simultáneamente:

1.  **Backend:**
    ```bash
    cd backend
    npm install
    npm start
    ```

2.  **Frontend:**
    ```bash
    cd frontend
    npm install
    npm start
    ```

---

## Calidad y Pruebas
Ambos módulos cuentan con su propia suite de pruebas. Por favor, consulte los README específicos en cada carpeta para más detalles sobre cómo ejecutar los tests unitarios y de integración.

---

## Decisiones de Arquitectura y Trade-offs

Para este proyecto, se ha optado por un enfoque de **Clean Architecture** adaptado al ecosistema de Angular (v21.2.0), utilizando **Signals** para la reactividad y **UseCases** para desacoplar la lógica operativa de la interfaz.

**¿Por qué esta estructura?**
El objetivo no es solo resolver un CRUD básico, sino presentar una **Arquitectura de Referencia (Technical Showcase)** orientada a sistemas empresariales de larga duración. Se han priorizado los principios **SOLID** y el patrón **Repository** para garantizar que los componentes sean 100% testeables y escalables.

**Nota sobre la Sobreingeniería:**
Se reconoce que, para el alcance de este test técnico, la arquitectura implementada posee un grado de sobreingeniería. En un entorno de desarrollo ágil con plazos cortos, se podría haber optado por una solución más simplificada (KISS). 

Sin embargo, este diseño ha sido elegido intencionalmente para:
1.  **Demostrar Nivel Técnico:** Aplicar patrones avanzados comunes en aplicaciones Senior Core.
2.  **Preparación para Escala:** Mostrar cómo el sistema podría crecer a cientos de entidades sin sufrir degradación técnica ni acoplamiento rígido.
3.  **Mantenibilidad Extrema:** Garantizar que la lógica de negocio resida en el Dominio, protegida de cambios en bibliotecas externas o proveedores de infraestructura.

---
*Desarrollador: Sebastian Omar Joaquin Minaya - 2026*
