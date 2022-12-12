import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/connectdb.js";
import usersrouts from "./routes/usersRouts.js";

const app = express();
const port = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

app.use(cors());
app.use(express.json());

app.use("/api/users", usersrouts);

connectDB(DATABASE_URL);
app.listen(port, () => {
  console.log(`Server listing at http://localhost:${port}`);
});
