// src/components/Auth/Login.jsx
import React, { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, TwitterAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../../firebaseConfig';
import { Link } from 'react-router-dom';
import styles from './Auth.module.css'; // Importa CSS Module
import { FaGoogle, FaTwitter } from 'react-icons/fa'; // Importa ícones

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState({ google: false, twitter: false });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Sucesso! Listener no App.jsx redireciona.
    } catch (err) {
      console.error("Erro no Login Email/Senha:", err.code, err.message);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-email') {
         setError('Email ou senha incorretos.');
       } else {
         setError('Falha ao fazer login. Tente novamente.');
       }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (providerName) => {
    let provider;
    setError(''); // Limpa erros anteriores
    setSocialLoading(prev => ({ ...prev, [providerName]: true })); // Ativa loading do botão específico

    if (providerName === 'google') {
      provider = new GoogleAuthProvider();
    } else if (providerName === 'twitter') {
      provider = new TwitterAuthProvider();
    } else {
      console.error("Provedor não suportado:", providerName);
      setSocialLoading(prev => ({ ...prev, [providerName]: false }));
      return;
    }

    try {
      await signInWithPopup(auth, provider);
      // Sucesso! Listener no App.jsx redireciona.
    } catch (error) {
      console.error(`Erro no login com ${providerName}:`, error);
       if (error.code === 'auth/account-exists-with-different-credential') {
         setError(`Uma conta já existe com este email, mas com método de login diferente. Tente o outro método.`);
       } else if (error.code === 'auth/popup-closed-by-user') {
           setError(`Login com ${providerName} cancelado.`);
       } else {
          setError(`Falha ao fazer login com ${providerName}. Verifique o console.`);
       }
    } finally {
        setSocialLoading(prev => ({ ...prev, [providerName]: false })); // Desativa loading do botão
    }
  };


  return (
    <div className={styles.authContainer}>
      <h2>Login</h2>
      <form onSubmit={handleLogin} className={styles.authForm}>
        {/* Email Input */}
        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email" id="email" value={email}
            onChange={(e) => setEmail(e.target.value)} required
          />
        </div>
        {/* Password Input */}
        <div className={styles.formGroup}>
          <label htmlFor="password">Senha:</label>
          <input
            type="password" id="password" value={password}
            onChange={(e) => setPassword(e.target.value)} required
          />
        </div>
        {/* Email/Senha Error Message */}
        {error && !socialLoading.google && !socialLoading.twitter && <p className={styles.errorMessage}>{error}</p>}

        {/* Email/Senha Submit Button */}
        <button type="submit" disabled={loading} className={styles.authButton}>
          {loading ? 'Entrando...' : 'Entrar com Email'}
        </button>
      </form>

      {/* Divider */}
      <div className={styles.socialLoginDivider}>
          <span>OU</span>
      </div>

      {/* Social Login Buttons */}
      <div className={styles.socialLoginButtons}>
        <button
          type="button"
          onClick={() => handleSocialLogin('google')}
          className={`${styles.socialButton} ${styles.googleButton}`}
          disabled={socialLoading.google || socialLoading.twitter || loading} // Desabilita durante qqr loading
        >
          {socialLoading.google ? 'Aguarde...' : <><FaGoogle /> Entrar com Google</>}
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin('twitter')}
          className={`${styles.socialButton} ${styles.twitterButton}`}
          disabled={socialLoading.google || socialLoading.twitter || loading}
        >
          {socialLoading.twitter ? 'Aguarde...' : <><FaTwitter /> Entrar com Twitter</>}
        </button>
        {/* Placeholders Desabilitados */}
        <button type="button" disabled className={`${styles.socialButton} ${styles.disabledButton}`}>
             Twitch (Em breve)
        </button>
        <button type="button" disabled className={`${styles.socialButton} ${styles.disabledButton}`}>
             Instagram (Em breve)
        </button>
      </div>
        {/* Social Login Error Message */}
        {error && (socialLoading.google || socialLoading.twitter) && <p className={styles.errorMessage}>{error}</p>}


      {/* Link para Cadastro */}
       <p className={styles.authSwitch}>
         Não tem uma conta? <Link to="/signup">Cadastre-se</Link>
       </p>
    </div>
  );
}
export default Login;