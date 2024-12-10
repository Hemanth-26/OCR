const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

require('dotenv').config();
const port = process.env.PORT || 4000;
const appUrl = process.env.APP_URL || `http://localhost:${port}`;

// Define Swagger options
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'OCR PROJECT API',
      version: '1.0.0',
      description: 'A Project for OCR API',
    },
    servers: [
      {
        url: process.env.APP_URL,
        description: 'Live server'
      },
      {
        url: `http://localhost:${port}`,
        description: 'Local server'
      },
    ],
    components: {
      examples: {
        pdfFile: {
          value: `${process.env.APP_URL}/sample-table.pdf`,
        },
      },
    },
  },
  apis: ['./routers/ocrRouter.js'],
};

// Initialize swagger-jsdoc with the options
const swaggerSpec = swaggerJsdoc(options);

// console.log(JSON.stringify(swaggerSpec, null, 2));

// Function to set up Swagger UI middleware
const setupSwagger = (app) => {
  // Set up Swagger UI route
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
