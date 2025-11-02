let decks = JSON.parse(localStorage.getItem('decks')) || [];
let currentDeckId = null;


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

function viewDeck(deckId) {
    currentDeckId = deckId;
    const deck = decks.find(d => d.id === deckId);
    
    document.getElementById('currentDeckTitle').textContent = deck.name;
    document.getElementById('cardsSection').style.display = 'block';
    
    renderCards();
}


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

function addCard() {
    if (!currentDeckId) {
        alert('Сначала откройте колоду!');
        return;
    }
    
    const questionInput = document.getElementById('cardQuestion');
    const answerInput = document.getElementById('cardAnswer');
    
    const question = questionInput.value.trim();
    const answer = answerInput.value.trim();

    if (question === '' || answer === '') {
        alert('Заполните вопрос и ответ!');
        return;
    }

    const deck = decks.find(d => d.id === currentDeckId);
    const newCard = {
        id: Date.now(),
        question: question,
        answer: answer,
        createdAt: new Date().toISOString()
    };

    deck.cards.push(newCard);
    localStorage.setItem('decks', JSON.stringify(decks));
    

    questionInput.value = '';
    answerInput.value = '';
    

    renderCards();
    renderDecks(); 
    questionInput.focus();
}

function renderCards() {
    const cardsList = document.getElementById('cardsList');
    cardsList.innerHTML = '';

    const deck = decks.find(d => d.id === currentDeckId);
    if (!deck) return;

    if (deck.cards.length === 0) {
        cardsList.innerHTML = '<li style="text-align: center; color: #666;">В этой колоде пока нет карточек</li>';
        return;
    }

    deck.cards.forEach((card, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="card-content">
                <div class="card-question"><strong>Вопрос:</strong> ${card.question}</div>
                <div class="card-answer"><strong>Ответ:</strong> ${card.answer}</div>
                <div class="card-meta">Карточка ${index + 1} из ${deck.cards.length}</div>
            </div>
            <button class="delete-btn" onclick="deleteCard(${card.id})">🗑️ Удалить</button>
        `;
        cardsList.appendChild(li);
    });
}

function deleteCard(cardId) {
    if (!confirm('Удалить эту карточку?')) {
        return;
    }

    const deck = decks.find(d => d.id === currentDeckId);
    deck.cards = deck.cards.filter(c => c.id !== cardId);
    localStorage.setItem('decks', JSON.stringify(decks));
    renderCards();
    renderDecks(); 
}

function setupEnterKey() {
    const questionInput = document.getElementById('cardQuestion');
    const answerInput = document.getElementById('cardAnswer');
    
    questionInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            answerInput.focus();
        }
    });
    
    answerInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addCard();
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    renderDecks();
    setupEnterKey();
    
    const lastDeckId = localStorage.getItem('lastDeckId');
    if (lastDeckId) {
        const deckExists = decks.some(d => d.id === parseInt(lastDeckId));
        if (deckExists) {
            viewDeck(parseInt(lastDeckId));
        }
    }
});
