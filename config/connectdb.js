import mongoose from "mongoose";

const connectDB = async (DATABASE_URL) => {
  try {
    const DB_OPTION = {
      dbName: "test",
    };
    await mongoose.connect(DATABASE_URL, DB_OPTION);
    console.log("connected sucessfully...");
  } catch (error) {
    console.log({ error: "connection failed" });
  }
};
export default connectDB;
