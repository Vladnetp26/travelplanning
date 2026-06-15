# Планировщик поездок

Курсовая работа по теме: **«Разработка веб-приложения для планирования поездок»**.

## Описание

Веб-приложение для планирования путешествий. Позволяет создавать поездки, составлять маршруты, отслеживать расходы и формировать список вещей в чемодане.

Перейти на сайт: https://travelplanning2026.ru/

## Возможности

- Регистрация и авторизация пользователей
- Создание и редактирование поездок
- Составление детального маршрута по дням
- Учёт расходов по категориям
- Контроль бюджета
- Список вещей в чемодане с отметками

## Технологический стек

### Backend
- Python 3.10
- Django 5.0
- Django REST Framework
- JWT-аутентификация (djangorestframework-simplejwt)
- SQLite (для разработки)

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router

### DevOps
- Docker
- Docker Compose
- Nginx

## Локальный запуск

### Через Docker Compose

```bash
docker compose up -d --build
```

http://localhost в браузере.

### Ручной запуск

Backend:
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

http://localhost:3000 в браузере.

## Структура проекта

```
планирования поездок/
├── backend/              # Django backend
│   ├── accounts/         # Аутентификация
│   ├── config/           # Настройки Django
│   ├── trips/            # Модели и API поездок
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/   # Компоненты
│   │   ├── context/      # Контекст авторизации
│   │   ├── pages/        # Страницы
│   │   └── services/     # API клиент
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
├── docker-compose.prod.yml
└── README.md
```

## Автор

Владислав Кравченко ПИН-бз-22-1
