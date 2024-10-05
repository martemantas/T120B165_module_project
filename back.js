import dotenv from "dotenv"
import express from 'express';
import mongoose from 'mongoose';
import categoryRoute from './Routers/categoriesRoute.js';
import bookRoute from './Routers/booksRoute.js';
import reviewRoute from './Routers/reviewRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const MONGOURL = process.env.MONGO_URL;


//db connection
mongoose.connect(MONGOURL).then(()=>{
    console.log("Database is connected");
    app.listen(
        PORT,
        () => console.log('server is live')
    );
}).catch((error) => console.log(error));

app.use(express.json())

app.use(categoryRoute);
app.use('/', bookRoute);
app.use('/', reviewRoute);

//get post put patch delete
//kategorija -> knyga -> ivertinimas
