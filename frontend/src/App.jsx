import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserPanel from './pages/UserPanel';
import AdminPanel from './pages/AdminPanel';
import AdminLogin from './components/AdminLogin';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header style={{ marginBottom: '3rem', borderBottom: '1px solid #333', paddingBottom: '1.5rem', textAlign: 'left' }}>
          <h1>🍕 Point Break</h1>
        </header>

        <Routes>
          <Route path="/" element={<UserPanel />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
