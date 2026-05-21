// App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Auth from './auth/auth';
import Registration from './auth/registration';
import Main from './w2g/w2g';
import Profile from './w2g/Profile';
import WatchHistory from './w2g/WatchHistory';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Registration />} /> {/* Fixed syntax */}
      <Route 
        path="/Main" 
        element={
          <PrivateRoute>
            <Main />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/history" 
        element={
          <PrivateRoute>
            <WatchHistory />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default App;