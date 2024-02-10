#!/bin/bash

cd /app/app && uvicorn main:app --reload --port=80 --host=0.0.0.0