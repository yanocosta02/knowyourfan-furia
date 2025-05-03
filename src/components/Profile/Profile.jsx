// src/components/Profile/Profile.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from '../../firebaseConfig'; // Import auth também
import { GoogleAuthProvider, TwitterAuthProvider, linkWithPopup, unlink } from "firebase/auth"; // Funções de link/unlink
import styles from './Profile.module.css'; // CSS Module
import { FaGoogle, FaTwitter, FaTwitch, FaInstagram, FaUnlink } from 'react-icons/fa'; // Ícones

// --- SIMULAÇÃO DE IA (sem mudanças) ---
const simulateAIValidation = (dataType, dataValue) => {
  console.log(`[IA SIM] Iniciando validação: ${dataType} (${dataValue ? dataValue.substring(0, 30) + '...' : 'N/A'})`);
  return new Promise(resolve => {
    const delay = 1200 + Math.random() * 1800;
    setTimeout(() => {
      const success = Math.random() > 0.2;
      console.log(`[IA SIM] Resultado para ${dataType}: ${success ? 'APROVADO' : 'REPROVADO'}`);
      resolve(success);
    }, delay);
  });
};
// --- FIM SIMULAÇÃO ---

const initialProfileData = {
    name: '', cpf: '', address: '', interests: '',
    activitiesLastYear: '', eventsLastYear: '', purchasesLastYear: '',
    socialLinks: { twitter: '', twitch: '', instagram: '', discord: '' },
    esportsProfileLink: '', idDocumentInfo: null,
    idValidated: false, esportsProfileValidated: false, lastUpdated: null,
};

