import express from "express";
import data from "./data.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import seedRoutes from "./routes/seedRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config(); // loads variables from .env file and makes them available to the process
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();

app.use(express.json()); // express.json() is middleware that convert request body to JSON
app.use(express.urlencoded({ extended: true })); // express.urlencoded() just like express.json() converts request body to JSON, it also carries out some other functionalities like: converting form-data to JSON etc.

app.use("/api/seed", seedRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

app.use((err, req, res, next) => {
  res.status(500).send({ error: err.message });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
