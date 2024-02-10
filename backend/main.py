import os

from flask import Flask

app = Flask(__name__)

@app.route("/api/<int:api_id>")
def show_api(api_id):
    return f"Api {api_id}"
