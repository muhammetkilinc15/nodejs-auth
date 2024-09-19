import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config();
//  connect to the database
export const connectDb = async ()=>{
    try{
        const connect = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Mongo dv connected ${connect.connection.host}`)
    
    }catch(err){
        console.log(`Error connect to MongoDb : ${err}`)
        process.exit(1) // 1 is failure , 0 is status code is success
    }
}