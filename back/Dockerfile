FROM python:3.11-slim

WORKDIR /src

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Installation des dépendances
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copie du reste du code
COPY . .

EXPOSE 8000

CMD ["fastapi", "dev", "src/main.py", "--host", "0.0.0.0"]