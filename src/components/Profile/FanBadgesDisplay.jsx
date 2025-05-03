import React from "react";
import styles from "./Profile.module.css";

// Recebe o array COMPLETO de badges ganhos
function FanBadgesDisplay({ badges = [] }) {
  console.log("[FanBadgesDisplay] Recebeu badges totais:", badges);

  // <<< LIMITAÇÃO AQUI: Pega apenas os 5 primeiros emblemas >>>
  const displayedBadges = badges.slice(0, 5);

  // Se não houver nenhum emblema *para exibir* (após o slice), não renderiza nada
  if (!Array.isArray(displayedBadges) || displayedBadges.length === 0) {
    console.log("[FanBadgesDisplay] Nenhum badge para exibir (após slice).");
    return null;
  }

  console.log(
    `[FanBadgesDisplay] Renderizando ${displayedBadges.length} badges (máximo 5).`
  );

  return (
    <div className={styles.badgesContainer}>
      <h3 className={styles.badgesTitle}>Seus Emblemas de Fã</h3>
      <div className={styles.badgesGrid}>
        {/* <<< Mapeia o array LIMITADO >>> */}
        {displayedBadges.map((badge) => (
          <div
            key={badge.id}
            className={styles.badgeItem}
            title={badge.description || badge.name}
          >
            {badge.icon && (
              <span className={styles.badgeIcon} aria-hidden="true">
                {badge.icon}
              </span>
            )}
            <span className={styles.badgeName}>{badge.name}</span>
          </div>
        ))}
      </div>
      {/* <<< Opcional: Adicionar mensagem se houver mais emblemas ocultos >>> */}
      {badges.length > 5 && (
        <p
          style={{
            textAlign: "center",
            color: "var(--furia-medium-gray)",
            fontSize: "0.9em",
            marginTop: "10px",
            fontStyle: "italic",
          }}
        >
          +{badges.length - 5} outros emblemas ganhos!
        </p>
      )}
    </div>
  );
}

export default FanBadgesDisplay;
