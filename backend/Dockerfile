FROM python:3.11-slim

ENV PYTHONUNBUFFERD True

ENV APP_HOME /app
WORKDIR $APP_HOME

RUN pip install poetry

COPY pyproject.toml poetry.lock* /app/

RUN poetry config virtualenvs.create false \
  && poetry install --no-dev

COPY . ./

# RUN pip install --no-cache-dir -r requirements.txt

# CMD exec gunicorn --bind :8080 --workers 1 --threads 8 --timeout 0 main:app

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]