-- Тестовые данные для приложения "Умные карточки"

-- Добавляем тестового пользователя
INSERT INTO Users (username, email, password_hash) VALUES 
('test_user', 'test@example.com', 'hashed_password_123');

-- Добавляем колоды
INSERT INTO Decks (name, description, user_id, is_public) VALUES 
('Английские слова', 'Основные английские слова для начинающих', 1, 1),
('Программирование', 'Термины и концепции программирования', 1, 1),
('История', 'Важные исторические даты и события', 1, 0);

-- Добавляем карточки в колоду "Английские слова"
INSERT INTO Cards (deck_id, question, answer, difficulty_level) VALUES 
(1, 'Hello', 'Привет', 1),
(1, 'Goodbye', 'До свидания', 1),
(1, 'Computer', 'Компьютер', 2),
(1, 'Algorithm', 'Алгоритм', 3);

-- Добавляем карточки в колоду "Программирование"
INSERT INTO Cards (deck_id, question, answer, explanation) VALUES 
(2, 'Что такое переменная?', 'Именованная область памяти', 'Переменная хранит данные, которые могут изменяться во время выполнения программы'),
(2, 'Что такое функция?', 'Блок кода, выполняющий определенную задачу', 'Функции помогают организовать код и избежать повторения'),
(2, 'ООП', 'Объектно-ориентированное программирование', 'Парадигма программирования, основанная на объектах');

-- Добавляем теги
INSERT INTO Tags (name, description, color) VALUES 
('базовый', 'Базовые понятия', '#27ae60'),
('продвинутый', 'Продвинутые темы', '#e74c3c'),
('vocabulary', 'Словарный запас', '#3498db'),
('concepts', 'Концепции и теории', '#9b59b6');

-- Связываем карточки с тегами
INSERT INTO CardTags (card_id, tag_id) VALUES 
(1, 1), (1, 3),
(2, 1), (2, 3),
(3, 2), (3, 3),
(4, 2),
(5, 1), (5, 4),
(6, 1), (6, 4),
(7, 2), (7, 4);

-- Добавляем записи об обучении (ИСПРАВЛЕНО: убран user_id)
INSERT INTO StudySessions (deck_id, start_time, end_time, cards_studied, correct_answers) VALUES 
(1, '2024-12-01 10:00:00', '2024-12-01 10:30:00', 10, 8),
(2, '2024-12-02 14:00:00', '2024-12-02 15:00:00', 15, 12);

-- Добавляем оценки карточек (ИСПРАВЛЕНО: убран user_id)
INSERT INTO CardReviews (card_id, rating, review_date, next_review_date, interval_days) VALUES 
(1, 'good', '2024-12-01 10:05:00', '2024-12-02 10:05:00', 1),
(2, 'easy', '2024-12-01 10:10:00', '2024-12-04 10:10:00', 3),
(3, 'hard', '2024-12-01 10:15:00', '2024-12-01 18:15:00', 0);

-- Добавляем медиа-файлы для демонстрации
INSERT INTO MediaFiles (card_id, file_type, file_name, file_path, file_size, mime_type) VALUES 
(1, 'image', 'hello.jpg', '/media/images/hello.jpg', 102400, 'image/jpeg'),
(3, 'audio', 'computer.mp3', '/media/audio/computer.mp3', 2048000, 'audio/mpeg');
