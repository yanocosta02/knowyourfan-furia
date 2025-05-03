import React from "react";
import styles from "./Profile.module.css";
import FanBadgesDisplay from "./FanBadgesDisplay";

import {
  FaSteam,
  FaTwitter,
  FaTwitch,
  FaInstagram,
  FaLink,
  FaCheckCircle,
  FaUserCircle,
  FaEdit,
} from "react-icons/fa";

// Mapeamento de ícones
const socialIconMap = {
  twitter: FaTwitter,
  twitch: FaTwitch,
  instagram: FaInstagram,
};

function ProfileDisplay({
  profileData,
  linkedProviders = [],
  fanBadges = [],
  onEdit,
}) {
  // Desestruturação segura dos dados (incluindo esportsLink e status)
  const {
    name = "Nome não informado",
    steamNickname = "",
    avatarUrl = "",
    idValidated = false,
    socialLinks = {},
    esportsProfileLink = "", // <<< Pega o link esports
    favoriteTeams = "",
    esportsLinkValidated = false, // <<< Pega o status da validação
  } = profileData || {};

  // Função para obter links (AGORA INCLUI ESPORTS LINK)
  const getSocialLinks = () => {
    const links = [];
    // Steam
    if (steamNickname) {
      const steamUrl = /^[0-9]{17}$/.test(steamNickname)
        ? `https://steamcommunity.com/profiles/${steamNickname}/`
        : `https://steamcommunity.com/id/${steamNickname}/`;
      links.push({
        platform: "steam",
        url: steamUrl,
        Icon: FaSteam,
        verified: false,
      });
    }
    // Sociais (Twitter, Twitch, Instagram)
    for (const p in socialLinks) {
      if (socialLinks[p]) {
        const Icon = socialIconMap[p];
        const verified = linkedProviders.includes(`${p}.com`);
        if (Icon)
          links.push({ platform: p, url: socialLinks[p], Icon, verified });
      }
    }
    // <<< ADICIONA O LINK ESPORTS SE EXISTIR >>>
    if (esportsProfileLink) {
      links.push({
        platform: "esports",
        url: esportsProfileLink,
        Icon: FaLink, // Usa o ícone de link genérico
        verified: esportsLinkValidated, // Usa o status da validação simulada
      });
    }
    return links;
  };

  const displayLinks = getSocialLinks();

  return (
    <div className={styles.profileDisplayContainer}>
      {/* ... (Botão Editar, Header com Avatar/Nome/Steam/Verificado/Time) ... */}
      <button
        onClick={onEdit}
        className={styles.editProfileButton}
        title="Editar Perfil"
      >
        <FaEdit /> Editar
      </button>
      <div className={styles.profileHeader}>
        <div className={styles.avatarContainer}>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${name}'s avatar`}
              className={styles.profileAvatar}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : (
            <FaUserCircle className={styles.profileAvatarPlaceholder} />
          )}
        </div>
        <div className={styles.profileInfoMain}>
          <h2 className={styles.profileName}>{name}</h2>
          {steamNickname && (
            <a
              href={getSocialLinks().find((l) => l.platform === "steam")?.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.profileSteamLink}
            >
              <FaSteam /> {steamNickname}
            </a>
          )}
          {idValidated && (
            <span className={styles.verifiedBadge} title="Perfil Verificado">
              <FaCheckCircle /> Verificado
            </span>
          )}
          {favoriteTeams && (
            <p className={styles.favoriteTeamDisplaySmall}>
              Torce para: <strong>{favoriteTeams}</strong>
            </p>
          )}
        </div>
      </div>

      {/* ... (FanBadgesDisplay e mensagem de 'nenhum badge') ... */}
      <FanBadgesDisplay badges={fanBadges} />
      {(!fanBadges || fanBadges.length === 0) && (
        <p
          style={{
            textAlign: "center",
            color: "var(--furia-medium-gray)",
            marginTop: "20px",
            fontStyle: "italic",
          }}
        >
          Nenhum emblema ganho ainda.
        </p>
      )}

      {/* Seção de Links Sociais (agora inclui o link esports se adicionado) */}
      {displayLinks.length > 0 && (
        <div className={styles.socialLinksSection}>
          <h4 className={styles.socialLinksTitle}>Conecte-se / Perfis:</h4>
          <div className={styles.socialLinksGrid}>
            {displayLinks.map(({ platform, url, Icon, verified }) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.socialLinkButton} ${
                  verified ? styles.verifiedLink : ""
                } ${
                  platform === "esports" && verified
                    ? styles.statusValidated
                    : ""
                } ${
                  platform === "esports" && !verified
                    ? styles.statusPending
                    : ""
                }`} // Adiciona classes de status para o link esports
                title={`${
                  platform === "esports"
                    ? "Perfil Esports"
                    : platform.charAt(0).toUpperCase() + platform.slice(1)
                }${
                  verified
                    ? platform === "esports"
                      ? " (Relevante)"
                      : " (Verificado)"
                    : platform === "esports"
                    ? " (Pendente/Inválido)"
                    : ""
                }`} // Ajusta tooltip
              >
                <Icon />
                {/* Mostra ícone de check diferente para links verificados vs relevantes */}
                {verified && platform !== "esports" && (
                  <FaCheckCircle
                    className={styles.verifiedIcon}
                    title="Conta Verificada"
                  />
                )}
                {verified && platform === "esports" && (
                  <FaCheckCircle
                    className={styles.verifiedIcon}
                    style={{ color: "var(--furia-success-green)" }}
                    title="Link Relevante (Simulado)"
                  />
                )}
                {!verified && platform === "esports" && (
                  <FaCheckCircle
                    className={styles.verifiedIcon}
                    style={{
                      color: "var(--furia-pending-orange)",
                      opacity: 0.7,
                    }}
                    title="Link Pendente/Inválido (Simulado)"
                  />
                )}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileDisplay;
