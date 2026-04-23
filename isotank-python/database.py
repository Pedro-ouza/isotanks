import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'isotank.db')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS reservas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            razao_social TEXT NOT NULL,
            cnpj TEXT NOT NULL,
            inscricao_estadual TEXT NOT NULL,
            cep TEXT NOT NULL,
            produto TEXT NOT NULL,
            telefone TEXT NOT NULL,
            status TEXT DEFAULT 'aguardando_aprovacao',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

# Initialize DB on import
init_db()
