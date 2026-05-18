import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { initDatabase, UserModel, SessionModel } from './database';

const app = express();
const PORT = 3001;
const JWT_SECRET = 'watch2gether-secret-key-2024';

app.use(cors());
app.use(express.json());

const authenticateToken = async (req: any, res: any, next: any) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const session = await SessionModel.findByToken(token);
    if (!session || new Date(session.expires_at) < new Date()) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.userId = session.user_id;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Auth failed' });
  }
};

app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existing = await UserModel.findByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const user = await UserModel.create(username, email, password);
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
    await SessionModel.create(user.id, token);
    
    res.json({ success: true, user, token });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
    await SessionModel.create(user.id, token);
    
    res.json({
      success: true,
      user: { id: user.id, username: user.username, email: user.email },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/logout', authenticateToken, async (req: any, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    await SessionModel.delete(token);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
});

app.get('/api/me', authenticateToken, async (req: any, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user' });
  }
});

initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});