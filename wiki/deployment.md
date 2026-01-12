# 🚀 Deployment

## Автоматический деплой (CI/CD)

GitHub Actions workflow: `.github/workflows/deploy.yml`

При push в `main` ветку:
1. Сборка проекта (`npm run build`)
2. Деплой на сервер через SCP

## Ручной деплой

### Скрипты

| Скрипт | Описание |
|--------|----------|
| `deploy_gcp.py` | Полный деплой через GCP API |
| `deploy.py` | Простой деплой через SSH |

### Процесс

```bash
# 1. Сборка
npm run build

# 2. Деплой
python3 deploy_gcp.py
```

### Файлы на сервере

| Путь | Описание |
|------|----------|
| `/var/www/97v.ru/` | Корень сайта |
| `/etc/nginx/sites-available/97v.ru` | Nginx конфиг |
| `/etc/bind/zones/db.97v.ru` | DNS зона |

---

## Конфигурация nginx

Файл: `nginx/97v.ru.conf`

```nginx
server {
    listen 80;
    server_name 97v.ru www.97v.ru;
    root /var/www/97v.ru;
    index index.html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Кэширование статики
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```
