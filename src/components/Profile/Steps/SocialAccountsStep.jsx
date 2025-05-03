// src/components/Profile/Steps/SocialAccountsStep.jsx
import React from 'react';
import styles from '../Profile.module.css';
import { FaGoogle, FaTwitter, FaTwitch, FaInstagram, FaUnlink } from 'react-icons/fa';

function SocialAccountsStep({
  profileData,
  handleSocialLinkChange, // Para os inputs de link
  linkedProviders,        // Lista de IDs ('google.com', 'twitter.com')
  handleLinkAccount,      // Função para vincular
  handleUnlinkAccount,    // Função para desvincular
  linking,                 // Estado de loading para botões de link/unlink
  isLinked                 // Helper para verificar se está vinculado
 }) {
  return (
    <div className={styles.stepFieldset}> {/* Usa a div como container principal da etapa */}
      {/* Seção 1: Links Manuais */}
      <fieldset className={styles.stepFieldset}>
          <legend style={{display: 'block', marginBottom: '15px', fontWeight: '600'}}>Links Sociais (Opcional)</legend> {/* Manter legenda aqui? */}
          {Object.keys(profileData.socialLinks).map((platform) => (
           <div className={styles.formGroup} key={platform}>
             <label htmlFor={platform}>{platform.charAt(0).toUpperCase() + platform.slice(1)}:</label>
             <input type="url" id={platform} name={platform} value={profileData.socialLinks[platform]} onChange={handleSocialLinkChange} placeholder={`https://.../${platform}.com/`} />
           </div>
          ))}
          <hr style={{borderColor: 'var(--furia-medium-gray)', margin: '20px 0'}}/>
          <div className={styles.formGroup}>
            <label htmlFor="esportsProfileLink">Link Perfil Esports (OP.GG, etc.):</label>
            <input type="url" id="esportsProfileLink" name="esportsProfileLink" value={profileData.esportsProfileLink} onChange={handleSocialLinkChange} />
          </div>
           {/* Status Validação Link (se quiser manter aqui) */}
           {/* <div className={styles.validationStatus}> Status Link: ... </div> */}
      </fieldset>

      {/* Seção 2: Contas Vinculadas */}
       <fieldset className={styles.stepFieldset} style={{marginTop: '20px'}}>
          <legend style={{display: 'block', marginBottom: '15px', fontWeight: '600'}}>Conectar Contas (Login Social)</legend>
          <div className={styles.linkedAccountsContainer}>
            {/* Google */}
            <div className={styles.linkedAccountItem}>
                <FaGoogle className={styles.providerIcon} /> <span>Google</span>
                {isLinked('google.com') ? (
                    <button type="button" onClick={() => handleUnlinkAccount('google.com')} className={styles.unlinkButton} disabled={linking.google || linking.twitter}>
                        {linking.google ? '...' : <><FaUnlink /> Desvincular</>}
                    </button>
                ) : (
                    <button type="button" onClick={() => handleLinkAccount('google')} className={styles.linkButton} disabled={linking.google || linking.twitter}>
                        {linking.google ? '...' : 'Vincular'}
                    </button>
                )}
            </div>
            {/* Twitter */}
             <div className={styles.linkedAccountItem}>
                 <FaTwitter className={styles.providerIcon} /> <span>Twitter</span>
                 {isLinked('twitter.com') ? (
                     <button type="button" onClick={() => handleUnlinkAccount('twitter.com')} className={styles.unlinkButton} disabled={linking.google || linking.twitter}>
                        {linking.twitter ? '...' : <><FaUnlink /> Desvincular</>}
                     </button>
                 ) : (
                     <button type="button" onClick={() => handleLinkAccount('twitter')} className={styles.linkButton} disabled={linking.google || linking.twitter}>
                        {linking.twitter ? '...' : 'Vincular'}
                     </button>
                 )}
             </div>
             {/* Placeholders */}
             <div className={`${styles.linkedAccountItem} ${styles.disabled}`}> <FaTwitch className={styles.providerIcon} /> <span>Twitch</span> <button disabled className={styles.linkButton}>Vincular (Em breve)</button> </div>
             <div className={`${styles.linkedAccountItem} ${styles.disabled}`}> <FaInstagram className={styles.providerIcon} /> <span>Instagram</span> <button disabled className={styles.linkButton}>Vincular (Em breve)</button> </div>
          </div>
       </fieldset>
    </div>
  );
}
export default SocialAccountsStep;