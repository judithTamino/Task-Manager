import mongoose from "mongoose";

const connectDB = async() => {
  try {
    mongoose.connection.on("connected", () => console.log("Connected to MongoDB"));
    await mongoose.connect(`${process.env.MONGO_URI}TaskManager`);
    
  } catch (error) {
    console.log(`Error connecting to MongoDB: ${error}`);
    process.exit(1);
  }
}

export default connectDB;