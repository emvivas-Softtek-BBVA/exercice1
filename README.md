# 🚀 Ejercicio #1 Candidato - API REST & GraphQL

## 📋 Descripción

API completa desarrollada con **Express.js**, **Prisma ORM**, **GraphQL** y **SQLite** que implementa una solución profesional para gestión de usuarios. La aplicación incluye endpoints REST tradicionales, una API GraphQL moderna, documentación interactiva y herramientas de desarrollo integradas.

Proyecto desarrollador por **emvivas** (Emiliano Vivas Rodríguez).
https://github.com/emvivas
https://www.linkedin.com/in/emvivas/


## 🎯 Características Principales

### 🏗️ **Arquitectura**
- **Patrón Singleton** para gestión única de la aplicación
- **Programación Orientada a Objetos** con encapsulación adecuada
- **Middleware de seguridad** con validación de hosts
- **Separación de responsabilidades** (Rutas, Controladores, Modelos)

### 🔧 **Tecnologías Utilizadas**
- **Backend**: Node.js + Express.js
- **Base de Datos**: SQLite + Prisma ORM
- **API GraphQL**: GraphQL HTTP + Schema propio
- **Documentación**: Swagger/OpenAPI
- **Seguridad**: CORS + Host Validation
- **Desarrollo**: Nodemon + ES Modules

### 📊 **Endpoints Disponibles**

| Ruta | Método | Descripción | Tipo |
|------|--------|-------------|------|
| `/` | GET | Página de inicio con enlaces | HTML |
| `/health` | GET | Health check del servidor | JSON |
| `/users` | GET, POST | CRUD completo de usuarios | REST |
| `/users/:id` | GET, PUT, DELETE | Operaciones por ID de usuario | REST |
| `/graphql` | POST, GET | Endpoint principal GraphQL | GraphQL |
| `/graphiql` | GET | Interfaz interactiva GraphQL | HTML |
| `/api-docs` | GET | Documentación Swagger UI | HTML |

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v16 o superior)
- npm o yarn
- Git
