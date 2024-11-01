//npm run devStart
import dotenv from "dotenv"
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

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
