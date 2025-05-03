// src/components/Profile/FanBadgesDisplay.jsx
import React from 'react';
import styles from './Profile.module.css'; // Reutiliza estilos

function FanBadgesDisplay({ badges = [] }) {
  if (!Array.isArray(badges) || badges.length === 0) {
    return null; // Não renderiza se não houver badges
  }

  return (
    <div className={styles.badgesContainer}>
      <h3 className={styles.badgesTitle}>Seus Emblemas de Fã</h3>
      <div className={styles.badgesGrid}>
        {badges.map((badge) => (
          <div key={badge.id} className={styles.badgeItem} title={badge.description || badge.name}>
            {badge.icon && (
              <span className={styles.badgeIcon} aria-hidden="true">
                {badge.icon}
              </span>
            )}
            <span className={styles.badgeName}>
              {badge.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FanBadgesDisplay;