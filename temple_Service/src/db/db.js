import mongoose from 'mongoose';


async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI),
        console.log("connected to temple db");
        
    }catch(err){
        console.log("Database Failed", err);
        
    }
}

export default connectDB;

