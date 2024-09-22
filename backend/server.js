const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const listEndpoints = require('express-list-endpoints');

const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Node.js API',
      version: '1.0.0',
      description: 'A simple Express API',
      contact: {
        name: 'API Support',
        email: 'support@api.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API docs in the routes folder
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Use routes
app.use('/users', userRoutes);
app.use('/products', productRoutes);

// Route to list all endpoints
app.get('/routes', (req, res) => {
  const routes = listEndpoints(app);
  res.json(routes);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
