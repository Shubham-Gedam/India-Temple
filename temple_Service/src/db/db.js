import mongoose from 'mongoose';


async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI),
        console.log("connected to tempe db");
        
    }catch(err){
        console.log("Database Failed", error);
        
    }
}

export default connectDB;

