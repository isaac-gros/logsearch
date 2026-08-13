# Logsearch
Log explorer web app. Built with FastAPI and React (Vite), using OpenSearch database.

## Getting started
1. After cloning the repo, copy `back/.env.example` to a single `.env` file :
```bash
cp back/.env.example back/.env
```

2. Run docker-compose :

```bash
docker-compose -f 'docker-compose.yml' up -d --build
```