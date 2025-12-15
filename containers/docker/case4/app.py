import os
import time
import requests
import mysql.connector
from flask import Flask, jsonify
from threading import Thread
import schedule

app = Flask(__name__)

DB_CONFIG = {
    'host': 'mysql1', #mysql1 adalah nama dari service docker mysql, karena menggunakan network bridge yang sama maka bisa langsung akses dengan nama service
    'user': 'root',
    'password': 'mysecretpassword',
    'database': 'mydb'
}

def get_db_connection():
    retries = 10
    while retries > 0:
        try:
            conn = mysql.connector.connect(**DB_CONFIG)
            return conn
        except Exception as e:
            print(f"Database connection failed, retrying in 5 seconds... ({e})")
            time.sleep(5)
            retries -= 1
    raise Exception("Failed to connect to the database after multiple attempts.")

def init_db():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
                       CREATE TABLE IF NOT EXISTS jokes
                       (id INT AUTO_INCREMENT PRIMARY KEY,
                           joke_text TEXT,
                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
                       """)
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error Init DB: {e}")

@app.route('/')
def home():
    return "Application is running. Access /fetch to fetch a joke or /jokes to see stored jokes."

def fetch_joke_task():
    url = "https://api.chucknorris.io/jokes/random"
    try:
        resp = requests.get(url).json()
        joke = resp.get('value')

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO jokes (joke_text) VALUES (%s)", (joke,))
        conn.commit()
        conn.close()

        return {"status": "success", "joke": joke}
    except Exception as e:
        return {"status": "error", "error": str(e)}

@app.route('/fetch')
def fetch_joke():
    result = fetch_joke_task()
    if result['status'] == 'sukses':
        return jsonify(result)
    else:
        return jsonify(result), 500

@app.route('/jokes')
def get_jokes():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM jokes ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return jsonify(rows)

def run_scheduler():
    schedule.every(2).minutes.do(fetch_joke_task)

    print("Background scheduler started. Fetching jokes every 2 minutes...")

    while True:
        schedule.run_pending()
        time.sleep(1)

if __name__ == '__main__':
    init_db()

    scheduler_thread = Thread(target=run_scheduler, daemon=True)
    scheduler_thread.start()

    print("Starting Flask app with background joke fetcher...")
    app.run(host='0.0.0.0', port=5000)

