-- Нормализована до 3NF

-- Таблица пользователей
CREATE TABLE Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Таблица колод
CREATE TABLE Decks (
    deck_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    user_id INTEGER NOT NULL,
    is_public BOOLEAN DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Таблица карточек
CREATE TABLE Cards (
    card_id INTEGER PRIMARY KEY AUTOINCREMENT,
    deck_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    explanation TEXT,
    difficulty_level INTEGER DEFAULT 1, -- 1-5 сложность
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (deck_id) REFERENCES Decks(deck_id) ON DELETE CASCADE
);

-- Таблица сессий обучения
CREATE TABLE StudySessions (
    session_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    deck_id INTEGER NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT,
    cards_studied INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    session_type TEXT DEFAULT 'learning', -- learning/review
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (deck_id) REFERENCES Decks(deck_id) ON DELETE CASCADE
);

-- Таблица оценок карточек (интервальное повторение)
CREATE TABLE CardReviews (
    review_id INTEGER PRIMARY KEY AUTOINCREMENT,
    card_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    rating TEXT NOT NULL CHECK(rating IN ('again', 'hard', 'good', 'easy')),
    review_date TEXT NOT NULL,
    next_review_date TEXT NOT NULL,
    interval_days INTEGER DEFAULT 1,
    ease_factor REAL DEFAULT 2.5,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (card_id) REFERENCES Cards(card_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Таблица медиа-файлов
CREATE TABLE MediaFiles (
    media_id INTEGER PRIMARY KEY AUTOINCREMENT,
    card_id INTEGER NOT NULL,
    file_type TEXT NOT NULL CHECK(file_type IN ('image', 'audio')),
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    uploaded_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (card_id) REFERENCES Cards(card_id) ON DELETE CASCADE
);

-- Таблица тегов для карточек
CREATE TABLE Tags (
    tag_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT DEFAULT '#3498db',
    created_at TEXT DEFAULT (datetime('now'))
);

-- Связь многие-ко-многим между карточками и тегами
CREATE TABLE CardTags (
    card_id INTEGER,
    tag_id INTEGER,
    assigned_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (card_id, tag_id),
    FOREIGN KEY (card_id) REFERENCES Cards(card_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES Tags(tag_id) ON DELETE CASCADE
);

-- Индексы для оптимизации производительности
CREATE INDEX idx_decks_user_id ON Decks(user_id);
CREATE INDEX idx_cards_deck_id ON Cards(deck_id);
CREATE INDEX idx_study_sessions_user_id ON StudySessions(user_id);
CREATE INDEX idx_study_sessions_deck_id ON StudySessions(deck_id);
CREATE INDEX idx_card_reviews_user_id ON CardReviews(user_id);
CREATE INDEX idx_card_reviews_card_id ON CardReviews(card_id);
CREATE INDEX idx_card_reviews_next_review ON CardReviews(next_review_date);
CREATE INDEX idx_media_files_card_id ON MediaFiles(card_id);
CREATE INDEX idx_card_tags_card_id ON CardTags(card_id);
CREATE INDEX idx_card_tags_tag_id ON CardTags(tag_id);
