const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const listEndpoints = require('express-list-endpoints');

const authRoutes = require('./routes/auth.js');
const writeRoutes = require('./routes/write.js');
const setupSwagger = require('./swagger/swagger.js');


const app = express();
app.use(express.json());
setupSwagger(app);

const PORT = process.env.PORT;

// Routes
app.use('/auth', authRoutes);
app.use('/write', writeRoutes);

// Route to list all endpoints
app.get('/routes', (req, res) => {
  const routes = listEndpoints(app);
  res.json(routes);
});

app.get('/', (req, res) => {
  return res.json(
    {
      "message": "Welcome to backend API!", 
      "swagger UI": "/docs"
    }
  );
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
