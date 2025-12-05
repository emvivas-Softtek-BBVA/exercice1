import { buildSchema } from "graphql";
import prisma from "../prismaClient.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     GraphQLSchema:
 *       type: object
 *       properties:
 *         query:
 *           type: string
 *           description: Schema completo de GraphQL
 *           example: |
 *             type User {
 *               id: ID!
 *               name: String
 *               email: String
 *             }
 *
 *             type Query {
 *               user(id: ID!): User
 *               users: [User]
 *               userByEmail(email: String!): User
 *             }
 *
 *             type Mutation {
 *               createUser(name: String!, email: String!): User
 *               updateUser(id: ID!, name: String, email: String): User
 *               deleteUser(id: ID!): User
 *             }
 */

const typeDefs = `
  """
  Representa un usuario en el sistema
  """
  type User {
    """ID único del usuario"""
    id: ID!
    
    """Nombre completo del usuario"""
    name: String
    
    """Email único del usuario"""
    email: String
  }

  """
  Consultas disponibles en la API GraphQL
  """
  type Query {
    """
    Obtiene un usuario por su ID
    
    Ejemplo de consulta:
    \`\`\`graphql
    query {
      user(id: "1") {
        id
        name
        email
      }
    }
    \`\`\`
    """
    user(id: ID!): User
    
    """
    Obtiene todos los usuarios registrados
    
    Ejemplo de consulta:
    \`\`\`graphql
    query {
      users {
        id
        name
        email
      }
    }
    \`\`\`
    """
    users: [User]
    
    """
    Obtiene un usuario por su email
    
    Ejemplo de consulta:
    \`\`\`graphql
    query {
      userByEmail(email: "usuario@example.com") {
        id
        name
        email
      }
    }
    \`\`\`
    """
    userByEmail(email: String!): User
  }

  """
  Mutaciones para modificar datos
  """
  type Mutation {
    """
    Crea un nuevo usuario
    
    Ejemplo de mutación:
    \`\`\`graphql
    mutation {
      createUser(
        name: "Nuevo Usuario", 
        email: "nuevo@example.com"
      ) {
        id
        name
        email
      }
    }
    \`\`\`
    """
    createUser(name: String!, email: String!): User
    
    """
    Actualiza un usuario existente
    
    Ejemplo de mutación:
    \`\`\`graphql
    mutation {
      updateUser(
        id: "1",
        name: "Nombre Actualizado",
        email: "nuevo@email.com"
      ) {
        id
        name
        email
      }
    }
    \`\`\`
    """
    updateUser(id: ID!, name: String, email: String): User
    
    """
    Elimina un usuario
    
    Ejemplo de mutación:
    \`\`\`graphql
    mutation {
      deleteUser(id: "1") {
        id
        name
        email
      }
    }
    \`\`\`
    """
    deleteUser(id: ID!): User
  }
`;

export const schema = buildSchema(typeDefs);

