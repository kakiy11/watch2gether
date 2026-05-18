import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

const db = new Database('./dev.db');

function main() {
  console.log('🌱 Seeding database...');

  try {
    // Проверяем есть ли уже пользователь
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get('test@example.com');
    
    let testUser;
    
    if (!existingUser) {
      // Создаем тестового пользователя
      const password_hash = bcrypt.hashSync('password123', 10);
      const insertUser = db.prepare(`
        INSERT INTO users (id, username, email, password_hash, join_date, created_at, preferences)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      const userId = 'test-user-' + Date.now();
      const now = new Date().toISOString();
      const preferences = JSON.stringify({
        theme: 'dark',
        language: 'English',
        notifications: true
      });
      
      insertUser.run(userId, 'testuser', 'test@example.com', password_hash, now, now, preferences);
      
      testUser = { id: userId, username: 'testuser' };
      console.log('✅ Created test user:', testUser.username);
    } else {
      testUser = existingUser;
      console.log('ℹ️ Test user already exists:', existingUser.username);
    }

    // Проверяем есть ли уже комната
    const existingRoom = db.prepare('SELECT * FROM rooms WHERE room_code = ?').get('test123');
    
    if (!existingRoom) {
      // Создаем тестовую комнату
      const roomId = 'test-room-' + Date.now();
      const now = new Date().toISOString();
      
      const insertRoom = db.prepare(`
        INSERT INTO rooms (id, room_code, creator_id, created_at, is_active)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      insertRoom.run(roomId, 'test123', testUser.id, now, 1);
      
      console.log('✅ Created test room: test123');
    } else {
      console.log('ℹ️ Test room already exists: test123');
    }

    console.log('🎉 Seeding complete!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

main();