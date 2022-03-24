import express from "express";
import data from "./data.js";
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

app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
