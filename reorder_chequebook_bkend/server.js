const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const swaggerSpec = require("./docs/swagger");
const { initializePool, closePool } = require("./src/config/database");
const { errorHandler } = require("./src/middleware/errorHandler");
const routes = require("./src/routes");

if (process.env.APP_MODE !== "production") {
  require("dotenv").config();
}

app.use(express.json());
// Enable CORS for all routes and origins
app.use(cors());
app.use(cors());


// Initialize database connection pool
initializePool().catch(console.error);

// Routes
app.use("/api/v1", routes);

// Swagger API documentation route
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: "none",
      filter: true,
      tryItOutEnabled: false,
    },
    customSiteTitle: "Cheque Book Service API Docs",
    customCss: `
      .swagger-ui .topbar { background-color: #0f172a; }
      .swagger-ui .topbar-wrapper span { color: #fff; font-weight: bold; }
    `,
  })
);

app.get("/", (req, res) => {
  console.log("Incoming request received");
  res.send("Backend Service is running");
});

// Global error handler
app.use(errorHandler);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`API docs available at http://localhost:${port}/api-docs`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await closePool();
  process.exit(0);
});
