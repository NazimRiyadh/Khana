import express, { json } from "express";

import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
app.use(express.json());

const port = process.env.PORT;

app.listen(port, () => {
  console.log("Restaurant service started on port =>", port);
  connectDB();
});
