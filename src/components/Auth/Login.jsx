import React, { useState } from "react";
import {
  signInWithEmailAndPassword, // Para login email/senha
  GoogleAuthProvider, // Para login Google
  TwitterAuthProvider, // Para login Twitter
  signInWithPopup, // Função para abrir popup social
} from "firebase/auth";
import { auth } from "../../firebaseConfig"; // Importa config do Firebase
import { Link } from "react-router-dom"; // Para link de cadastro
import styles from "./Auth.module.css"; // Importa CSS Module
import { FaGoogle, FaTwitter } from "react-icons/fa"; // Importa ícones

function Login() {
  // Estados do componente
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading para email/senha
  const [socialLoading, setSocialLoading] = useState({
    // Loading para botões sociais
    google: false,
    twitter: false,
  });

  // <<< FUNÇÃO HANDLER PARA LOGIN COM EMAIL/SENHA (RESTAURADA) >>>
  const handleLogin = async (e) => {
    e.preventDefault(); // Previne recarregamento da página
    setError(""); // Limpa erros anteriores
    setLoading(true); // Ativa loading do botão principal
    try {
      // Tenta fazer login com Firebase Auth
      await signInWithEmailAndPassword(auth, email, password);
      // Sucesso! O listener no App.jsx vai detectar a mudança e redirecionar.
    } catch (err) {
      // Tratamento de erros comuns do Firebase Auth
      console.error("Erro no Login Email/Senha:", err.code, err.message);
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential" ||
        err.code === "auth/invalid-email"
      ) {
        setError("Email ou senha incorretos.");
      } else {
        setError("Falha ao fazer login. Tente novamente mais tarde.");
      }
    } finally {
      setLoading(false); // Desativa loading do botão principal
    }
  };
  // <<< FIM handleLogin >>>

  // <<< FUNÇÃO HANDLER PARA LOGIN SOCIAL (RESTAURADA) >>>
  const handleSocialLogin = async (providerName) => {
    let provider;
    setError(""); // Limpa erros anteriores
    setSocialLoading((prev) => ({ ...prev, [providerName]: true })); // Ativa loading do botão social clicado

    // Cria a instância do provedor correto
    if (providerName === "google") {
      provider = new GoogleAuthProvider();
    } else if (providerName === "twitter") {
      provider = new TwitterAuthProvider();
    } else {
      console.error("Provedor social não suportado:", providerName);
      setError("Método de login não suportado.");
      setSocialLoading((prev) => ({ ...prev, [providerName]: false }));
      return;
    }

    try {
      // Abre o popup de login do Firebase com o provedor escolhido
      await signInWithPopup(auth, provider);
      // Sucesso! O listener no App.jsx vai detectar e redirecionar.
    } catch (error) {
      // Tratamento de erros comuns do login social
      console.error(`Erro no login com ${providerName}:`, error);
      if (error.code === "auth/account-exists-with-different-credential") {
        setError(
          `Uma conta já existe com este email (${
            error.customData?.email || ""
          }), mas usando outro método de login (ex: senha). Tente entrar com o outro método.`
        );
      } else if (error.code === "auth/popup-closed-by-user") {
        // Não mostra erro se o usuário simplesmente fechou o popup
        // setError(`Login com ${providerName} cancelado.`);
        console.log("Popup de login social fechado pelo usuário.");
      } else if (
        error.code === "auth/cancelled-popup-request" ||
        error.code === "auth/popup-blocked"
      ) {
        setError(
          `O popup de login foi bloqueado ou cancelado. Verifique as configurações do seu navegador.`
        );
      } else {
        // Erro genérico
        setError(`Falha ao fazer login com ${providerName}. (${error.code})`);
      }
    } finally {
      setSocialLoading((prev) => ({ ...prev, [providerName]: false })); // Desativa loading do botão social
    }
  };
  // <<< FIM handleSocialLogin >>>

  return (
    // Container Principal com Flexbox
    <div className={styles.authContainer}>
      {/* Coluna Esquerda: Informações */}
      <div className={styles.authInfo}>
        {/* CONTAINER PARA LOGO */}
        <div className={styles.authLogoContainer}>
          {/* Substitua pela sua imagem */}
          <img
            src="/logo-furia-placeholder.png"
            alt="Logo FURIA"
            className={styles.authLogo}
          />
        </div>
        {/* FIM CONTAINER LOGO */}
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
          Ainda não tem conta?{" "}
          <Link to="/signup" style={{ fontWeight: "bold" }}>
            Cadastre-se aqui!
          </Link>
        </p>
      </div>

      {/* Coluna Direita: Área do Formulário */}
      <div className={styles.authFormArea}>
        <h2>Entrar na Conta</h2>
        {/* Formulário de Email/Senha */}
        <form onSubmit={handleLogin} className={styles.authForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.inputField} // Adiciona classe se tiver estilo específico
              autoComplete="email"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Senha:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.inputField}
              autoComplete="current-password"
            />
          </div>
          {/* Mostra erro APENAS se não houver loading social */}
          {error && !socialLoading.google && !socialLoading.twitter && (
            <p className={styles.errorMessage}>{error}</p>
          )}
          <button
            type="submit"
            // Desabilita se QUALQUER loading estiver ativo
            disabled={loading || socialLoading.google || socialLoading.twitter}
            className={styles.authButton}
          >
            {loading ? "Entrando..." : "Entrar com Email"}
          </button>
        </form>

        {/* Divider e Botões Sociais */}
        <div className={styles.socialLoginDivider}>
          <span>OU</span>
        </div>
        <div className={styles.socialLoginButtons}>
          <button
            type="button"
            onClick={() => handleSocialLogin("google")}
            className={`${styles.socialButton} ${styles.googleButton}`} // Usa classes corretas
            disabled={loading || socialLoading.google || socialLoading.twitter}
          >
            {socialLoading.google ? (
              "Aguarde..."
            ) : (
              <>
                <FaGoogle /> Entrar com Google
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => handleSocialLogin("twitter")}
            className={`${styles.socialButton} ${styles.twitterButton}`}
            disabled={loading || socialLoading.google || socialLoading.twitter}
          >
            {socialLoading.twitter ? (
              "Aguarde..."
            ) : (
              <>
                <FaTwitter /> Entrar com Twitter
              </>
            )}
          </button>
        </div>
        {/* Mostra erro APENAS se for de loading social */}
        {error && (socialLoading.google || socialLoading.twitter) && (
          <p className={styles.errorMessage} style={{ marginTop: "15px" }}>
            {error}
          </p>
        )}

        {/* Link para Cadastro no final */}
        {/* <p className={styles.authSwitch}>Não tem uma conta? <Link to="/signup">Cadastre-se</Link></p> */}
      </div>
    </div>
  );
}
export default Login;
