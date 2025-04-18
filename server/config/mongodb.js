import mongoose from "mongoose";

const connectdb=async ()=>{
    mongoose.connection.on(`connected`,()=> console.log("Database connected"));

    await mongoose.connect(`${process.env.MONGODB_URL}/mern-auth`);
};
export default connectdb();