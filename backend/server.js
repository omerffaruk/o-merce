import express from "express";
import data from "./data.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

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

const port = process.env.PORT || 5000;

app.get("/api/products", (req, res) => {
  // res.sendStatus(404).send({ message: "No products found!" });
  res.send(data);
});

app.get("/api/products/slug/:slug", (req, res) => {
  const product = data.products.find((p) => p.slug === req.params.slug);
  if (product) {
    return res.send(product);
  } else {
    res.status(404).send({ message: "Product Not Found" });
  }
});

app.get("/api/products/:id", (req, res) => {
  const product = data.products.find((p) => p._id === req.params.id);
  if (product) {
    return res.send(product);
  } else {
    res.status(404).send({ message: "Product Not Found" });
  }
});

app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
