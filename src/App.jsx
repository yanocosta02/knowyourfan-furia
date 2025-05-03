import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebaseConfig'; // Importa de nosso config direto
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import Profile from './components/Profile/Profile';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
      alert("Erro ao sair.");
    }
  };

  if (loadingAuth) {
    return <div className="loading-screen">Verificando autenticação...</div>;
  }

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Plataforma Fã de Esports (Config Direta - TEMP)</h1>
          <nav>
            {!user ? (
              <>
                <Link to="/login">Login</Link>
                <Link to="/signup">Cadastro</Link>
              </>
            ) : (
              <>
                <Link to="/profile">Meu Perfil</Link>
                <button onClick={handleLogout} className="logout-button">
                  Logout ({user.email})
                </button>
              </>
            )}
          </nav>
        </header>

        <main className="App-main">
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/profile" replace />} />
            <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/profile" replace />} />

            {/* Rota Protegida */}
            <Route
              path="/profile"
              element={user ? <Profile userId={user.uid} /> : <Navigate to="/login" replace />}
            />

            {/* Rota Raiz */}
            <Route path="/" element={user ? <Navigate to="/profile" replace /> : <Navigate to="/login" replace />} />

            {/* Rota Não Encontrada (Opcional) */}
            <Route path="*" element={<div>Página não encontrada</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;