/**
 * @project Ejercicio #1 candidato
 * @version 1.0.0
 * @file App.js
 * @description Configuration and initialization of the Express application, including RESTful routes, GraphQL endpoint, Swagger documentation, and middleware.
 * @author emvivas
 * @created December 2024
 */

import express from "express";
import favicon from "serve-favicon";
import usersRouter from "./routes/users.js";
import { setupSwagger } from "./swagger.js";
import { hostCheck } from "./middleware/hostCheck.js";
import { createHandler } from "graphql-http/lib/use/express";
import { schema, rootValue } from "./graphql/schema.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import index from "./public/index.js";

export class App {
  static #instance = null;

  #expressApp;

  get expressApp() {
    return this.#expressApp;
  }

  static getInstance() {
    if (!App.#instance) App.#instance = new App();
    return App.#instance;
  }

  constructor() {
    this.#expressApp = express();
    this.#initialize();
  }

  #initialize() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const publicDir = path.join(__dirname, "public");
    const graphiqlHTMLPath = path.join(publicDir, "graphiql", "graphiql.html");

    let graphiqlHTML = null;
    try {
      graphiqlHTML = fs.readFileSync(graphiqlHTMLPath, "utf8");
      console.log("GraphiQL charged successfully.");
    } catch (error) {
      console.warn("GraphiQL interface not found, skipping...");
    }

    this.#expressApp.use(express.json());
    this.#expressApp.use(express.static(publicDir));
    this.#expressApp.use(favicon(path.join(publicDir, "favicon.ico")));

    this.#expressApp.use((req, res, next) => {
      if (req.path === "/health") return next();
      return hostCheck(req, res, next);
    });

    // RESTful
    this.#expressApp.use("/users", usersRouter);

    // Swagger
    setupSwagger(this.#expressApp);

    // GraphQL handler
    const graphqlHandler = createHandler({
      schema,
      rootValue,
      context: (req) => ({ req }),
    });

    // Response time middleware
    const responseTimeMiddleware = (req, res, next) => {
      const start = Date.now();
      const originalEnd = res.end;

      res.end = function (chunk, encoding) {
        const duration = Date.now() - start;
        if (!res.headersSent) {
          res.setHeader("X-Response-Time", `${duration}ms`);
        }
        return originalEnd.call(this, chunk, encoding);
      };

      next();
    };

    /**
     * @swagger
     * /graphiql:
     *   get:
     *     summary: Interfaz GraphiQL
     *     description: |
     *       ## Interfaz gráfica para GraphQL
     *
     *       Interfaz web interactiva para probar consultas GraphQL.
     *
     *       ### Características:
     *       - Editor de consultas con autocompletado
     *       - Panel de variables JSON
     *       - Documentación del schema
     *       - Historial de consultas
     *
     *       ### Uso recomendado para desarrollo:
     *       1. Accede a esta interfaz para probar consultas
     *       2. Usa los ejemplos predefinidos
     *       3. Ejecuta consultas con Ctrl+Enter
     *
     *       **Nota:** Esta interfaz solo está disponible en modo desarrollo.
     *     tags: [GraphQL]
     *     responses:
     *       200:
     *         description: Interfaz GraphiQL cargada
     *         content:
     *           text/html:
     *             schema:
     *               type: string
     *       404:
     *         description: Interfaz no disponible
     */
    if (graphiqlHTML) {
      this.#expressApp.get("/graphiql", (req, res) => {
        res.setHeader("Content-Type", "text/html");
        res.send(graphiqlHTML);
      });
    }

    // GraphQL API
    this.#expressApp.all(
      "/graphql",
      responseTimeMiddleware,
      (req, res, next) => {
        if (req.method === "GET" && !req.query.query && graphiqlHTML) {
          return res.redirect("/graphiql");
        }
        next();
      },
      (req, res) => {
        return graphqlHandler(req, res);
      }
    );

    /**
     * @swagger
     * /:
     *   get:
     *     summary: Página de inicio
     *     description: |
     *       Página principal que muestra información de la API.
     *     tags: [Health]
     *     responses:
     *       200:
     *         description: Información de la API
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "API Server"
     *                 endpoints:
     *                   type: object
     *                   properties:
     *                     rest:
     *                       type: string
     *                       example: "/users"
     *                     graphql:
     *                       type: string
     *                       example: "/graphql"
     *                     docs:
     *                       type: string
     *                       example: "/api-docs"
     *                     health:
     *                       type: string
     *                       example: "/health"
     */
    this.#expressApp.get("/", (req, res) => {
      const protocol = req.protocol || "http";
      const host = req.headers.host || `localhost:${process.env.PORT || 3000}`;

      return index(req, res);
    });

    /**
     * @swagger
     * /health:
     *   get:
     *     summary: Health Check
     *     description: Verifica el estado del servidor y sus servicios
     *     tags: [Health]
     *     responses:
     *       200:
     *         description: Servidor sin problemas
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: "healthy"
     *                 timestamp:
     *                   type: string
     *                   format: date-time
     *                 endpoints:
     *                   type: object
     *                   properties:
     *                     rest:
     *                       type: string
     *                     graphql:
     *                       type: string
     *                     graphiql:
     *                       type: string
     *                     docs:
     *                       type: string
     *                 environment:
     *                   type: string
     *       503:
     *         description: Servidor con problemas
     */
    this.#expressApp.get("/health", (req, res) => {
      res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        endpoints: {
          rest: "/users",
          graphql: "/graphql",
          graphiql: graphiqlHTML ? "/graphiql" : "not available",
          docs: "/api-docs",
        },
        environment: process.env.NODE_ENV || "development",
      });
    });

    // 404 error handler
    this.#expressApp.use((req, res) => {
      res.status(404).json({
        error: "Route not found",
        availableRoutes: {
          rest: "/users",
          graphql: "/graphql",
          graphiql: graphiqlHTML ? "/graphiql" : "not available",
          docs: "/api-docs",
          health: "/health",
        },
      });
    });

    // Global error handler
    this.#expressApp.use((err, req, res, next) => {
      console.error("Server error:", err);
      res.status(500).json({
        error: "Internal server error",
        message:
          process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    });

    console.log(`
Server initialized
────────────────────
REST API:    http://localhost:${process.env.PORT || 3000}/users
GraphQL:     http://localhost:${process.env.PORT || 3000}/graphql
${
  graphiqlHTML
    ? `GraphiQL:    http://localhost:${process.env.PORT || 3000}/graphiql`
    : `GraphiQL:    Not available`
}
API Docs:    http://localhost:${process.env.PORT || 3000}/api-docs
Health:      http://localhost:${process.env.PORT || 3000}/health
────────────────────
`);
  }
}
