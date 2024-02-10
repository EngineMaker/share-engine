FROM python:3.11-slim

ENV PYTHONUNBUFFERD True

ENV APP_HOME /app
WORKDIR $APP_HOME

# pycryptoのコンパイルに必要そうだったので追加(pycrypto削除したので一旦コメントアウト)
# RUN apt-get update && apt-get install -y build-essential
RUN pip install poetry

COPY pyproject.toml poetry.lock* /app/

RUN poetry config virtualenvs.create false \
  && poetry install --no-dev

COPY ./app ./app
COPY ./scripts ./scripts

# RUN pip install --no-cache-dir -r requirements.txt

# CMD exec gunicorn --bind :8080 --workers 1 --threads 8 --timeout 0 main:app

# CMD exec gunicorn --bind :8080 --workers 1 --threads 8 --timeout 0 main:app

CMD ["bash", "./scripts/run.sh"]