/**
 * @swagger
 * /graphql:
 *   post:
 *     summary: Endpoint GraphQL
 *     description: |
 *       ## Endpoint principal de GraphQL
 *
 *       Este endpoint acepta todas las consultas y mutaciones definidas en el schema.
 *
 *       ### Cómo usar:
 *       1. Envía una solicitud POST con Content-Type: application/json
 *       2. El body debe contener un objeto JSON con:
 *          - `query`: La consulta GraphQL
 *          - `variables`: Variables opcionales para la consulta
 *          - `operationName`: Nombre de la operación (opcional)
 *
 *       ### Ejemplos de consultas:
 *
 *       **Obtener todos los usuarios:**
 *       \`\`\`json
 *       {
 *         "query": "query { users { id name email } }"
 *       }
 *       \`\`\`
 *
 *       **Crear un usuario:**
 *       \`\`\`json
 *       {
 *         "query": "mutation CreateUser($name: String!, $email: String!) { createUser(name: $name, email: $email) { id name email } }",
 *         "variables": {
 *           "name": "Nuevo Usuario",
 *           "email": "nuevo@example.com"
 *         }
 *       }
 *       \`\`\`
 *
 *       ### Alternativa:
 *       También puedes usar la interfaz GraphiQL en [/graphiql](http://localhost:3000/graphiql) para una experiencia visual.
 *     tags: [GraphQL]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GraphQLRequest'
 *           examples:
 *             getUsers:
 *               summary: Obtener todos los usuarios
 *               value:
 *                 query: "query { users { id name email } }"
 *             getUserById:
 *               summary: Obtener usuario por ID
 *               value:
 *                 query: "query GetUser($id: ID!) { user(id: $id) { id name email } }"
 *                 variables:
 *                   id: "1"
 *             createUser:
 *               summary: Crear nuevo usuario
 *               value:
 *                 query: "mutation CreateUser($name: String!, $email: String!) { createUser(name: $name, email: $email) { id name email } }"
 *                 variables:
 *                   name: "Nuevo Usuario"
 *                   email: "nuevo@example.com"
 *     responses:
 *       200:
 *         description: Respuesta GraphQL exitosa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GraphQLResponse'
 *             examples:
 *               success:
 *                 summary: Respuesta exitosa
 *                 value:
 *                   data:
 *                     users:
 *                       - id: "1"
 *                         name: "Juan Pérez"
 *                         email: "juan@example.com"
 *               error:
 *                 summary: Error en la consulta
 *                 value:
 *                   errors:
 *                     - message: "Field 'invalidField' doesn't exist on type 'User'"
 *                       locations:
 *                         - line: 2
 *                           column: 3
 *                       path: ["query", "users", "invalidField"]
 *       400:
 *         description: Solicitud mal formada
 *       500:
 *         description: Error interno del servidor
 *   get:
 *     summary: Acceso a GraphiQL
 *     description: |
 *       Si se accede con GET sin parámetros, redirige a la interfaz GraphiQL.
 *       Para ejecutar consultas directamente, usa parámetros de query:
 *
 *       \`GET /graphql?query={users{id name}}\`
 *
 *       **Nota:** Para desarrollo, visita [/graphiql](http://localhost:3000/graphiql) para la interfaz completa.
 *     tags: [GraphQL]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Consulta GraphQL en formato string
 *         example: "{users{id name}}"
 *       - in: query
 *         name: variables
 *         schema:
 *           type: string
 *         description: Variables en formato JSON stringificado
 *         example: "{\"id\":\"1\"}"
 *       - in: query
 *         name: operationName
 *         schema:
 *           type: string
 *         description: Nombre de la operación
 *     responses:
 *       200:
 *         description: Respuesta GraphQL
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GraphQLResponse'
 *       302:
 *         description: Redirige a GraphiQL si no hay parámetros de query
 */

export const rootValue = {
  user: async ({ id }) => {
    console.log(`GraphQL - Buscando usuario ID: ${id}`);
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      throw new Error(`El ID '${id}' no es un número válido`);
    }

    return prisma.user.findUnique({
      where: { id: userId },
    });
  },

  users: async () => {
    console.log("GraphQL - Obteniendo todos los usuarios");
    return prisma.user.findMany();
  },

  userByEmail: async ({ email }) => {
    console.log(`GraphQL - Buscando usuario por email: ${email}`);
    return prisma.user.findUnique({
      where: { email },
    });
  },

  createUser: async ({ name, email }) => {
    console.log(`GraphQL - Creando usuario: ${name}, ${email}`);
    return prisma.user.create({
      data: { name, email },
    });
  },

  updateUser: async ({ id, name, email }) => {
    console.log(`GraphQL - Actualizando usuario ID: ${id}`);
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      throw new Error(`ID inválido: ${id}`);
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;

    return prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  },

  deleteUser: async ({ id }) => {
    console.log(`GraphQL - Eliminando usuario ID: ${id}`);
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      throw new Error(`ID inválido: ${id}`);
    }

    return prisma.user.delete({
      where: { id: userId },
    });
  },
};