function Profile({ userId }) {
  const [profileData, setProfileData] = useState(initialProfileData);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [linking, setLinking] = useState({ google: false, twitter: false }); // Estado para loading de link/unlink
  const [message, setMessage] = useState({ type: '', text: '' });
  const [linkedProviders, setLinkedProviders] = useState([]); // Rastreia provedores vinculados

  const profileDocRef = useCallback(() => doc(db, "userProfiles", userId), [userId]);

  // Carregar dados do perfil e provedores vinculados
  useEffect(() => {
    let isMounted = true; // Flag para evitar set state em componente desmontado

    const fetchProfileAndProviders = async () => {
      if (!userId) return;
      setLoading(true);
      setMessage({ type: '', text: '' });

      try {
        // Buscar Perfil
        const docSnap = await getDoc(profileDocRef());
        if (isMounted && docSnap.exists()) {
          const data = docSnap.data();
          setProfileData(prev => ({
              ...initialProfileData, ...data,
              socialLinks: data.socialLinks || initialProfileData.socialLinks,
              lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : null
            }));
        } else if (isMounted) {
          console.log("Perfil não encontrado, usando inicial.");
          setProfileData(initialProfileData);
        }

        // Buscar Provedores Vinculados
        const currentUser = auth.currentUser;
        if (isMounted && currentUser) {
            const providerIds = currentUser.providerData.map(p => p.providerId);
            setLinkedProviders(providerIds);
            console.log("Provedores carregados:", providerIds);
        }

      } catch (error) {
        console.error("Erro ao buscar perfil/provedores:", error);
        if (isMounted) setMessage({ type: 'error', text: "Falha ao carregar dados." });
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfileAndProviders();

    // Cleanup: marca como desmontado
    return () => { isMounted = false; };

  }, [userId, profileDocRef]); // Depende de userId

  // Handlers de formulário (sem mudanças)
  const handleChange = (e) => { /* ... */ setProfileData(prev => ({ ...prev, [e.target.name]: e.target.value })); };
  const handleSocialLinkChange = (e) => { /* ... */ setProfileData(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, [e.target.name]: e.target.value } })); };
  const handleFileChange = (e) => { /* ... */
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setProfileData(prev => ({ ...prev, idDocumentInfo: { name: file.name, size: file.size, type: file.type }, idValidated: false }));
      setMessage({ type: 'info', text: `Arquivo "${file.name}" pronto para validação (simulada) ao salvar.` });
    } else {
      setSelectedFile(null);
    }
     e.target.value = null;
   };

  // Handler para Vincular Conta
  const handleLinkAccount = async (providerName) => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      let provider;
      if (providerName === 'google') provider = new GoogleAuthProvider();
      else if (providerName === 'twitter') provider = new TwitterAuthProvider();
      else return;

      setMessage({ type: '', text: '' }); // Limpa msg anterior
      setLinking(prev => ({ ...prev, [providerName]: true })); // Ativa loading

      try {
          const result = await linkWithPopup(currentUser, provider);
          // Atualiza estado local imediatamente
          const updatedProviders = result.user.providerData.map(p => p.providerId);
          setLinkedProviders(updatedProviders);
          setMessage({ type: 'success', text: `Conta ${providerName} vinculada com sucesso!` });
          console.log("Conta vinculada:", result.user);
      } catch (error) {
          console.error(`Erro ao vincular ${providerName}:`, error);
          if (error.code === 'auth/credential-already-in-use') {
              setMessage({ type: 'error', text: `Esta conta ${providerName} já está vinculada a outro usuário do nosso site.` });
          } else if (error.code === 'auth/popup-closed-by-user') {
               setMessage({ type: 'info', text: `Vinculação com ${providerName} cancelada.` });
          } else {
              setMessage({ type: 'error', text: `Falha ao vincular ${providerName}.` });
          }
      } finally {
          setLinking(prev => ({ ...prev, [providerName]: false })); // Desativa loading
      }
  };

    // Handler para Desvincular Conta
  const handleUnlinkAccount = async (providerId) => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      // Lógica de segurança: Não desvincular o último método se não tiver senha, etc.
       const passwordProvider = currentUser.providerData.find(p => p.providerId === 'password');
      if (currentUser.providerData.length <= 1 && !passwordProvider) {
           setMessage({ type: 'error', text: 'Não é possível desvincular o único método de login social.' });
           return;
      }

      setMessage({ type: '', text: '' });
      const providerName = providerId.split('.')[0]; // google ou twitter
      setLinking(prev => ({ ...prev, [providerName]: true }));

      try {
          const updatedUser = await unlink(currentUser, providerId);
           // Atualiza estado local
          const updatedProviders = updatedUser.providerData.map(p => p.providerId);
          setLinkedProviders(updatedProviders);
          setMessage({ type: 'success', text: `Conta ${providerName} desvinculada.` });
          console.log("Conta desvinculada, usuário atual:", updatedUser);
      } catch (error) {
          console.error(`Erro ao desvincular ${providerId}:`, error);
          setMessage({ type: 'error', text: `Falha ao desvincular ${providerId}.` });
      } finally {
          setLinking(prev => ({ ...prev, [providerName]: false }));
      }
  };


  // Handler Salvar Perfil (sem mudanças na lógica interna de salvar)
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    // ... (toda a lógica de validação simulada e salvar no Firestore permanece a mesma) ...
    setSaving(true);
    setMessage({ type: '', text: '' });
    let dataToSave = { ...profileData };
    let needsIdValidation = selectedFile && !dataToSave.idValidated;
    let needsEsportsLinkValidation = dataToSave.esportsProfileLink && !dataToSave.esportsProfileValidated;

    try {
        const validationPromises = [];
        if (needsIdValidation) validationPromises.push(simulateAIValidation('ID Document', dataToSave.idDocumentInfo?.name).then(r => dataToSave.idValidated = r));
        if (needsEsportsLinkValidation) validationPromises.push(simulateAIValidation('Esports Link', dataToSave.esportsProfileLink).then(r => dataToSave.esportsProfileValidated = r));

        if (validationPromises.length > 0) {
            setMessage({ type: 'info', text: 'Processando validações simuladas...' });
            await Promise.all(validationPromises);
        }

        delete dataToSave.selectedFile;
        dataToSave.lastUpdated = serverTimestamp();
        await setDoc(profileDocRef(), dataToSave, { merge: true });

        setProfileData(prev => ({ ...prev, ...dataToSave, lastUpdated: new Date() }));
        setSelectedFile(null);
        setMessage({ type: 'success', text: 'Perfil salvo com sucesso!' });
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      setMessage({ type: 'error', text: 'Erro ao salvar o perfil. Tente novamente.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.profileLoading}>Carregando perfil...</div>; // Use profileLoading se definido
  }

  // Função helper
  const isLinked = (providerId) => linkedProviders.includes(providerId);

  return (
    <div className={styles.profileContainer}>
      {/* Mensagem Global */}
      {message.text && ( <p className={`${styles.message} ${styles[message.type]}`}>{message.text}</p> )}

      <h2>Meu Perfil de Fã FURIA</h2>

      {/* Formulário Principal */}
      <form onSubmit={handleSaveProfile} id="profileFormId" className={styles.profileForm}>
        {/* Fieldset: Informações Pessoais */}
        <fieldset className={styles.fieldset}>
          <legend>Informações Pessoais</legend>
           <div className={styles.formGroup}>
             <label htmlFor="name">Nome Completo:</label>
             <input type="text" id="name" name="name" value={profileData.name} onChange={handleChange} required />
           </div>
            <div className={styles.formGroup}>
              <label htmlFor="cpf">CPF:</label>
              <input type="text" id="cpf" name="cpf" value={profileData.cpf} onChange={handleChange} placeholder="000.000.000-00" />
            </div>
           <div className={styles.formGroup}>
             <label htmlFor="address">Endereço:</label>
             <input type="text" id="address" name="address" value={profileData.address} onChange={handleChange} />
           </div>
        </fieldset>

        {/* Fieldset: Interesses e Atividades */}
        <fieldset className={styles.fieldset}>
            <legend>Interesses e Atividades (Último Ano)</legend>
            {/* ... Seus textareas para interests, activities, events, purchases ... */}
            <div className={styles.formGroup}><label htmlFor="interests">Interesses:</label><textarea id="interests" name="interests" value={profileData.interests} onChange={handleChange} rows="3" className={styles.textareaField}/></div>
            <div className={styles.formGroup}><label htmlFor="activitiesLastYear">Atividades:</label><textarea id="activitiesLastYear" name="activitiesLastYear" value={profileData.activitiesLastYear} onChange={handleChange} rows="3" className={styles.textareaField}/></div>
            <div className={styles.formGroup}><label htmlFor="eventsLastYear">Eventos:</label><textarea id="eventsLastYear" name="eventsLastYear" value={profileData.eventsLastYear} onChange={handleChange} rows="3" className={styles.textareaField}/></div>
            <div className={styles.formGroup}><label htmlFor="purchasesLastYear">Compras:</label><textarea id="purchasesLastYear" name="purchasesLastYear" value={profileData.purchasesLastYear} onChange={handleChange} rows="3" className={styles.textareaField}/></div>
        </fieldset>

        {/* Fieldset: Validação de Identidade */}
        <fieldset className={styles.fieldset}>
             <legend>Validação de Identidade (Simulada)</legend>
             {/* ... Seu input file e status ... */}
             <div className={styles.formGroup}>
                <label htmlFor="idDocument">Anexar Documento (ID, CNH):</label>
                <input type="file" id="idDocument" name="idDocument" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png"/>
                {profileData.idDocumentInfo && (<span className={styles.fileInfo}>Selecionado: {profileData.idDocumentInfo.name}</span>)}
             </div>
             <div className={styles.validationStatus}> Status:
                 {!profileData.idDocumentInfo ? (<em> Nenhum doc</em>) : profileData.idValidated ? (<strong className={styles.statusValidated}> Validado</strong>) : (<strong className={styles.statusPending}> Pendente</strong>)}
             </div>
              <small>O arquivo não é enviado (Plano Spark). Validação simulada.</small>
         </fieldset>

        {/* Fieldset: Links Sociais e de Jogos */}
        <fieldset className={styles.fieldset}>
            <legend>Links Sociais e de Jogos</legend>
             {/* ... Seus inputs para links (twitter, twitch, etc.) ... */}
             {Object.keys(profileData.socialLinks).map((platform) => (
               <div className={styles.formGroup} key={platform}>
                 <label htmlFor={platform}>{platform.charAt(0).toUpperCase() + platform.slice(1)}:</label>
                 <input type="url" id={platform} name={platform} value={profileData.socialLinks[platform]} onChange={handleSocialLinkChange} placeholder={`https://.../${platform}.com/`} />
               </div>
             ))}
            <hr/>
            {/* ... Seu input para esportsProfileLink e status ... */}
            <div className={styles.formGroup}>
                <label htmlFor="esportsProfileLink">Link Perfil Esports (OP.GG, etc.):</label>
                <input type="url" id="esportsProfileLink" name="esportsProfileLink" value={profileData.esportsProfileLink} onChange={handleChange} />
            </div>
            <div className={styles.validationStatus}> Status Link:
                {!profileData.esportsProfileLink ? (<em> Nenhum link</em>) : profileData.esportsProfileValidated ? (<strong className={styles.statusValidated}> Validado</strong>) : (<strong className={styles.statusPending}> Pendente</strong>)}
             </div>
        </fieldset>
      </form> {/* Fim do formulário principal */}


        {/* Fieldset: Contas Vinculadas (FORA do form principal) */}
        <fieldset className={styles.fieldset}>
            <legend>Contas Vinculadas</legend>
            <div className={styles.linkedAccountsContainer}>
                {/* Google */}
                <div className={styles.linkedAccountItem}>
                    <FaGoogle className={styles.providerIcon} color="google.com"/>
                    <span>Google</span>
                    {isLinked('google.com') ? (
                        <button onClick={() => handleUnlinkAccount('google.com')} className={styles.unlinkButton} disabled={linking.google || linking.twitter}>
                            {linking.google ? 'Aguarde...' : <><FaUnlink /> Desvincular</>}
                        </button>
                    ) : (
                        <button onClick={() => handleLinkAccount('google')} className={styles.linkButton} disabled={linking.google || linking.twitter}>
                            {linking.google ? 'Aguarde...' : 'Vincular'}
                        </button>
                    )}
                </div>
                {/* Twitter */}
                 <div className={styles.linkedAccountItem}>
                     <FaTwitter className={styles.providerIcon} color="twitter.com"/>
                    <span>Twitter</span>
                    {isLinked('twitter.com') ? (
                        <button onClick={() => handleUnlinkAccount('twitter.com')} className={styles.unlinkButton} disabled={linking.google || linking.twitter}>
                           {linking.twitter ? 'Aguarde...' : <><FaUnlink /> Desvincular</>}
                        </button>
                    ) : (
                        <button onClick={() => handleLinkAccount('twitter')} className={styles.linkButton} disabled={linking.google || linking.twitter}>
                           {linking.twitter ? 'Aguarde...' : 'Vincular'}
                        </button>
                    )}
                </div>
                 {/* Placeholders */}
                 <div className={`${styles.linkedAccountItem} ${styles.disabled}`}>
                    <FaTwitch className={styles.providerIcon} />
                    <span>Twitch</span>
                    <button disabled className={styles.linkButton}>Vincular (Em breve)</button>
                 </div>
                 <div className={`${styles.linkedAccountItem} ${styles.disabled}`}>
                     <FaInstagram className={styles.providerIcon} />
                    <span>Instagram</span>
                    <button disabled className={styles.linkButton}>Vincular (Em breve)</button>
                 </div>
            </div>
        </fieldset>


        {/* Botão Salvar (pode ficar fora se o form tiver ID) e Last Updated */}
         <div className={styles.saveButtonContainer}> {/* Container opcional para centralizar */}
            <button type="submit" form="profileFormId" disabled={saving || loading || linking.google || linking.twitter} className={styles.saveButton}>
                {saving ? 'Salvando...' : 'Salvar Alterações do Perfil'}
            </button>
         </div>
          {profileData.lastUpdated && ( <p className={styles.lastUpdated}>Última atualização: {profileData.lastUpdated.toLocaleString()}</p> )}

    </div> // Fim profileContainer
  );
}

export default Profile;