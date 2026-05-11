const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
  },
});

app.use(cors());
app.use(express.json());

const DATA_PATH = path.join(__dirname, 'data.json');

function getCards() {
  const data = fs.readFileSync(DATA_PATH, 'utf-8');

  return JSON.parse(data).cards;
}

function saveCards(cards) {
  fs.writeFileSync(DATA_PATH, JSON.stringify({ cards }, null, 2), 'utf-8');
}

app.get('/cards', (req, res) => {
  const cards = getCards();

  res.json(cards);
});

app.post('/cards', (req, res) => {
  const cards = req.body;

  saveCards(cards);

  io.emit('cardsUpdated', cards);

  res.json({ success: true });
});

io.on('connection', socket => {
  console.log('User connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3000, () => {
  console.log('Backend started on port 3000');
});
