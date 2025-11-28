![Node.js 23](https://img.shields.io/badge/Node.js-23.x-339933?logo=node.js&logoColor=white)


# Prueba Banisi
En el siguiente repositorio se encuentran los 2 fuentes de back y front, ambos estan con version de node 23.4.0

## Importante
Ejecutar el escript inicial que esta en "/extras/database.sql"

Tomar el archivo "example.env" del back y cambiarle el nombre a ".env", luego modificar con sus variables

## Adjuntos
### Documento técnico
Documento sobre la explicación y plan de despliegue (Documento Ténico.pdf)
### Diagrama de BD
Documento que contiene la extructura de la BD (Diagrama BD.pdf)

## Tecnologías
- banis-api/ → backend Node.js (API REST).
- banisi-front/ → frontend React (SPA con Vite).
- extras/database.sql → script inicial de base de datos.

## Comandos
Tanto para back como para front se ejecutan los siguientes comandos:

### Instalar dependencias:
```
npm install
```

### Ejecutar:
```
npm run dev
```

## Estructura (resumen)
- Backend con arquitectura en capas + módulos por dominio:
    - db/ → modelos y config de BD.
    - modules/loan_application → todo lo de solicitudes de crédito.
    - modules/security/auth → login/usuarios.
    - helpers/, middlewares/ → funcionalidades transversales.
- Frontend con estructura por módulos/feature:
    - modules/ApplicationLoans → formulario público.
    - modules/Portal/Security → login/OTP.
    - modules/Portal/LoanApplication → listado y gestión de solicitudes.
    - shared/ + services/apiClient.js → cosas reutilizables.

## Estructura (árbol)
```
banis-api/
    ├── extras/
        └── database.sql
    ├── src/
        ├── db/
            ├── models/
                ├── credit_history_summary_db_model.js
                ├── loan_application_db_model.js
                ├── loan_application_status_db_model.js
                ├── loan_auto_decision_db_model.js
                ├── loan_manual_decision_db_model.js
                └── users_db_model.js
            └── config_db.js
        ├── helpers/
            ├── general_response.js
            ├── jwt_helper.js
            ├── method_helpers.js
            ├── params_helper.js
            ├── smtp_helper.js
            └── twilo_helper.js
        ├── middlewares/
            ├── field_validations_middleware.js
            ├── general_errors.js
            └── session_middleware.js
        └── modules/
            ├── loan_application/
                ├── loan_application_bll.js
                ├── loan_application_controller.js
                ├── loan_application_messages.js
                └── loan_application_routes.js
            └── security/
                └── auth/
                    ├── auth_user_errors.js
                    ├── user_bll.js
                    ├── user_controller.js
                    └── user_routes.js
    ├── .gitignore
    ├── index.js
    ├── package-lock.json
    └── package.json
banisi-front/
    ├── public/
        └── vite.svg
    ├── src/
        ├── assets/
            └── react.svg
        ├── modules/
            ├── ApplicationLoans/
                ├── css/
                    └── CreditRequestForm.css
                └── page/
                    └── CreditRequestForm.jsx
            └── Portal/
                ├── LoanApplication/
                    ├── components/
                        ├── CreditActionModal.jsx
                        ├── CreditRequestMeter.jsx
                        ├── CreditRequestRow.jsx
                        └── CreditRequestsTable.jsx
                    ├── css/
                        └── CreditRequestsList.css
                    ├── helper/
                        └── StatusConfig.js
                    └── pages/
                        └── CreditRequestsPage.jsx
                └── Security/
                    ├── css/
                        ├── Auth.css
                        └── OtpModal.css
                    └── page/
                        ├── AuthTabs.jsx
                        └── OtpModal.jsx
        ├── services/
            └── apiClient.js
        ├── shared/
            ├── css/
                └── loading.css
            ├── helpers/
                └── jwt.js
            └── middleware/
                └── RequireAuth.jsx
        ├── App.css
        ├── App.jsx
        ├── index.css
        └── main.jsx
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── README.md
    └── vite.config.js
.gitignore
```