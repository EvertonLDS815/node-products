require('dotenv').config();
const connetToDb = require('./database/db');
const http = require('http');
const { Server } = require('socket.io');
const express = require('express');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 300;
const cors = require('cors');

app.use(express.json());
app.use(cors());
const Product = require('./model/product');

connetToDb();

app.get('/', async (req, res) => {
  const ports = await Product.find();
  res.json(ports);
});

app.post('/ins', async (req, res) => {
  const newPort = req.body;
  const product = await Product.create(newPort);

  const productDetails = await product.populate();
  io.emit('orders@new', productDetails);

  res.status(201).json(product);
});
app.put('/ins/:id', async (req, res) => {
  const { id } = req.params;
  const { name, image, description, quantity, code } = req.body;
  const product = await Product.findByIdAndUpdate(id, {
    name,
    image,
    description,
    quantity,
    code,
  });

  res.sendStatus(204);
});
app.delete('/ins/:id', async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);

  res.sendStatus(204);
});

server.listen(port, () => console.log(`🚀 Meu site http://localhost:${port}`));
