import sqlite3 from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const db = new sqlite3.Database('./watch2gether.db');

export const run = (sql: string, params: any[] = []): Promise<{ lastID: number }> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID });
    });
  });
};

export const get = <T = any>(sql: string, params: any[] = []): Promise<T | undefined> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row as T);
    });
  });
};

export const all = <T = any>(sql: string, params: any[] = []): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows as T[]);
    });
  });
};

export const initDatabase = async () => {
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      avatar TEXT,
      join_date TEXT NOT NULL,
      preferences TEXT,
      created_at TEXT NOT NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS rooms (
      id TEXT PRIMARY KEY,
      room_code TEXT UNIQUE NOT NULL,
      creator_id TEXT NOT NULL,
      video_url TEXT,
      video_title TEXT,
      created_at TEXT NOT NULL,
      expires_at TEXT,
      is_active INTEGER DEFAULT 1,
      participants_count INTEGER DEFAULT 0,
      FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS room_participants (
      id TEXT PRIMARY KEY,
      room_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      joined_at TEXT NOT NULL,
      left_at TEXT,
      is_active INTEGER DEFAULT 1,
      FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(room_id, user_id)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS watch_history (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      video_url TEXT NOT NULL,
      video_title TEXT,
      watched_at TEXT NOT NULL,
      room_id TEXT,
      duration_watched INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  console.log('✅ Database initialized');
};

export const UserModel = {
  create: async (username: string, email: string, password: string) => {
    const id = uuidv4();
    const now = new Date().toISOString();
    const passwordHash = await bcrypt.hash(password, 10);
    
    await run(
      `INSERT INTO users (id, username, email, password_hash, join_date, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, username, email, passwordHash, now, now]
    );
    
    return { id, username, email };
  },

  findByEmail: async (email: string) => {
    return get(`SELECT * FROM users WHERE email = ?`, [email]);
  },

  findById: async (id: string) => {
    return get(`SELECT id, username, email, avatar, join_date, preferences FROM users WHERE id = ?`, [id]);
  },
};

export const SessionModel = {
  create: async (userId: string, token: string) => {
    const id = uuidv4();
    const now = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    
    await run(
      `INSERT INTO sessions (id, user_id, token, created_at, expires_at)
       VALUES (?, ?, ?, ?, ?)`,
      [id, userId, token, now, expiresAt]
    );
  },

  findByToken: async (token: string) => {
    return get(`SELECT * FROM sessions WHERE token = ?`, [token]);
  },

  delete: async (token: string) => {
    await run(`DELETE FROM sessions WHERE token = ?`, [token]);
  },
};