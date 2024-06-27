import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Star Wars API',
            version: '1.0.0',
            description: 'API for managing Star Wars characters',
        },
    },
    apis: ['./src/routes/*.ts', './src/models/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app: Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default swaggerDocs;
