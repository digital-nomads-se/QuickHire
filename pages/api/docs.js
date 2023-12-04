import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'QuickHire API',
      version: '1.0.0',
      description: 'QuickHire API Documentation',
    },
  },
  apis: ['./pages/api/*.js'], 
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

export default (req, res) => {
  if (req.method === 'GET') {
    // Serve the Swagger document on GET request
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(swaggerSpec));
  } else {
    // Serve the Swagger UI on other requests
    swaggerUi.serveUiMiddleware()(req, res);
  }
};