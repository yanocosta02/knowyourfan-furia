// src/components/Auth/SignUp.jsx
import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { Link } from "react-router-dom";
import styles from "./Auth.module.css"; // Reutiliza o mesmo CSS Module
import { FaGoogle, FaTwitter } from "react-icons/fa"; // Importa ícones

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState({
    google: false,
    twitter: false,
  });

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
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
      // Sucesso! Listener no App.jsx redireciona.
    } catch (err) {
      console.error("Erro no Cadastro Email/Senha:", err.code, err.message);
      if (err.code === "auth/email-already-in-use") {
        setError(
          "Este email já está cadastrado. Tente fazer login ou usar outro email."
        );
      } else if (err.code === "auth/invalid-email") {
        setError("Formato de email inválido.");
      } else {
        setError("Falha ao cadastrar. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (providerName) => {
    // LÓGICA IDÊNTICA À DO LOGIN.JSX
    let provider;
    setError("");
    setSocialLoading((prev) => ({ ...prev, [providerName]: true }));

    if (providerName === "google") provider = new GoogleAuthProvider();
    else if (providerName === "twitter") provider = new TwitterAuthProvider();
    else {
      console.error("Provedor não suportado:", providerName);
      setSocialLoading((prev) => ({ ...prev, [providerName]: false }));
      return;
    }

    try {
      await signInWithPopup(auth, provider);
      // Sucesso! Listener no App.jsx redireciona.
    } catch (error) {
      console.error(`Erro no login/cadastro com ${providerName}:`, error);
      if (error.code === "auth/account-exists-with-different-credential") {
        // Neste caso, pode ser que o usuário já exista, então o login social funcionou como login.
        // Ou pode ser um erro real se as regras do Firebase não permitirem merge automático.
        setError(
          `Login bem-sucedido. Parece que você já tinha uma conta com este email via ${providerName}.`
        );
        // O listener do App.jsx deve redirecionar de qualquer forma.
      } else if (error.code === "auth/popup-closed-by-user") {
        setError(`Cadastro com ${providerName} cancelado.`);
      } else {
        setError(
          `Falha ao cadastrar com ${providerName}. Verifique o console.`
        );
      }
    } finally {
      setSocialLoading((prev) => ({ ...prev, [providerName]: false }));
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2>Criar Conta</h2>
      <form onSubmit={handleSignUp} className={styles.authForm}>
        {/* Inputs de Email, Senha, Confirmar Senha */}
        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Senha (mín. 6 caracteres):</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirmar Senha:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {/* Mensagem de Erro Email/Senha */}
        {error && !socialLoading.google && !socialLoading.twitter && (
          <p className={styles.errorMessage}>{error}</p>
        )}

        {/* Botão Cadastrar Email/Senha */}
        <button type="submit" disabled={loading} className={styles.authButton}>
          {loading ? "Cadastrando..." : "Cadastrar com Email"}
        </button>
      </form>

      {/* Divider */}
      <div className={styles.socialLoginDivider}>
        <span>OU CADASTRE-SE COM</span>
      </div>

      {/* Botões Sociais */}
      <div className={styles.socialLoginButtons}>
        <button
          type="button"
          onClick={() => handleSocialLogin("google")}
          className={`${styles.socialButton} ${styles.googleButton}`}
          disabled={socialLoading.google || socialLoading.twitter || loading}
        >
          {socialLoading.google ? (
            "Aguarde..."
          ) : (
            <>
              <FaGoogle /> Continuar com Google
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin("twitter")}
          className={`${styles.socialButton} ${styles.twitterButton}`}
          disabled={socialLoading.google || socialLoading.twitter || loading}
        >
          {socialLoading.twitter ? (
            "Aguarde..."
          ) : (
            <>
              <FaTwitter /> Continuar com Twitter
            </>
          )}
        </button>
        {/* Placeholders */}
      </div>
      {/* Mensagem de Erro Social */}
      {error && (socialLoading.google || socialLoading.twitter) && (
        <p className={styles.errorMessage}>{error}</p>
      )}

      {/* Link para Login */}
      <p className={styles.authSwitch}>
        Já tem uma conta? <Link to="/login">Faça Login</Link>
      </p>
    </div>
  );
}
export default SignUp;
