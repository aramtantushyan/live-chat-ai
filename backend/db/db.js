import Database from 'better-sqlite3';

export const db = new Database('liveChatDB.db');

export function initialize() {
  db.prepare(
    `CREATE TABLE IF NOT EXISTS threads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      history TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )`
  ).run();

  db.prepare(`
    CREATE TRIGGER IF NOT EXISTS update_threads_updatedAt
    AFTER UPDATE ON threads
    FOR EACH ROW
    BEGIN
      UPDATE threads SET updatedAt = CURRENT_TIMESTAMP WHERE id = OLD.id;
    END;
  `).run();
};

export function run(query, params = []) {
  return db.prepare(query).run(params);
};

export function get(query, params = []) {
  return db.prepare(query).get(params);
};

export function all(query, params = []) {
  return db.prepare(query).all(params);
};
