import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: "Khana",
    });
    console.log("connected to mongo db");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
