
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './auth.css';

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
   
    if (!username || !email || !password) {
      setError('Пожалуйста, заполните все поля');
      setLoading(false);
      return;
    }
    
    if (confirmPassword && password !== confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }
    
    if (password.length < 4) {
      setError('Пароль должен содержать минимум 4 символа');
      setLoading(false);
      return;
    }
    
    setTimeout(() => {
      
      localStorage.setItem('token', 'fake-token-' + Date.now());
      localStorage.setItem('user', JSON.stringify({ 
        username: username, 
        email: email 
      }));
      
      
      navigate('/Main');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="register-page">
      <div className="register-form">
        <h2>Регистрация</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль (мин. 4 символа)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Подтвердите пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
        <p>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  );
};

export default Registration;