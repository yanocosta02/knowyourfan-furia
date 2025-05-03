import React, { useState } from "react";
import {
  createUserWithEmailAndPassword, // Para cadastro email/senha
  GoogleAuthProvider, // Para Google
  TwitterAuthProvider, // Para Twitter
  signInWithPopup, // Função para popup social
} from "firebase/auth";
import { auth } from "../../firebaseConfig"; // Config Firebase
import { Link } from "react-router-dom"; // Para link de login
import styles from "./Auth.module.css"; // CSS Module
import { FaGoogle, FaTwitter } from "react-icons/fa"; // Ícones

function SignUp() {
  // Estados
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading email/senha
  const [socialLoading, setSocialLoading] = useState({
    // Loading social
    google: false,
    twitter: false,
  });

  // <<< FUNÇÃO HANDLER PARA CADASTRO EMAIL/SENHA (RESTAURADA) >>>
  const handleSignUp = async (e) => {
    e.preventDefault(); // Previne reload
    setError(""); // Limpa erro

    // Validações básicas
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      setError("A senha precisa ter no mínimo 6 caracteres.");
      return;
    }

    setLoading(true); // Ativa loading
    try {
      // Tenta criar usuário no Firebase Auth
      await createUserWithEmailAndPassword(auth, email, password);
      // Sucesso! O listener no App.jsx vai detectar e redirecionar.
    } catch (err) {
      // Tratamento de erros
      console.error("Erro no Cadastro Email/Senha:", err.code, err.message);
      if (err.code === "auth/email-already-in-use") {
        setError("Este email já está cadastrado. Tente fazer login.");
      } else if (err.code === "auth/invalid-email") {
        setError("Formato de email inválido.");
      } else if (err.code === "auth/weak-password") {
        setError("Senha muito fraca. Use pelo menos 6 caracteres.");
      } else {
        setError("Falha ao cadastrar. Verifique os dados e tente novamente.");
      }
    } finally {
      setLoading(false); // Desativa loading
    }
  };
  // <<< FIM handleSignUp >>>

  // <<< FUNÇÃO HANDLER PARA LOGIN/CADASTRO SOCIAL (RESTAURADA) >>>
  const handleSocialLogin = async (providerName) => {
    let provider;
    setError("");
    setSocialLoading((prev) => ({ ...prev, [providerName]: true }));

    if (providerName === "google") provider = new GoogleAuthProvider();
    else if (providerName === "twitter") provider = new TwitterAuthProvider();
    else {
      console.error("Provedor não suportado:", providerName);
      setError("Método de conexão não suportado.");
      setSocialLoading((prev) => ({ ...prev, [providerName]: false }));
      return;
    }

    try {
      // Tenta conectar com o popup
      await signInWithPopup(auth, provider);
      // Sucesso! O usuário ou foi cadastrado ou logado. Listener no App.jsx redireciona.
    } catch (error) {
      // Tratamento de erros
      console.error(`Erro no login/cadastro com ${providerName}:`, error);
      if (error.code === "auth/account-exists-with-different-credential") {
        // Usuário já existe com outro método, o login foi bem-sucedido
        // A mensagem pode ser confusa, talvez apenas logar ou não mostrar erro?
        console.warn(
          "Usuário já existe com outro método, login realizado com sucesso via social."
        );
        // setError(`Login bem-sucedido. Parece que você já tinha uma conta com este email.`);
      } else if (error.code === "auth/popup-closed-by-user") {
        console.log("Popup de conexão social fechado pelo usuário.");
        // setError(`Conexão com ${providerName} cancelada.`); // Opcional
      } else if (
        error.code === "auth/cancelled-popup-request" ||
        error.code === "auth/popup-blocked"
      ) {
        setError(
          `O popup de conexão foi bloqueado ou cancelado. Verifique as configurações do seu navegador.`
        );
      } else {
        setError(`Falha ao conectar com ${providerName}. (${error.code})`);
      }
    } finally {
      setSocialLoading((prev) => ({ ...prev, [providerName]: false }));
    }
  };
  // <<< FIM handleSocialLogin >>>

  return (
    // Container Principal
    <div className={styles.authContainer}>
      {/* Coluna Esquerda: Informações */}
      <div className={styles.authInfo}>
        {/* CONTAINER LOGO */}
        <div className={styles.authLogoContainer}>
          {/* Sua imagem da logo aqui */}
          <img
            src="/logo-furia-placeholder.png"
            alt="Logo FURIA"
            className={styles.authLogo}
          />
        </div>
        {/* FIM CONTAINER LOGO */}
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
          Já tem conta?{" "}
          <Link to="/login" style={{ fontWeight: "bold" }}>
            Faça login aqui!
          </Link>
        </p>
      </div>

      {/* Coluna Direita: Área do Formulário */}
      <div className={styles.authFormArea}>
        <h2>Criar Nova Conta</h2>
        {/* Formulário de Cadastro */}
        <form onSubmit={handleSignUp} className={styles.authForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.inputField}
              autoComplete="email"
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
              className={styles.inputField}
              autoComplete="new-password"
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
              className={styles.inputField}
              autoComplete="new-password"
            />
          </div>
          {/* Mensagem de Erro Email/Senha */}
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

        {/* Divider e Botões Sociais */}
        <div className={styles.socialLoginDivider}>
          <span>OU CONECTE-SE COM</span>
        </div>
        <div className={styles.socialLoginButtons}>
          <button
            type="button"
            onClick={() => handleSocialLogin("google")}
            className={`${styles.socialButton} ${styles.googleButton}`}
            disabled={loading || socialLoading.google || socialLoading.twitter}
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
            disabled={loading || socialLoading.google || socialLoading.twitter}
          >
            {socialLoading.twitter ? (
              "Aguarde..."
            ) : (
              <>
                <FaTwitter /> Continuar com Twitter
              </>
            )}
          </button>
        </div>
        {/* Mensagem de Erro Social */}
        {error && (socialLoading.google || socialLoading.twitter) && (
          <p className={styles.errorMessage} style={{ marginTop: "15px" }}>
            {error}
          </p>
        )}

        {/* Link para Login no final */}
        {/* <p className={styles.authSwitch}>Já tem uma conta? <Link to="/login">Faça Login</Link></p> */}
      </div>
    </div>
  );
}
export default SignUp;
