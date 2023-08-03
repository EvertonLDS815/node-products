require("dotenv").config();
const connetToDb = require("./database/db");

const express = require("express");
const app = express();
const port = process.env.PORT || 300;
const cors = require("cors");

app.use(express.json());
app.use(cors());
const Product = require("./model/product");

connetToDb();

app.get("/", async (req, res) => {
  const ports = await Product.find();
  res.json(ports);
});

app.post("/ins", async (req, res) => {
  const newPort = req.body;
  await Product.create(newPort);

  res.status(201).json(newPort);
});

app.listen(port, () => console.log(`🚀 Meu site http://localhost:${port}`));
