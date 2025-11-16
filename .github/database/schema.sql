-- Исправленная нормализованная схема БД

-- Таблица пользователей
CREATE TABLE Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица колод
CREATE TABLE Decks (
    deck_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    user_id INTEGER NOT NULL,
    is_public BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Таблица карточек
CREATE TABLE Cards (
    card_id INTEGER PRIMARY KEY AUTOINCREMENT,
    deck_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    explanation TEXT,
    difficulty_level INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (deck_id) REFERENCES Decks(deck_id) ON DELETE CASCADE
);

-- Таблица сессий обучения (ИСПРАВЛЕНА - убран user_id)
CREATE TABLE StudySessions (
    session_id INTEGER PRIMARY KEY AUTOINCREMENT,
    deck_id INTEGER NOT NULL,  -- достаточно связи через deck
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    cards_studied INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    session_type VARCHAR(20) DEFAULT 'learning',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (deck_id) REFERENCES Decks(deck_id) ON DELETE CASCADE
);

-- Таблица оценок карточек (ИСПРАВЛЕНА - убран user_id)
CREATE TABLE CardReviews (
    review_id INTEGER PRIMARY KEY AUTOINCREMENT,
    card_id INTEGER NOT NULL,  -- достаточно связи через card
    rating VARCHAR(10) NOT NULL CHECK(rating IN ('again', 'hard', 'good', 'easy')),
    review_date TIMESTAMP NOT NULL,
    next_review_date TIMESTAMP NOT NULL,
    interval_days INTEGER DEFAULT 1,
    ease_factor REAL DEFAULT 2.5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES Cards(card_id) ON DELETE CASCADE
);

-- Таблица медиа-файлов
CREATE TABLE MediaFiles (
    media_id INTEGER PRIMARY KEY AUTOINCREMENT,
    card_id INTEGER NOT NULL,
    file_type VARCHAR(10) CHECK(file_type IN ('image', 'audio')),
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES Cards(card_id) ON DELETE CASCADE
);

-- Таблица тегов
CREATE TABLE Tags (
    tag_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3498db',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица связи карточек и тегов
CREATE TABLE CardTags (
    card_id INTEGER,
    tag_id INTEGER,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (card_id, tag_id),
    FOREIGN KEY (card_id) REFERENCES Cards(card_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES Tags(tag_id) ON DELETE CASCADE
);

-- Индексы для оптимизации
CREATE INDEX idx_decks_user_id ON Decks(user_id);
CREATE INDEX idx_cards_deck_id ON Cards(deck_id);
CREATE INDEX idx_study_sessions_deck_id ON StudySessions(deck_id);
CREATE INDEX idx_card_reviews_card_id ON CardReviews(card_id);
CREATE INDEX idx_card_reviews_next_review ON CardReviews(next_review_date);
