// src/App.jsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  NavLink, // <<< USA NAVLINK
} from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";
import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/SignUp";
import Profile from "./components/Profile/Profile";
import "./App.css"; // <<< IMPORTA APP.CSS
// <<< IMPORTA ÍCONES >>>
import {
  FaSignInAlt,
  FaUserPlus,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";

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
    // Usa classe de app.css
    return <div className="loading-screen">Verificando autenticação...</div>;
  }

  // Função helper para classe ativa do NavLink
  const getNavLinkClass = ({ isActive }) => {
    // Combina a classe base com 'active' se isActive for true
    return isActive ? "nav-link active" : "nav-link";
  };

  return (
    <Router>
      {/* Usa classe de app.css */}
      <div className="App">
        {/* Usa classe de app.css */}
        <header className="App-header">
          <h1>Fala Comigo, Furioso!</h1> {/* Título Atualizado */}
          {/* Usa classe de app.css */}
          <nav className="app-nav">
            {!user ? (
              <>
                {/* Usa NavLink com helper de classe e ícones */}
                <NavLink to="/login" className={getNavLinkClass}>
                  <FaSignInAlt /> Login
                </NavLink>
                <NavLink to="/signup" className={getNavLinkClass}>
                  <FaUserPlus /> Cadastro
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/profile" className={getNavLinkClass}>
                  <FaUserCircle /> Meu Perfil
                </NavLink>
                {/* Usa classes base e específica para o botão */}
                <button
                  onClick={handleLogout}
                  className="nav-link logout-button" // Aplica ambas as classes
                >
                  <FaSignOutAlt /> Logout <span>({user.email})</span>
                </button>
              </>
            )}
          </nav>
        </header>

        {/* Usa classe de app.css */}
        <main className="App-main">
          <Routes>
            {/* Rotas Públicas */}
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/profile" replace />}
            />
            <Route
              path="/signup"
              element={!user ? <SignUp /> : <Navigate to="/profile" replace />}
            />

            {/* Rota Protegida */}
            <Route
              path="/profile"
              element={
                user ? (
                  <Profile userId={user.uid} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Rota Raiz */}
            <Route
              path="/"
              element={
                user ? (
                  <Navigate to="/profile" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Rota Não Encontrada */}
            <Route path="*" element={<div>Página não encontrada</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
