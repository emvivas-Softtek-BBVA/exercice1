import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export const setupSwagger = (app) => {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "API Documentation - 🐱‍👤 Ejercicio #1 candidato",
        version: "1.0.0",
        description: `
# Documentación completa de la API

Esta API incluye endpoints REST tradicionales y una API GraphQL.

## 📋 Contenido
1. **REST API** - Endpoints tradicionales RESTful
2. **GraphQL API** - Endpoint único con schema completo
3. **Herramientas de desarrollo** - Interfaces para testing

## 🔗 Enlaces rápidos
- **GraphiQL**: [http://localhost:3000/graphiql](http://localhost:3000/graphiql) - Interfaz gráfica para GraphQL
- **GraphQL Endpoint**: [http://localhost:3000/graphql](http://localhost:3000/graphql)
- **Health Check**: [http://localhost:3000/health](http://localhost:3000/health)

## 🚀 Primeros pasos
1. Para REST: Usa los endpoints documentados abajo
2. Para GraphQL: Usa el endpoint /graphql o la interfaz /graphiql
        `,
        contact: {
          name: "API Support",
          email: "support@example.com",
        },
        license: {
          name: "MIT",
          url: "https://opensource.org/licenses/MIT",
        },
      },
      servers: [
        {
          url: "http://localhost:3000",
          description: "Servidor de desarrollo",
        },
        {
          url: "https://api.example.com",
          description: "Servidor de producción",
        },
      ],
      tags: [
        {
          name: "Users",
          description: "Operaciones con usuarios",
        },
        {
          name: "GraphQL",
          description: "Endpoint GraphQL unificado",
        },
        {
          name: "Health",
          description: "Verificación del estado del sistema",
        },
      ],
      // OpenAPI's GraphQL schema representation
      components: {
        schemas: {
          User: {
            type: "object",
            properties: {
              id: {
                type: "integer",
                format: "int64",
                example: 1,
              },
              name: {
                type: "string",
                example: "Juan Pérez",
              },
              email: {
                type: "string",
                format: "email",
                example: "juan@example.com",
              },
            },
          },
          Error: {
            type: "object",
            properties: {
              error: {
                type: "string",
                example: "Error message",
              },
              message: {
                type: "string",
                example: "Detailed error description",
              },
            },
          },
          GraphQLRequest: {
            type: "object",
            required: ["query"],
            properties: {
              query: {
                type: "string",
                description: "Consulta GraphQL",
                example: 'query { user(id: "1") { id name email } }',
              },
              variables: {
                type: "object",
                description: "Variables para la consulta",
                example: { id: "1" },
              },
              operationName: {
                type: "string",
                description: "Nombre de la operación (opcional)",
                example: "GetUser",
              },
            },
          },
          GraphQLResponse: {
            type: "object",
            properties: {
              data: {
                type: "object",
                description: "Datos devueltos por la consulta",
              },
              errors: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                    locations: {
                      type: "array",
                      items: {
                        type: "object",
                      },
                    },
                    path: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        securitySchemes: {
          ApiKeyAuth: {
            type: "apiKey",
            in: "header",
            name: "X-API-Key",
          },
        },
      },
      externalDocs: {
        description: "Documentación de GraphQL",
        url: "http://localhost:3000/graphiql",
      },
    },
    apis: [
      "./src/routes/*.js", // REST routes
      "./src/graphql/*.js", // GraphQL schema
      "./src/App.js", // General configuration
    ],
  };

  const specs = swaggerJsdoc(options);

  // Swagger UI configuration
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCss: `
        .swagger-ui .topbar { display: none }
        .information-container { margin: 20px 0; }
        .opblock-tag { font-size: 18px; font-weight: bold; }
        .scheme-container { background: #fafafa; padding: 10px; }
      `,
      customSiteTitle: "API Documentation",
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        defaultModelsExpandDepth: 2,
        defaultModelExpandDepth: 2,
        docExpansion: "list",
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
      },
    })
  );

  console.log("Swagger available in: http://localhost:3000/api-docs");
};
