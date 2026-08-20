# Logsearch
Log explorer web app. Built with FastAPI and React (Vite), using OpenSearch database.

## Getting started
1. After cloning the repo, copy `.env.example` files to single `.env` files for each main directories :
```bash
# Front-end and back-end
cp back/.env.example back/.env
cp front/.env.example front/.env
```


2. Run docker-compose :

```bash
docker-compose -f 'docker-compose.yml' up -d --build
```