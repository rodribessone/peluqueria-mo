import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Appointments from './pages/Appointments';
import Store from './pages/Store';
import Admin from './pages/Admin';
import Login from './pages/Login';
import AIPreview from './pages/AIPreview';
import { isLoggedIn, getToken, removeToken, API } from './utils/api';

// Ruta protegida — verifica token con el servidor
function ProtectedRoute({ children }) {
  const [status, setStatus] = useState('checking'); // checking | ok | denied

  useEffect(() => {
    if (!isLoggedIn()) { setStatus('denied'); return; }
    fetch(`${API}/api/auth/verify`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getToken()}` },
    })
      .then(r => r.json())
      .then(d => {
        if (d.valid) { setStatus('ok'); }
        else { removeToken(); setStatus('denied'); } // token inválido → lo borramos para cortar el loop
      })
      .catch(() => setStatus('denied')); // si no podemos verificar, no dejamos pasar (el token queda guardado)
  }, []);

  if (status === 'checking') return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500" />
    </div>
  );

  return status === 'ok' ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/turnos" element={<Appointments />} />
        <Route path="/tienda" element={<Store />} />
        <Route path="/login" element={<Login />} />
        <Route path="/preview" element={<AIPreview />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}