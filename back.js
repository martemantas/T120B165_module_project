//npm run devStart
import dotenv from "dotenv"
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import path from "path";

import categoryRoute from './src/Routers/categoriesRoute.js';
import bookRoute from './src/Routers/booksRoute.js';
import reviewRoute from './src/Routers/reviewRoute.js';
import authRoute from './src/Routers/authRoute.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 8080;
const MONGOURL = process.env.MONGO_URL;

//db connection
mongoose.connect(MONGOURL).then(()=>{
    console.log("Database is connected");
    app.listen(PORT, () => console.log('server is live'));
}).catch((error) => console.log(error));

app.use(express.json())
app.use(cookieParser());

//API routes
app.use('/api', authRoute);
app.use(categoryRoute);
app.use('/', bookRoute);
app.use('/', reviewRoute);

// app.use(express.static(path.join(__dirname, 'build')));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });