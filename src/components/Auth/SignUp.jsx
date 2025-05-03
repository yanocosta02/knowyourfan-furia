// src/components/Auth/SignUp.jsx
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebaseConfig';
import { Link } from 'react-router-dom';
import styles from './Auth.module.css';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
        setError("A senha precisa ter no mínimo 6 caracteres.");
        return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error("Erro no Cadastro:", err.code, err.message);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este email já está cadastrado.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Formato de email inválido.');
      }
       else {
        setError('Falha ao cadastrar. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2>Criar Conta</h2>
      <form onSubmit={handleSignUp} className={styles.authForm}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email" id="email" value={email}
            onChange={(e) => setEmail(e.target.value)} required
            className={styles.inputField}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Senha:</label>
          <input
            type="password" id="password" value={password}
            onChange={(e) => setPassword(e.target.value)} required
            className={styles.inputField}
          />
        </div>
         <div className={styles.formGroup}>
           <label htmlFor="confirmPassword">Confirmar Senha:</label>
           <input
             type="password" id="confirmPassword" value={confirmPassword}
             onChange={(e) => setConfirmPassword(e.target.value)} required
             className={styles.inputField}
           />
         </div>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <button type="submit" disabled={loading} className={styles.authButton}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
      <p className={styles.authSwitch}>
        Já tem uma conta? <Link to="/login">Faça Login</Link>
      </p>
    </div>
  );
}
export default SignUp;