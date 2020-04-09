FROM python:3.7-slim-stretch

RUN apt-get update && apt-get install -y git python3-dev gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --upgrade -r requirements.txt

ADD server.py server.py
ADD export.pkl export.pkl
ADD fnames.csv fnames.csv

RUN python server.py

EXPOSE 5000

# Start the server
CMD ["python", "server.py", "serve"]
