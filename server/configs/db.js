import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    mongoose.connection.on("connected", () => {
      if (process.env.NODE_ENV !== "production") {
        console.log("MongoDB connected successfully");
      }
    });

    await mongoose.connect(`${process.env.MONGODB_URI}/writescape`);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.log(error.message);
    }
  }

}
