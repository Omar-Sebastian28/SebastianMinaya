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

### ⚙️ [Backend (Node.js/Express)](./backend/)
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
*Desarrollador: Sebastian Omar Joaquin Minaya - 2026*
