/* ------------- THEME ------------- */
const select = document.getElementById('theme-select');

selectedTheme = localStorage.getItem('theme')
document.body.classList.add(selectedTheme)
select.value = selectedTheme;
select.addEventListener('change', () => {
  document.body.classList = ''
  localStorage.setItem('theme', select.value);
  document.body.classList.add(select.value);
});

const icons = [
  '🔥', '⚡', '🌟', '🍀',
  '🎵', '💎', '🎯', '🦄',
  '🐱', '🐶', '🍎', '🍇',
  '🚀', '🌈', '🌹', '🎲'
];

/* ------------- UI ------------- */
const reset = document.getElementById('reset');
reset.addEventListener('click', () => {
  const container = document.getElementById('card-grid');
  container.classList.add('fade-out');

  setTimeout(() => {
    resetGame();
    container.classList.remove('fade-out');
    container.classList.add('fade-in');
  }, 300);
  container.classList.remove('fade-in');
});

/* ------------- CARD ------------- */
let cards = [];

function shuffle(array) {
  for(let i = array.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const cardGrid = document.getElementById('card-grid');

function resetGame() {
  cardGrid.innerHTML = '';
  createGame()
}

function createGame() {
  const shuffledIndexes = shuffle([...Array(icons.length).keys(), ...Array(icons.length).keys()]);

  shuffledIndexes.forEach((iconIndex, i) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.id = iconIndex;
    cardGrid.appendChild(card);

    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');
    card.appendChild(cardInner);

    const cardFront = document.createElement('div');
    cardFront.classList.add('card-front');
    cardFront.textContent = '';
    cardInner.appendChild(cardFront);

    const cardBack = document.createElement('div');
    cardBack.classList.add('card-back');
    cardInner.appendChild(cardBack);

    card.addEventListener('click', () => {
      const selectedCards = document.querySelectorAll('[data-clicked="true"]');
      if (selectedCards.length < 2 && !card.hasAttribute('data-clicked') && !card.hasAttribute('data-disabled')) {
        cardBack.textContent = icons[iconIndex];
        card.classList.add('flipped');
        card.setAttribute('data-clicked', 'true');

        const updatedSelected = document.querySelectorAll('[data-clicked="true"]');
        if (updatedSelected.length === 2) {
          setTimeout(() => {
            const [card1, card2] = updatedSelected;

            const icon1 = card1.querySelector('.card-back').textContent;
            const icon2 = card2.querySelector('.card-back').textContent;

            const back1 = card1.querySelector('.card-back');
            const back2 = card2.querySelector('.card-back');

            if (icon1 === icon2) {
              [card1, card2].forEach(c => c.removeAttribute('data-clicked'));
              [card1, card2].forEach(c => c.setAttribute('data-disabled', 'true'));
              [back1, back2].forEach(b => b.classList.add('card-correct'));
            } else {
              [card1, card2].forEach(c => c.classList.add('shake'));
              [back1, back2].forEach(b => b.classList.add('card-wrong'));

              setTimeout(() => {
                [card1, card2].forEach(c => {
                  c.classList.remove('flipped', 'shake');
                  c.removeAttribute('data-clicked');
                });
                [back1, back2].forEach(b => {
                  b.classList.remove('card-wrong');
                  b.textContent = '';
                });
              }, 800);
            }
          }, 500);
        }
      }
    });
  });
}
createGame();