const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbFileName = 'tasks.db';
const dataDir = path.join(__dirname, 'data');
const dbPath = path.join(dataDir, dbFileName);

// Ensure the data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log(`Database directory created: ${dataDir}`);
}

const db = new Database(dbPath);

const createTasksTable = db.prepare(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.transaction(() => {
  createTasksTable.run();
})();

module.exports = db;