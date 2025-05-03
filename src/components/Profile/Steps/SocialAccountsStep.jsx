import React from "react";
import styles from "../Profile.module.css";
import {
  FaGoogle,
  FaTwitter,
  FaTwitch,
  FaInstagram,
  FaUnlink,
  FaLink,
} from "react-icons/fa";

function SocialAccountsStep({
  profileData,
  setProfileData, // <<< USAR setProfileData diretamente aqui
  linkedProviders,
  handleLinkAccount,
  handleUnlinkAccount,
  linking,
  isLinked,
}) {
  const socialPlatformsToDisplay = Object.keys(
    profileData.socialLinks || {}
  ).filter((platform) => platform !== "discord");

  // Handler para socialLinks (Twitter, Twitch, etc.)
  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }));
  };

  // Handler geral para campos fora de socialLinks
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className={styles.stepFieldset}>
      {/* Seção 1: Links Sociais e Esports */}
      <fieldset className={styles.stepFieldset}>
        <legend>Links Sociais e Perfis de Jogos</legend>

        {socialPlatformsToDisplay.map((platform) => (
          <div className={styles.formGroup} key={platform}>
            <label htmlFor={platform}>
              {platform.charAt(0).toUpperCase() + platform.slice(1)}:
            </label>
            <input
              type="url"
              id={platform}
              name={platform}
              value={profileData.socialLinks[platform] || ""}
              onChange={handleSocialLinkChange}
              placeholder={`https://.../${platform}.com/usuario`}
              className={styles.inputField}
            />
            <small>Ex: https://{platform}.com/seu_usuario</small>
          </div>
        ))}

        <hr
          style={{ borderColor: "var(--furia-dark-gray)", margin: "20px 0" }}
        />

        {/* Input para Link Esports */}
        <div className={styles.formGroup}>
          <label htmlFor="esportsProfileLink">
            Link Perfil Esports (HLTV, OP.GG, etc.):
          </label>
          <input
            type="url"
            id="esportsProfileLink"
            name="esportsProfileLink"
            value={profileData.esportsProfileLink || ""}
            onChange={handleChange}
            placeholder="Cole o link do seu perfil público"
            className={styles.inputField}
          />
          <div className={styles.validationStatus} style={{ marginTop: "5px" }}>
            Status Validação Link:
            {!profileData.esportsProfileLink ? (
              <em> N/A</em>
            ) : profileData.esportsLinkValidated ? (
              <strong className={styles.statusValidated}>
                {" "}
                Relevante (Simulado)
              </strong>
            ) : (
              <strong className={styles.statusPending}>
                {" "}
                Pendente / Irrelevante (Simulado)
              </strong>
            )}
          </div>
          <small>
            Verificaremos (simulado) se o link é um perfil relevante.
          </small>
        </div>
      </fieldset>

      {/* Seção 2: Contas Vinculadas */}
      <fieldset className={styles.stepFieldset} style={{ marginTop: "20px" }}>
        <legend>Conectar Contas (Login Social)</legend>
        <div className={styles.linkedAccountsContainer}>
          {/* Google */}
          <div className={styles.linkedAccountItem}>
            <FaGoogle className={styles.providerIcon} /> <span>Google</span>
            {isLinked("google.com") ? (
              <button
                type="button"
                onClick={() => handleUnlinkAccount("google.com")}
                className={styles.unlinkButton}
                disabled={linking.google || linking.twitter}
              >
                {linking.google ? (
                  "..."
                ) : (
                  <>
                    <FaUnlink /> Desvincular
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleLinkAccount("google")}
                className={styles.linkButton}
                disabled={linking.google || linking.twitter}
              >
                {linking.google ? "..." : "Vincular"}
              </button>
            )}
          </div>

          {/* Twitter */}
          <div className={styles.linkedAccountItem}>
            <FaTwitter className={styles.providerIcon} /> <span>Twitter</span>
            {isLinked("twitter.com") ? (
              <button
                type="button"
                onClick={() => handleUnlinkAccount("twitter.com")}
                className={styles.unlinkButton}
                disabled={linking.google || linking.twitter}
              >
                {linking.twitter ? (
                  "..."
                ) : (
                  <>
                    <FaUnlink /> Desvincular
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleLinkAccount("twitter")}
                className={styles.linkButton}
                disabled={linking.google || linking.twitter}
              >
                {linking.twitter ? "..." : "Vincular"}
              </button>
            )}
          </div>

          {/* Twitch e Instagram (Indisponíveis) */}
          <div className={`${styles.linkedAccountItem} ${styles.disabled}`}>
            <FaTwitch className={styles.providerIcon} /> <span>Twitch</span>
            <button disabled className={styles.linkButton}>
              Indisponível
            </button>
          </div>
          <div className={`${styles.linkedAccountItem} ${styles.disabled}`}>
            <FaInstagram className={styles.providerIcon} />{" "}
            <span>Instagram</span>
            <button disabled className={styles.linkButton}>
              Indisponível
            </button>
          </div>
        </div>
      </fieldset>
    </div>
  );
}

export default SocialAccountsStep;
