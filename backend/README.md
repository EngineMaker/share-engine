## How to use?

Run in your terminal.

```sh
docker build -t hello-world-python .
docker run --rm -p 127.0.0.1:8080:8080 hello-world-python
```

## Setup development environment

1. install [python](https://wiki.python.org/moin/BeginnersGuide/Download)
2. install [poetry](https://python-poetry.org/docs/#installing-with-the-official-installer)
3. install python libraries

    ```sh
    poetry install
    ```

4. install pre-commit

    ```sh
    poetry run pre-commit install
    ```
