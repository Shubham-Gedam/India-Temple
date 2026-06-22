import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js'
import ConnectDB from './src/db/db.js';


ConnectDB()

const PORT = process.env.PORT || 3000;

app.listen('3000',()=>{
    console.log("Auth server is running on ${PORT}");
})