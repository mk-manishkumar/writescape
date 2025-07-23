import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    mongoose.connection.on("connected", () => console.log("MongoDB connected successfully"));
    await mongoose.connect(`${process.env.MONGODB_URI}/writescape`);
  } catch (error) {
    console.log(error.message);
    
  }
}
