const index = (req, res) => {
  const port = process.env.PORT || 3000;
  const host = req.headers.host || `localhost:${port}`;
  const protocol = req.protocol || "http";

  res.send(`
<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" href="index.css" />
  <title>Ejercicio #1 candidato</title>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Ejercicio #1 candidato</h1>
      <p><strong>Objective:</strong> Build a microservice in Node.js with Express that combines REST API and GraphQL, documented with Swagger, and uses Prisma + SQLite to manage users.</p>
    </div>
    
    <div class="endpoints-grid">
      <div class="endpoint">
        <strong>RESTful API</strong>
        <div class="endpoint-links">
          <a href="${protocol}://${host}/users" target="_blank">/users</a>
          <code>GET, POST, PUT, DELETE</code>
        </div>
      </div>
      
      <div class="endpoint">
        <strong>GraphQL Endpoint</strong>
        <div class="endpoint-links">
          <a href="${protocol}://${host}/graphql" target="_blank">/graphql</a>
          <code>POST queries & mutations</code>
        </div>
      </div>
      
      <div class="endpoint">
        <strong>GraphiQL Interface</strong>
        <div class="endpoint-links">
          <a href="${protocol}://${host}/graphiql" target="_blank">/graphiql</a>
          <code>Interactive GraphQL IDE</code>
        </div>
      </div>
      
      <div class="endpoint">
        <strong>API Documentation</strong>
        <div class="endpoint-links">
          <a href="${protocol}://${host}/api-docs" target="_blank">/api-docs</a>
          <code>Swagger UI with examples</code>
        </div>
      </div>
      
      <div class="endpoint">
        <strong>Health Check</strong>
        <div class="endpoint-links">
          <a href="${protocol}://${host}/health" target="_blank">/health</a>
          <code>Server status & info</code>
        </div>
      </div>
    </div>
    
    <div class="server-info">
      <em>Server running on ${protocol}://${host}</em>
    </div>
    
    <div class="footer">
      <p>
        <em>Website developed by 
          <a href="https://github.com/emvivas" target="_blank">emvivas</a> 
          (<a href="https://www.linkedin.com/in/emvivas/" target="_blank">Emiliano Vivas Rodríguez</a>)
        </em>
      </p>
    </div>
  </div>
</body>
</html>
`);
};

export default index;
