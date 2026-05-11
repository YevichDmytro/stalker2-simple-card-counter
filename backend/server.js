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
    origin: '*',
  },
});

app.use(cors());
app.use(express.json());

const DATA_PATH = path.join('/tmp', 'data.json');
const PORT = process.env.PORT || 3000;

function getCards() {
  try {
    const data = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(data).cards;
  } catch (e) {
    return [];
  }
}

function saveCards(cards) {
  try {
    fs.writeFileSync(DATA_PATH, JSON.stringify({ cards }, null, 2), 'utf-8');
  } catch (e) {
    console.error('Save error:', e);
  }
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

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

server.listen(PORT, () => {
  console.log('Backend started on port', PORT);
});
