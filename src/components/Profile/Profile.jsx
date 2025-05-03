// src/components/Profile/Profile.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from '../../firebaseConfig';
import { GoogleAuthProvider, TwitterAuthProvider, linkWithPopup, unlink } from "firebase/auth";
import styles from './Profile.module.css';

// Importa os componentes de etapa
import PersonalInfoStep from './Steps/PersonalInfoStep';
import SteamInfoStep from './Steps/SteamInfoStep';
import InterestsEventsStep from './Steps/InterestsEventsStep';
import PurchasesStep from './Steps/PurchasesStep';
import SocialAccountsStep from './Steps/SocialAccountsStep';
import FanBadgesDisplay from './FanBadgesDisplay';
// Importa constantes
import { badgeDefinitions, teamOptions } from '../../constants'; // Ajuste o caminho se necessário

// --- SIMULAÇÃO IA ---
const simulateAIValidation = (dataType, dataValue) => {
    console.log(`[IA SIM] Iniciando validação: ${dataType} (${dataValue ? dataValue.substring(0, 30) + '...' : 'N/A'})`);
    return new Promise(resolve => { const delay = 1200 + Math.random() * 1800; setTimeout(() => { const success = Math.random() > 0.2; console.log(`[IA SIM] Resultado ${dataType}: ${success ? 'OK' : 'FALHA'}`); resolve(success); }, delay); });
};
// --- FIM SIMULAÇÃO ---

// --- Estado Inicial ---
const initialProfileData = {
    name: '', cpf: '', address: '', steamNickname: '',
    favoriteTeams: [], interests: [], activitiesLastYear: [], eventsLastYear: [], purchasesLastYear: [],
    socialLinks: { twitter: '', twitch: '', instagram: '', discord: '' },
    esportsProfileLink: '', idDocumentInfo: null, idValidated: false, esportsProfileValidated: false, lastUpdated: null,
};
// --- FIM Estado Inicial ---

