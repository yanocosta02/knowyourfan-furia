// src/components/Profile/Steps/SocialAccountsStep.jsx
import React from "react";
import styles from "../Profile.module.css";
import {
  FaGoogle,
  FaTwitter,
  FaTwitch,
  FaInstagram,
  FaUnlink,
  FaLink,
} from "react-icons/fa"; // Adiciona FaLink

function SocialAccountsStep({
  profileData,
  handleSocialLinkChange,
  linkedProviders,
  handleLinkAccount,
  handleUnlinkAccount,
  linking,
  isLinked,
}) {
  const socialPlatformsToDisplay = Object.keys(
    profileData.socialLinks || {}
  ).filter((platform) => platform !== "discord"); // Filtra Discord

  return (
    <div className={styles.stepFieldset}>
      <fieldset className={styles.stepFieldset}>
        <legend>Links Sociais e de Jogos (Opcional)</legend>
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
          </div>
        ))}
        <hr
          style={{ borderColor: "var(--furia-dark-gray)", margin: "20px 0" }}
        />
        <div className={styles.formGroup}>
          <label htmlFor="esportsProfileLink">
            Link Perfil Esports (OP.GG, etc.):
          </label>
          <input
            type="url"
            id="esportsProfileLink"
            name="esportsProfileLink"
            value={profileData.esportsProfileLink || ""}
            onChange={handleSocialLinkChange}
            placeholder="Link do perfil"
            className={styles.inputField}
          />
        </div>
        <div className={styles.validationStatus} style={{ marginTop: "5px" }}>
          {" "}
          Status Validação Link:{" "}
          {!profileData.esportsProfileLink ? (
            <em> N/A</em>
          ) : profileData.esportsProfileValidated ? (
            <strong className={styles.statusValidated}> OK (Simulado)</strong>
          ) : (
            <strong className={styles.statusPending}>
              {" "}
              Pendente (Simulado)
            </strong>
          )}{" "}
        </div>
      </fieldset>

      <fieldset className={styles.stepFieldset} style={{ marginTop: "20px" }}>
        <legend>Conectar Contas (Login Social)</legend>
        <div className={styles.linkedAccountsContainer}>
          <div className={styles.linkedAccountItem}>
            {" "}
            <FaGoogle className={styles.providerIcon} /> <span>Google</span>{" "}
            {isLinked("google.com") ? (
              <button
                type="button"
                onClick={() => handleUnlinkAccount("google.com")}
                className={styles.unlinkButton}
                disabled={linking.google || linking.twitter}
              >
                {" "}
                {linking.google ? (
                  "..."
                ) : (
                  <>
                    <FaUnlink /> Desvincular
                  </>
                )}{" "}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleLinkAccount("google")}
                className={styles.linkButton}
                disabled={linking.google || linking.twitter}
              >
                {" "}
                {linking.google ? "..." : "Vincular"}{" "}
              </button>
            )}{" "}
          </div>
          <div className={styles.linkedAccountItem}>
            {" "}
            <FaTwitter className={styles.providerIcon} /> <span>Twitter</span>{" "}
            {isLinked("twitter.com") ? (
              <button
                type="button"
                onClick={() => handleUnlinkAccount("twitter.com")}
                className={styles.unlinkButton}
                disabled={linking.google || linking.twitter}
              >
                {" "}
                {linking.twitter ? (
                  "..."
                ) : (
                  <>
                    <FaUnlink /> Desvincular
                  </>
                )}{" "}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleLinkAccount("twitter")}
                className={styles.linkButton}
                disabled={linking.google || linking.twitter}
              >
                {" "}
                {linking.twitter ? "..." : "Vincular"}{" "}
              </button>
            )}{" "}
          </div>
          <div className={`${styles.linkedAccountItem} ${styles.disabled}`}>
            {" "}
            <FaTwitch className={styles.providerIcon} /> <span>Twitch</span>{" "}
            <button disabled className={styles.linkButton}>
              Vincular (Em breve)
            </button>{" "}
          </div>
          <div className={`${styles.linkedAccountItem} ${styles.disabled}`}>
            {" "}
            <FaInstagram className={styles.providerIcon} />{" "}
            <span>Instagram</span>{" "}
            <button disabled className={styles.linkButton}>
              Vincular (Em breve)
            </button>{" "}
          </div>
        </div>
      </fieldset>
    </div>
  );
}
export default SocialAccountsStep;
