import mongoose from "mongoose";
import config from "../config/config.js";  

async function ConnectDB() {
    try {
        await mongoose.connect(config.MONGO_URI)
        console.log("Connected to DataBase");
        
    } catch (error) {
        console.log("Database Failed", error);
        
    }
}

export default ConnectDB