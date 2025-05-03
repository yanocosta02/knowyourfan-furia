// src/components/Auth/Login.jsx
import React, { useState } from "react";
// ... (imports como antes) ...
import styles from "./Auth.module.css";
import { Link } from "react-router-dom";
import { FaGoogle, FaTwitter } from "react-icons/fa";

function Login() {
  // ... (state e handlers como antes) ...
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState({
    google: false,
    twitter: false,
  });

  const handleLogin = async (e) => {
    /* ... */
  };
  const handleSocialLogin = async (providerName) => {
    /* ... */
  };

  return (
    <div className={styles.authContainer}>
      {/* Coluna Esquerda: Informações */}
      <div className={styles.authInfo}>
        {/* <<< CONTAINER PARA LOGO >>> */}
        <div className={styles.authLogoContainer}>
          {/* Substitua pelo seu componente de imagem ou tag <img> */}
          <img
            src="/logo-furia-placeholder.png"
            alt="Logo FURIA"
            className={styles.authLogo}
          />
          {/* OU coloque um texto temporário: */}
          {/* <p style={{color: 'var(--furia-medium-gray)', fontStyle: 'italic'}}>[ Espaço para Logo ]</p> */}
        </div>
        {/* <<< FIM CONTAINER LOGO >>> */}

        <h2>Boas-vindas, Furioso!</h2>
        <p>
          Faça login para acessar seu perfil exclusivo e nos ajudar a entender
          melhor nossos fãs.
        </p>
        <p>
          Com seu perfil completo, você pode receber{" "}
          <strong>conteúdos personalizados</strong>, acesso antecipado e muito
          mais!
        </p>
        <p>
          Ainda não tem conta? <Link to="/signup">Cadastre-se aqui!</Link>
        </p>
      </div>

      {/* Coluna Direita: Área do Formulário */}
      <div className={styles.authFormArea}>
        {/* ... (Conteúdo do formulário como antes) ... */}
        <h2>Entrar na Conta</h2>
        <form onSubmit={handleLogin} className={styles.authForm}>
          {/* ... inputs ... */}
          {error && !socialLoading.google && !socialLoading.twitter && (
            <p className={styles.errorMessage}>{error}</p>
          )}
          <button
            type="submit"
            disabled={loading || socialLoading.google || socialLoading.twitter}
            className={styles.authButton}
          >
            {loading ? "Entrando..." : "Entrar com Email"}
          </button>
        </form>
        <div className={styles.socialLoginDivider}>
          <span>OU</span>
        </div>
        <div className={styles.socialLoginButtons}>
          {/* ... botões sociais ... */}
          <button
            type="button"
            onClick={() => handleSocialLogin("google")}
            className={`${styles.socialButton} ${styles.googleButton}`}
            disabled={socialLoading.google || socialLoading.twitter || loading}
          >
            {" "}
            {socialLoading.google ? (
              "..."
            ) : (
              <>
                <FaGoogle /> Entrar com Google
              </>
            )}{" "}
          </button>
          <button
            type="button"
            onClick={() => handleSocialLogin("twitter")}
            className={`${styles.socialButton} ${styles.twitterButton}`}
            disabled={socialLoading.google || socialLoading.twitter || loading}
          >
            {" "}
            {socialLoading.twitter ? (
              "..."
            ) : (
              <>
                <FaTwitter /> Entrar com Twitter
              </>
            )}{" "}
          </button>
        </div>
        {error && (socialLoading.google || socialLoading.twitter) && (
          <p className={styles.errorMessage} style={{ marginTop: "15px" }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
export default Login;
