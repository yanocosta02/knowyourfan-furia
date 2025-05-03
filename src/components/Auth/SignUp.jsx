// src/components/Auth/SignUp.jsx
import React, { useState } from "react";
// ... (imports como antes) ...
import styles from "./Auth.module.css";
import { Link } from "react-router-dom";
import { FaGoogle, FaTwitter } from "react-icons/fa";

function SignUp() {
  // ... (state e handlers como antes) ...
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

        <h2>Junte-se à Legião!</h2>
        <p>
          Crie seu perfil de fã da FURIA para conectar-se, compartilhar seus
          interesses e receber experiências exclusivas.
        </p>
        <p>
          Ao preencher seu perfil, você nos ajuda a criar o melhor para a nossa
          comunidade.
        </p>
        <p>
          Já tem conta? <Link to="/login">Faça login aqui!</Link>
        </p>
      </div>

      {/* Coluna Direita: Área do Formulário */}
      <div className={styles.authFormArea}>
        {/* ... (Conteúdo do formulário como antes) ... */}
        <h2>Criar Nova Conta</h2>
        <form onSubmit={handleSignUp} className={styles.authForm}>
          {/* ... inputs ... */}
          {error && !socialLoading.google && !socialLoading.twitter && (
            <p className={styles.errorMessage}>{error}</p>
          )}
          <button
            type="submit"
            disabled={loading || socialLoading.google || socialLoading.twitter}
            className={styles.authButton}
          >
            {loading ? "Cadastrando..." : "Cadastrar com Email"}
          </button>
        </form>
        <div className={styles.socialLoginDivider}>
          <span>OU CONECTE-SE COM</span>
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
                <FaGoogle /> Continuar com Google
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
                <FaTwitter /> Continuar com Twitter
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
export default SignUp;
