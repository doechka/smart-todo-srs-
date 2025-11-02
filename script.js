let decks = JSON.parse(localStorage.getItem('decks')) || [];
let currentDeckId = null;
let learningCards = [];
let currentLearningIndex = 0;
let learningStats = JSON.parse(localStorage.getItem('learningStats')) || {};



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
        cards: [],
        createdAt: new Date().toISOString()
    };

    decks.push(newDeck);
    localStorage.setItem('decks', JSON.stringify(decks));
    
    deckNameInput.value = '';
    renderDecks();
    showNotification(`Колода "${deckName}" создана!`, 'success');
}


function renderDecks() {
    const decksList = document.getElementById('decksList');
    decksList.innerHTML = '';

    if (decks.length === 0) {
        decksList.innerHTML = `
            <li style="text-align: center; color: #666; font-style: italic;">
                У вас пока нет колод. Создайте первую колоду!
            </li>
        `;
        return;
    }

    decks.forEach(deck => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="deck-info">
                <strong>${deck.name}</strong>
                <span class="deck-stats">${deck.cards.length} карточек</span>
            </div>
            <div class="deck-actions">
                <button onclick="viewDeck(${deck.id})" class="view-btn">📂 Открыть</button>
                <button onclick="startLearning(${deck.id})" class="learn-btn">🎓 Учить</button>
                <button onclick="deleteDeck(${deck.id})" class="delete-btn">🗑️ Удалить</button>
            </div>
        `;
        decksList.appendChild(li);
    });
}

function viewDeck(deckId) {
    currentDeckId = deckId;
    const deck = decks.find(d => d.id === deckId);
    
    if (!deck) return;
    
    document.getElementById('currentDeckTitle').textContent = deck.name;
    document.getElementById('cardsSection').style.display = 'block';
    document.getElementById('learningSection').style.display = 'none';

    localStorage.setItem('lastDeckId', deckId);
    
    renderCards();
}


function deleteDeck(deckId) {
    const deck = decks.find(d => d.id === deckId);
    if (!deck) return;
    
    if (!confirm(`Удалить колоду "${deck.name}" и все её карточки?`)) {
        return;
    }

    decks = decks.filter(d => d.id !== deckId);
    localStorage.setItem('decks', JSON.stringify(decks));
    
    if (currentDeckId === deckId) {
        document.getElementById('cardsSection').style.display = 'none';
        currentDeckId = null;
        localStorage.removeItem('lastDeckId');
    }
    
    renderDecks();
    showNotification(`Колода "${deck.name}" удалена`, 'warning');
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
        createdAt: new Date().toISOString(),
        stats: {
            studied: 0,
            correct: 0,
            lastStudied: null
        }
    };

    deck.cards.push(newCard);
    localStorage.setItem('decks', JSON.stringify(decks));

    questionInput.value = '';
    answerInput.value = '';

    renderCards();
    renderDecks();

    questionInput.focus();
    
    showNotification('Карточка добавлена!', 'success');
}

function renderCards() {
    const cardsList = document.getElementById('cardsList');
    cardsList.innerHTML = '';

    const deck = decks.find(d => d.id === currentDeckId);
    if (!deck) return;

    if (deck.cards.length === 0) {
        cardsList.innerHTML = `
            <li style="text-align: center; color: #666; font-style: italic; padding: 30px;">
                В этой колоде пока нет карточек. Добавьте первую карточку!
            </li>
        `;
        return;
    }

    deck.cards.forEach((card, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="card-content">
                <div class="card-question">${card.question}</div>
                <div class="card-answer">${card.answer}</div>
                <div class="card-meta">
                    Карточка ${index + 1} из ${deck.cards.length} • 
                    Создана: ${new Date(card.createdAt).toLocaleDateString()}
                </div>
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
    const cardIndex = deck.cards.findIndex(c => c.id === cardId);
    
    if (cardIndex === -1) return;
    
    deck.cards.splice(cardIndex, 1);
    localStorage.setItem('decks', JSON.stringify(decks));
    renderCards();
    renderDecks();
    
    showNotification('Карточка удалена', 'warning');
}


function startLearning(deckId) {
    const deck = decks.find(d => d.id === deckId);
    if (!deck || deck.cards.length === 0) {
        alert('В этой колоде нет карточек для обучения!');
        return;
    }

    learningCards = [...deck.cards];
    currentLearningIndex = 0;
    
  
    document.getElementById('cardsSection').style.display = 'none';
    document.getElementById('learningSection').style.display = 'block';
    
    updateProgressInfo();
    
    showNextCard();
    
    showNotification(`Начато обучение колоды "${deck.name}"`, 'info');
}


function showNextCard() {
    if (currentLearningIndex >= learningCards.length) {
        finishLearning();
        return;
    }

    const card = learningCards[currentLearningIndex];
    
    document.getElementById('cardFront').textContent = card.question;
    document.getElementById('cardBack').textContent = card.answer;
    document.getElementById('cardBack').style.display = 'none';
    document.getElementById('ratingButtons').style.display = 'none';
    document.getElementById('showAnswerBtn').style.display = 'block';
    

    const learningCard = document.getElementById('learningCard');
    learningCard.classList.add('card-flip');
    setTimeout(() => learningCard.classList.remove('card-flip'), 600);
    
    learningCard.onclick = showAnswer;
    

    updateProgressInfo();
}


function showAnswer() {
    document.getElementById('cardBack').style.display = 'block';
    document.getElementById('ratingButtons').style.display = 'grid';
    document.getElementById('showAnswerBtn').style.display = 'none';
    

    const learningCard = document.getElementById('learningCard');
    learningCard.onclick = null;
    

    learningCard.classList.add('card-flip');
    setTimeout(() => learningCard.classList.remove('card-flip'), 600);
}


function rateCard(rating) {
    const currentCard = learningCards[currentLearningIndex];
    

    if (!currentCard.stats) {
        currentCard.stats = { studied: 0, correct: 0, lastStudied: null };
    }
    
    currentCard.stats.studied++;
    currentCard.stats.lastStudied = new Date().toISOString();
    
    if (rating === 'good' || rating === 'easy') {
        currentCard.stats.correct++;
    }
    

    const deck = decks.find(d => d.cards.some(c => c.id === currentCard.id));
    if (deck) {
        const cardIndex = deck.cards.findIndex(c => c.id === currentCard.id);
        deck.cards[cardIndex] = currentCard;
        localStorage.setItem('decks', JSON.stringify(decks));
    }
    

    currentLearningIndex++;
    showNextCard();
    

    const ratingMessages = {
        'again': 'Карточка будет повторена',
        'hard': 'Сложная карточка',
        'good': 'Хорошо!',
        'easy': 'Отлично! Легко!'
    };
    
    showNotification(ratingMessages[rating], 'info');
}


function finishLearning() {
    document.getElementById('learningSection').style.display = 'none';
    
    const studiedCount = currentLearningIndex;
    const deck = decks.find(d => d.id === currentDeckId);
    
    showNotification(
        `Обучение завершено! Изучено ${studiedCount} карточек из колоды "${deck.name}"`, 
        'success'
    );
    

    learningCards = [];
    currentLearningIndex = 0;
}


function exitLearning() {
    if (confirm('Прервать обучение?')) {
        document.getElementById('learningSection').style.display = 'none';
        learningCards = [];
        currentLearningIndex = 0;
        showNotification('Обучение прервано', 'warning');
    }
}

<
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
