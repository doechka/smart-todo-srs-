# Smart Cards API Documentation

## Mock Server URL
`https://aaaa1b48-7176-40d0-b346-5f3b6282d05d.mock.pstmn.io`

## Endpoints

### Authentication
- `POST /auth/login` - авторизация пользователя

### Decks
- `GET /decks` - получить все колоды
- `POST /decks` - создать колоду
- `PUT /decks/:id` - обновить колоду
- `DELETE /decks/:id` - удалить колоду

### Cards
- `GET /decks/:id/cards` - получить карточки колоды
- `POST /decks/:id/cards` - создать карточку
- `PUT /cards/:id` - обновить карточку
- `DELETE /cards/:id` - удалить карточку

### Study
- `POST /study/sessions` - начать сессию обучения
- `POST /cards/:id/reviews` - оценить карточку

### Statistics
- `GET /statistics` - получить статистику
- `GET /progress` - получить прогресс обучения

## Examples

### Login
Name: Success - Login
URL: {{base_url}}/auth/login?username=test_user
Error - Invalid credentials
URL: {{base_url}}/auth/login?username=wrong_user

### Get All Decks
Name: Success - With decks
URL: {{base_url}}/decks
Name: Success - Empty list
URL: {{base_url}}/decks?empty=true

### Create Deck
Name: Success - Deck created
URL: {{base_url}}/decks
Name: Error - Validation failed
URL: {{base_url}}/decks

### Create Card
Name: Success - Card created
URL: {{base_url}}/decks/1/cards
Name: Error - Card already exists
URL: {{base_url}}/decks/1/cards

### Start Study Session
Name: Success - Session started
URL: {{base_url}}/study/sessions

### Submit Card Review
Name: Success - Review saved
URL: {{base_url}}/cards/1/reviews

### Get Statistics
Name: Success - User statistics
URL: {{base_url}}/statistics

### Get Learning Progress
Name: Success - Progress data
URL: {{base_url}}/progress?period=week
