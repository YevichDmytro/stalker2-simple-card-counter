const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;

const SECRET = 'super_secret_key';

const USER = {
  login: 'admin01',
  password: 'admin02',
};

const dataPath = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

function auth(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    jwt.verify(token, SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

app.post('/login', (req, res) => {
  const { login, password } = req.body;

  if (login !== USER.login || password !== USER.password) {
    return res.status(401).json({ message: 'Wrong credentials' });
  }

  const token = jwt.sign({ login }, SECRET, {
    expiresIn: '7d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'strict',
  });

  res.json({ success: true });
});

app.get('/cards', auth, (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  res.json(data.cards);
});

app.post('/cards', auth, (req, res) => {
  const cards = req.body;

  fs.writeFileSync(dataPath, JSON.stringify({ cards }, null, 2), 'utf-8');

  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
