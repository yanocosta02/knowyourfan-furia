// src/components/Profile/ProfileDisplay.jsx
import React from "react";
import styles from "./Profile.module.css";
import FanBadgesDisplay from "./FanBadgesDisplay"; // Importa para usar aqui DENTRO
import {
  FaSteam,
  FaTwitter,
  FaTwitch,
  FaInstagram,
  FaDiscord,
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
  discord: FaDiscord,
};

function ProfileDisplay({
  profileData,
  linkedProviders = [],
  fanBadges = [],
  onEdit,
}) {
  console.log("[ProfileDisplay] Renderizando com profileData:", profileData); // Log
  console.log("[ProfileDisplay] Badges recebidos:", fanBadges); // Log

  // Desestruturação segura dos dados
  const {
    name = "Nome não informado", // Valor padrão
    steamNickname = "",
    avatarUrl = "",
    idValidated = false,
    socialLinks = {},
    esportsProfileLink = "",
    favoriteTeams = "", // String única
    // ... outros dados se precisar ...
  } = profileData || {}; // Garante que profileData não é null/undefined

  // Função para obter links sociais (incluindo Steam)
  const getSocialLinks = () => {
    const links = [];
    if (steamNickname) {
      // Tenta criar link Steam - pode precisar de lógica mais robusta para ID vs Custom URL
      const steamProfileUrl = /^[0-9]{17}$/.test(steamNickname)
        ? `https://steamcommunity.com/profiles/${steamNickname}/` // ID numérico
        : `https://steamcommunity.com/id/${steamNickname}/`; // Assume custom URL
      links.push({
        platform: "steam",
        url: steamProfileUrl,
        Icon: FaSteam,
        verified: false,
      });
    }
    for (const platform in socialLinks) {
      if (socialLinks[platform]) {
        const Icon = socialIconMap[platform];
        const verified = linkedProviders.includes(`${platform}.com`);
        if (Icon)
          links.push({ platform, url: socialLinks[platform], Icon, verified });
      }
    }
    if (esportsProfileLink) {
      links.push({
        platform: "esports",
        url: esportsProfileLink,
        Icon: FaLink,
        verified: profileData.esportsProfileValidated,
      });
    }
    return links;
  };

  const displayLinks = getSocialLinks();

  return (
    <div className={styles.profileDisplayContainer}>
      {/* Botão Editar */}
      <button
        onClick={onEdit}
        className={styles.editProfileButton}
        title="Editar Perfil"
      >
        <FaEdit /> Editar
      </button>

      {/* Cabeçalho do Perfil */}
      <div className={styles.profileHeader}>
        <div className={styles.avatarContainer}>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${name}'s avatar`}
              className={styles.profileAvatar}
              onError={(e) =>
                (e.target.src = "")
              } /* Fallback simples se a imagem quebrar */
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
          {/* Exibe time favorito aqui se quiser */}
          {favoriteTeams && (
            <p className={styles.favoriteTeamDisplaySmall}>
              {" "}
              {/* Estilo menor */}
              Torce para: <strong>{favoriteTeams}</strong>
            </p>
          )}
        </div>
      </div>

      {/* Seção de Emblemas (renderizada aqui dentro) */}
      <FanBadgesDisplay badges={fanBadges} />
      {/* Mensagem se não houver emblemas */}
      {(!fanBadges || fanBadges.length === 0) && (
        <p
          style={{
            textAlign: "center",
            color: "var(--furia-medium-gray)",
            marginTop: "20px",
            fontStyle: "italic",
          }}
        >
          Nenhum emblema ganho ainda. Complete seu perfil!
        </p>
      )}

      {/* Seção de Links Sociais */}
      {displayLinks.length > 0 && (
        <div className={styles.socialLinksSection}>
          <h4 className={styles.socialLinksTitle}>Conecte-se:</h4>
          <div className={styles.socialLinksGrid}>
            {displayLinks.map(({ platform, url, Icon, verified }) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.socialLinkButton} ${
                  verified ? styles.verifiedLink : ""
                }`}
                title={`${
                  platform.charAt(0).toUpperCase() + platform.slice(1)
                }${verified ? " (Verificado)" : ""}`}
              >
                <Icon />
                {verified && (
                  <FaCheckCircle
                    className={styles.verifiedIcon}
                    title="Conta Verificada"
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
