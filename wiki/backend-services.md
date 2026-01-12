# 🔧 Backend Services

## Обзор архитектуры

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Frontend       │────▶│  Product Service │────▶│ Procurement     │
│  (React/Vite)   │     │  (API + Workers) │     │ Brain (AI)      │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                       │                        │
        └───────────────────────┴────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │  Infrastructure       │
                    │  PostgreSQL, Redis,   │
                    │  Kafka, Prometheus    │
                    └───────────────────────┘
```

---

## 1. Procurement Brain

🧠 AI-сервис для парсинга строительных документов.

**Репозиторий:** [Zashita-LTD/procurement-brain](https://github.com/Zashita-LTD/procurement-brain)

### Возможности

- **Pluggable Ingestion** — стратегия парсеров (PDF, CAD, BIM, Images)
- **Human-in-the-Loop** — механизм обратной связи
- **Few-Shot Learning** — использование исправленных примеров
- **Fine-Tuning Ready** — сбор данных для обучения модели

### Технологии

| Компонент | Технология |
|-----------|------------|
| Backend | Python 3.11+, FastAPI |
| ORM | SQLAlchemy 2.0 (async) |
| Database | PostgreSQL 16 |
| Queue | Kafka |
| AI | Google Gemini |
| Migrations | Alembic |

### Расположение на сервере

```
~/procurement-brain/
├── app/                 # FastAPI приложение
│   ├── api/v1/          # Endpoints
│   ├── ai/              # Gemini AI клиент
│   ├── ingestion/       # Парсеры документов
│   └── kafka/           # Kafka producer
├── migrations/          # Alembic миграции
├── docker-compose.yml   # Docker конфигурация
└── .env                 # Переменные окружения
```

### Запуск

```bash
cd ~/procurement-brain
docker-compose up -d
```

### Endpoints

| Endpoint | Метод | Описание |
|----------|-------|----------|
| `/api/v1/parse` | POST | Парсинг документа |
| `/api/v1/feedback` | POST | Отправка обратной связи |
| `/api/v1/health` | GET | Health check |

---

## 2. Product Service

📦 Высоконагруженный микросервис для товарных семейств с AI-обогащением.

**Репозиторий:** [Zashita-LTD/Product_Service](https://github.com/Zashita-LTD/Product_Service)

### Архитектура (Clean Architecture)

| Слой | Назначение |
|------|------------|
| `cmd/` | Точки входа (API, Workers) |
| `internal/domain/` | Доменные сущности |
| `internal/usecase/` | Бизнес-логика |
| `internal/infrastructure/` | Внешние сервисы |
| `pkg/` | Переиспользуемые пакеты |

### Компоненты

| Сервис | Описание |
|--------|----------|
| **api** | REST API (FastAPI) |
| **worker-enrichment** | AI воркер (Gemini) |
| **worker-raw-products** | Импорт от Parser Service |
| **worker-sync** | Sync с Meilisearch |
| **parser** | Web scraping магазинов |

### Паттерны

- **Outbox Pattern** — гарантированная доставка событий
- **Circuit Breaker** — защита от каскадных отказов
- **Cache-Aside с Jitter** — защита от cache stampede

### Расположение на сервере

```
~/Product_Service/
├── cmd/                 # Приложения
├── internal/            # Бизнес-логика
├── deploy/docker/       # Docker файлы
│   └── docker-compose.yml
├── migrations/          # SQL миграции
└── .env                 # Переменные окружения
```

### Запуск

```bash
cd ~/Product_Service/deploy/docker
docker-compose up -d
```

### Сервисы (docker-compose)

| Сервис | Порт | Описание |
|--------|------|----------|
| api | 8000 | REST API |
| postgres | 5432 | PostgreSQL 16 |
| redis | 6379 | Redis cache |
| kafka | 9092 | Kafka broker |
| kafka-ui | 8080 | UI для Kafka |
| prometheus | 9090 | Мониторинг |
| grafana | 3000 | Дашборды |

---

## Общая инфраструктура

### Docker Networks

Оба сервиса используют отдельные Docker networks:
- `procurement-brain_default`
- `product-service_backend`

### Переменные окружения

**procurement-brain/.env:**
```env
DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/procurement_brain
KAFKA_BOOTSTRAP_SERVERS=kafka:9092
GOOGLE_CLOUD_PROJECT=viktor-integration
GEMINI_MODEL=gemini-1.5-pro
```

**Product_Service/.env:**
```env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/product_service
REDIS_URL=redis://redis:6379/0
KAFKA_BOOTSTRAP_SERVERS=kafka:29092
VERTEX_PROJECT_ID=viktor-integration
```

---

## Мониторинг

### Prometheus + Grafana

Product Service включает полный стек мониторинга:
- **Prometheus** — сбор метрик (порт 9090)
- **Grafana** — визуализация (порт 3000)
- **Alertmanager** — алертинг (порт 9093)

Доступ: http://34.140.4.125:3000 (admin/admin)

---

## TODO

- [ ] Настроить единую сеть Docker для всех сервисов
- [ ] Настроить reverse proxy через nginx для API
- [ ] Добавить SSL для API endpoints
- [ ] Настроить централизованное логирование (ELK/Loki)