function Profile({ userId }) {
  // States
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState(initialProfileData);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [linking, setLinking] = useState({ google: false, twitter: false });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [linkedProviders, setLinkedProviders] = useState([]);
  const [fanBadges, setFanBadges] = useState([]);

  const totalSteps = 5; // 5 ETAPAS AGORA
  const profileDocRef = useCallback(() => doc(db, "userProfiles", userId), [userId]);

  // Função para Gerar Badges (useCallback)
  const generateBadges = useCallback((data, linked) => {
      const earnedBadges = []; if (!data) return earnedBadges;
      badgeDefinitions.forEach(badge => { try { if (badge.criteria(data, linked)) earnedBadges.push(badge); } catch (error) { console.error(`Erro critério badge ${badge.id}:`, error); } });
      console.log("Badges gerados:", earnedBadges.map(b => b.name)); return earnedBadges;
  }, []); // Dependência vazia

  // Carregar dados e gerar badges iniciais
  useEffect(() => {
    let isMounted = true;
    const fetchProfileAndProviders = async () => {
        if (!userId) { setLoading(false); return; }; setLoading(true); setMessage({ type: '', text: '' });
        let loadedData = initialProfileData; let loadedProviders = [];
        try {
            const docSnap = await getDoc(profileDocRef());
            if (isMounted && docSnap.exists()) {
                const data = docSnap.data();
                loadedData = { ...initialProfileData, ...data,
                    favoriteTeams: Array.isArray(data.favoriteTeams) ? data.favoriteTeams : [],
                    interests: Array.isArray(data.interests) ? data.interests : [],
                    activitiesLastYear: Array.isArray(data.activitiesLastYear) ? data.activitiesLastYear : [],
                    eventsLastYear: Array.isArray(data.eventsLastYear) ? data.eventsLastYear : [],
                    purchasesLastYear: Array.isArray(data.purchasesLastYear) ? data.purchasesLastYear : [],
                    steamNickname: data.steamNickname || '', socialLinks: data.socialLinks || initialProfileData.socialLinks,
                    lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : null
                };
                if(isMounted) setProfileData(loadedData);
            } else if (isMounted) { setProfileData(initialProfileData); loadedData = initialProfileData; }
            const currentUser = auth.currentUser;
            if (isMounted && currentUser) { loadedProviders = currentUser.providerData.map(p => p.providerId); setLinkedProviders(loadedProviders); }
            // Gera badges APÓS tudo carregado
            if(isMounted) setFanBadges(generateBadges(loadedData, loadedProviders));
        } catch (error) { console.error("Erro ao buscar dados:", error); if (isMounted) setMessage({ type: 'error', text: "Falha ao carregar dados." });
        } finally { if (isMounted) setLoading(false); }
    };
    fetchProfileAndProviders();
    return () => { isMounted = false; };
  }, [userId, profileDocRef, generateBadges]); // Inclui generateBadges aqui

   // --- Handlers ---
   const handleChange = (e) => { const { name, value } = e.target; setProfileData(prev => ({ ...prev, [name]: value })); };
   const handleSocialLinkChange = (e) => { const { name, value } = e.target; setProfileData(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, [name]: value } })); };
   const handleFileChange = (e) => { const file = e.target.files[0]; if (file) { setSelectedFile(file); setProfileData(prev => ({ ...prev, idDocumentInfo: { name: file.name, size: file.size, type: file.type }, idValidated: false })); setMessage({ type: 'info', text: `Arquivo "${file.name}" pronto.` }); } else { setSelectedFile(null); } e.target.value = null; };
   const handleAddItem = (fieldName, item) => { if (item && Array.isArray(profileData[fieldName]) && !profileData[fieldName]?.some(existing => existing.toLowerCase() === item.toLowerCase())) { setProfileData(prev => ({ ...prev, [fieldName]: [...prev[fieldName], item.trim()] })); } };
   const handleRemoveItem = (fieldName, itemToRemove) => { if(Array.isArray(profileData[fieldName])){ setProfileData(prev => ({ ...prev, [fieldName]: prev[fieldName].filter(item => item !== itemToRemove) })); } };
   const handleLinkAccount = async (providerName) => { const currentUser = auth.currentUser; if (!currentUser) return; let provider; if (providerName === 'google') provider = new GoogleAuthProvider(); else if (providerName === 'twitter') provider = new TwitterAuthProvider(); else return; setMessage({ type: '', text: '' }); setLinking(prev => ({ ...prev, [providerName]: true })); try { const result = await linkWithPopup(currentUser, provider); setLinkedProviders(result.user.providerData.map(p => p.providerId)); setMessage({ type: 'success', text: `Conta ${providerName} vinculada!` }); } catch (error) { console.error(`Erro vincular ${providerName}:`, error); if (error.code === 'auth/credential-already-in-use') setMessage({ type: 'error', text: `Conta ${providerName} já vinculada a outro usuário.` }); else if (error.code === 'auth/popup-closed-by-user') setMessage({ type: 'info', text: `Vinculação cancelada.` }); else setMessage({ type: 'error', text: `Falha ao vincular ${providerName}.` }); } finally { setLinking(prev => ({ ...prev, [providerName]: false })); } };
   const handleUnlinkAccount = async (providerId) => { const currentUser = auth.currentUser; if (!currentUser) return; const passwordProvider = currentUser.providerData.find(p => p.providerId === 'password'); if (currentUser.providerData.length <= 1 && !passwordProvider) { setMessage({ type: 'error', text: 'Não pode desvincular único método social.' }); return; } setMessage({ type: '', text: '' }); const providerName = providerId.split('.')[0]; setLinking(prev => ({ ...prev, [providerName]: true })); try { const updatedUser = await unlink(currentUser, providerId); setLinkedProviders(updatedUser.providerData.map(p => p.providerId)); setMessage({ type: 'success', text: `Conta ${providerName} desvinculada.` }); } catch (error) { console.error(`Erro desvincular ${providerId}:`, error); setMessage({ type: 'error', text: `Falha ao desvincular ${providerId}.` }); } finally { setLinking(prev => ({ ...prev, [providerName]: false })); } };
   const isLinked = (providerId) => linkedProviders.includes(providerId);

  // Handler Salvar Final
  const handleSaveProfile = async () => {
    setSaving(true); setMessage({ type: '', text: '' }); let dataToSave = { ...profileData };
    // Garante arrays
    Object.keys(initialProfileData).forEach(key => { if (Array.isArray(initialProfileData[key])) { dataToSave[key] = Array.isArray(dataToSave[key]) ? dataToSave[key] : []; } });
    // Validações simuladas
    let needsIdValidation = selectedFile && !dataToSave.idValidated; let needsEsportsLinkValidation = dataToSave.esportsProfileLink && !dataToSave.esportsProfileValidated;
    try {
        const validationPromises = [];
        if (needsIdValidation) validationPromises.push(simulateAIValidation('ID Document', dataToSave.idDocumentInfo?.name).then(r => {dataToSave.idValidated = r;}));
        if (needsEsportsLinkValidation) validationPromises.push(simulateAIValidation('Esports Link', dataToSave.esportsProfileLink).then(r => {dataToSave.esportsProfileValidated = r;}));
        if (validationPromises.length > 0) { setMessage({ type: 'info', text: 'Processando validações...' }); await Promise.all(validationPromises); }
        delete dataToSave.selectedFile; dataToSave.lastUpdated = serverTimestamp();
        await setDoc(profileDocRef(), dataToSave, { merge: true });
        // Atualiza estado local E GERA BADGES com os novos dados
        const savedData = { ...profileData, ...dataToSave, lastUpdated: new Date() };
        setProfileData(savedData);
        setFanBadges(generateBadges(savedData, linkedProviders)); // <<< Gera badges aqui
        setSelectedFile(null); setMessage({ type: 'success', text: 'Perfil salvo com sucesso!' });
    } catch (error) { console.error("Erro ao salvar perfil:", error); setMessage({ type: 'error', text: 'Erro ao salvar. Tente novamente.' });
    } finally { setSaving(false); }
  };

  // Navegação
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const goToStep = (stepNumber) => { if (stepNumber >= 1 && stepNumber <= totalSteps) { setCurrentStep(stepNumber); } };

  // --- Renderização ---
  const renderStepContent = () => {
    const commonProps = { profileData, handleChange };
    const tagInputProps = { profileData, handleAddItem, handleRemoveItem };
    switch (currentStep) {
      case 1: return <PersonalInfoStep {...commonProps} />;
      case 2: return <SteamInfoStep {...commonProps} />;
      case 3: return <InterestsEventsStep {...tagInputProps} teamOptions={teamOptions} />; // Passa teamOptions
      case 4: return <PurchasesStep {...tagInputProps} handleFileChange={handleFileChange} profileData={profileData} />;
      case 5: return <SocialAccountsStep profileData={profileData} handleSocialLinkChange={handleSocialLinkChange} linkedProviders={linkedProviders} handleLinkAccount={handleLinkAccount} handleUnlinkAccount={handleUnlinkAccount} linking={linking} isLinked={isLinked} />;
      default: return <div>Etapa inválida</div>;
    }
  };
   const renderStepIndicator = () => {
       const stepsInfo = ["Pessoal", "Steam", "Interesses", "Compras/ID", "Social"]; // 5 etapas
       return ( <div className={styles.stepIndicator}> {stepsInfo.map((name, index) => { const stepNumber = index + 1; const isActive = stepNumber === currentStep; return ( <button key={stepNumber} className={`${styles.step} ${isActive ? styles.stepActive : ''} ${styles.stepClickable}`} onClick={() => goToStep(stepNumber)} disabled={loading || saving || linking.google || linking.twitter} type="button" > {stepNumber}. {name} </button> ); })} </div> );
   };

  // Renderização principal
  if (loading) { return <div className={styles.profileLoading}>Carregando...</div>; }
  return (
    <div className={styles.profileContainer}>
       {message.text && (<p className={`${styles.message} ${styles[message.type]}`}>{message.text}</p>)}
       {!loading && fanBadges.length > 0 && ( <FanBadgesDisplay badges={fanBadges} /> )}
       <h2>{currentStep <= totalSteps ? `Configuração do Perfil (Etapa ${currentStep}/${totalSteps})` : 'Perfil'}</h2>
       {renderStepIndicator()}
       <div className={styles.stepContent}> {renderStepContent()} </div>
       <div className={styles.navigationButtons}>
            <button onClick={prevStep} disabled={currentStep === 1 || saving || linking.google || linking.twitter} className={`${styles.navButton} ${styles.prevButton}`}> Anterior </button>
           {currentStep < totalSteps ? ( <button onClick={nextStep} disabled={saving || linking.google || linking.twitter} className={`${styles.navButton} ${styles.nextButton}`}> Próximo </button> )
           : ( <button onClick={handleSaveProfile} disabled={saving || linking.google || linking.twitter} className={`${styles.navButton} ${styles.finalSaveButton}`}> {saving ? 'Salvando...' : 'Salvar Perfil Completo'} </button> )}
       </div>
        {profileData.lastUpdated && !saving && (<p className={styles.lastUpdated}>Última atualização: {profileData.lastUpdated.toLocaleString()}</p>)}
    </div>
  );
}
export default Profile;