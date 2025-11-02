// База данных в localStorage
let decks = JSON.parse(localStorage.getItem('decks')) || [];
let currentDeckId = null;

// Функция создания колоды
function createDeck() {
    const deckNameInput = document.getElementById('deckName');
    const deckName = deckNameInput.value.trim();

    if (deckName === '') {
        alert('Введите название колоды!');
        return;
    }

    const newDeck = {
        id: Date.now(),
        name: deckName,
        cards: []
    };

    decks.push(newDeck);
    localStorage.setItem('decks', JSON.stringify(decks));
    
    deckNameInput.value = '';
    renderDecks();
}

// Функция отображения колод
function renderDecks() {
    const decksList = document.getElementById('decksList');
    decksList.innerHTML = '';

    decks.forEach(deck => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${deck.name} (${deck.cards.length} карточек)</span>
            <div>
                <button onclick="viewDeck(${deck.id})">Открыть</button>
                <button onclick="deleteDeck(${deck.id})">Удалить</button>
            </div>
        `;
        decksList.appendChild(li);
    });
}

// Функция просмотра колоды
function viewDeck(deckId) {
    currentDeckId = deckId;
    const deck = decks.find(d => d.id === deckId);
    
    document.getElementById('currentDeckTitle').textContent = deck.name;
    document.getElementById('cardsSection').style.display = 'block';
    
    renderCards();
}

// Функция удаления колоды
function deleteDeck(deckId) {
    if (confirm('Удалить эту колоду?')) {
        decks = decks.filter(d => d.id !== deckId);
        localStorage.setItem('decks', JSON.stringify(decks));
        renderDecks();
        
        if (currentDeckId === deckId) {
            document.getElementById('cardsSection').style.display = 'none';
            currentDeckId = null;
        }
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', renderDecks);
