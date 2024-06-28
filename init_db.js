const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS boardgames (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    purchase_date TEXT,
    play_count INTEGER,
    fun_rating INTEGER,
    sold_date TEXT
  )`);
});

db.close();
