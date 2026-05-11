const loginBlock = document.getElementById('loginBlock');
const app = document.getElementById('app');
const cardsContainer = document.getElementById('cards');
const loginBtn = document.getElementById('loginBtn');

let cards = {};

window.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch('/cards');

  if (response.ok) {
    loginBlock.classList.add('hidden');
    app.classList.remove('hidden');

    cards = await response.json();

    renderCards();
  }
});

loginBtn.addEventListener('click', async () => {
  const login = document.getElementById('login').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ login, password }),
    });

    if (!response.ok) {
      alert('Невірний логін або пароль');
      return;
    }

    loginBlock.classList.add('hidden');
    app.classList.remove('hidden');

    await loadCards();
  } catch (error) {
    console.error(error);
    alert('Помилка зʼєднання');
  }
});

async function loadCards() {
  try {
    const response = await fetch('/cards');

    if (!response.ok) {
      throw new Error('Unauthorized');
    }

    cards = await response.json();

    renderCards();
  } catch (error) {
    console.error(error);
  }
}

function renderCards() {
  cardsContainer.innerHTML = '';

  Object.entries(cards).forEach(([id, value]) => {
    const card = document.createElement('div');
    card.className = 'card';

    const number = document.createElement('div');
    number.className = 'card-number';
    number.textContent = id;

    const controls = document.createElement('div');
    controls.className = 'controls';

    const minus = document.createElement('button');
    minus.type = 'button';
    minus.textContent = '-1';

    const input = document.createElement('input');
    input.type = 'number';
    input.min = '1';
    input.step = '1';
    input.value = value;

    const plus = document.createElement('button');
    plus.type = 'button';
    plus.textContent = '+1';

    minus.addEventListener('click', async () => {
      const current = Number(input.value);

      if (current <= 1) {
        return;
      }

      const newValue = current - 1;

      input.value = newValue;

      await updateCard(id, newValue);
    });

    plus.addEventListener('click', async () => {
      const current = Number(input.value);

      const newValue = current + 1;

      input.value = newValue;

      await updateCard(id, newValue);
    });

    input.addEventListener('change', async () => {
      let newValue = parseInt(input.value, 10);

      if (Number.isNaN(newValue) || newValue < 1) {
        newValue = 1;
      }

      input.value = newValue;

      await updateCard(id, newValue);
    });

    controls.append(minus, input, plus);

    card.append(number, controls);

    cardsContainer.appendChild(card);
  });
}

async function updateCard(id, value) {
  cards[id] = value;

  try {
    await fetch('/cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cards),
    });
  } catch (error) {
    console.error(error);
  }
}