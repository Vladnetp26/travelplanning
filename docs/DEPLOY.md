# Руководство по развёртыванию

## Требования

- Сервер с Ubuntu 22.04/24.04
- Docker и Docker Compose
- Доменное имя (опционально)

## Шаги

1. Подключитесь к серверу по SSH:
```bash
ssh root@ваш_ip
```

2. Установите Docker:
```bash
apt update
apt install -y docker.io docker-compose-plugin
systemctl enable --now docker
```

3. Загрузите проект на сервер:
```bash
scp -r ./планирования\ поездок root@ваш_ip:/root/
```

4. Перейдите в папку проекта:
```bash
cd /root/планирования\ поездок
```

5. Установите секретный ключ:
```bash
export SECRET_KEY='ваш_сложный_секретный_ключ'
```

6. Запустите проект:
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

7. Откройте сайт в браузере:
```
http://ваш_ip
```

## SSL-сертификат (HTTPS)

```bash
apt install -y certbot
certbot certonly --standalone -d ваш_домен
```

Обновите `CSRF_TRUSTED_ORIGINS` и `ALLOWED_HOSTS` в `docker-compose.prod.yml`.
