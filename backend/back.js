//npm run devStart
import dotenv from "dotenv"
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import fs from 'fs';

import categoryRoute from './src/Routers/categoriesRoute.js';
import bookRoute from './src/Routers/booksRoute.js';
import reviewRoute from './src/Routers/reviewRoute.js';
import authRoute from './src/Routers/authRoute.js';
import readBookRoute from './src/Routers/readBookRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const MONGOURL = process.env.MONGO_URL;

//db connection
mongoose.connect(MONGOURL).then(()=>{
    console.log("Database is connected");
    app.listen(PORT, () => console.log('Server is live'));
}).catch((error) => console.log(error));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ limit: '2mb', extended: true }));
app.use(cookieParser());

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'BookTrac',
            version: '1.0.0'
        },
        servers: [
            {
                url: 'http://localhost:8080/'
            }
        ]
    },
    apis: ['./src/Routers/authRoute.js', 
        './src/Routers/booksRoute.js', 
        './src/Routers/categoriesRoute.js', 
        './src/Routers/readBookRoute.js',
        './src/Routers/reviewRoute.js']
}

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

const yamlSwagger = YAML.stringify(swaggerSpec);
fs.writeFileSync('api-spec.yaml', yamlSwagger);

//API routes
app.use(categoryRoute);
app.use('/', bookRoute);
app.use('/', reviewRoute);
app.use('/api', authRoute);
app.use('/reads', readBookRoute);

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});
