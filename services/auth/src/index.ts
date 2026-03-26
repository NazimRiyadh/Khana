import express, { json } from "express";
import authRoute from "./model/routes/auth.js";

import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
app.use(json);

app.use("/api/auth", authRoute);

const port = process.env.PORT;

app.listen(port, () => {
  console.log("Auth service started on port =>", port);
  connectDB();
});
