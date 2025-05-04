import React, { useState, useEffect, useCallback, useMemo } from "react";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig"; // Sem storage
import {
  GoogleAuthProvider,
  TwitterAuthProvider,
  linkWithPopup,
  unlink,
} from "firebase/auth";
import styles from "./Profile.module.css";

// Importa Steps
import PersonalInfoStep from "./Steps/PersonalInfoStep";
import SteamInfoStep from "./Steps/SteamInfoStep";
import InterestsEventsStep from "./Steps/InterestsEventsStep";
import PurchasesStep from "./Steps/PurchasesStep";
import SocialAccountsStep from "./Steps/SocialAccountsStep";
// Importa Componentes de Exibição
import FanBadgesDisplay from "./FanBadgesDisplay";
import ProfileDisplay from "./ProfileDisplay";
// Importa constantes
import { badgeDefinitions, teamOptions } from "../../constants"; // Ajuste caminho

// --- SIMULAÇÃO IA ---
const simulateAIValidation = (dataType, dataValue) => {
  console.log(`[IA SIM] Validando: ${dataType}...`);
  return new Promise((resolve) => {
    const delay = 1200 + Math.random() * 1800;
    setTimeout(() => {
      const success = Math.random() > 0.2;
      console.log(
        `[IA SIM] Resultado ${dataType}: ${success ? "OK" : "FALHA"}`
      );
      resolve(success);
    }, delay);
  });
};
// --- FIM SIMULAÇÃO ---

// --- Estado Inicial (CORRIGIDO) ---
const initialProfileData = {
  name: "",
  cpf: "",
  address: "",
  avatarUrl: "",
  dateOfBirth: "",
  steamNickname: "",
  favoriteTeams: "",
  interests: [],
  activitiesLastYear: [],
  eventsLastYear: [],
  purchasesLastYear: [],
  socialLinks: { twitter: "", twitch: "", instagram: "" },
  esportsProfileLink: "", // ✅ Reativado
  esportsLinkValidated: false, // ✅ Reativado
  idDocumentInfo: null,
  idValidated: false,
  lastUpdated: null,
};
// --- FIM Estado Inicial ---

// --- Função para Máscara de CPF ---
const formatCPF = (value) => {
  if (!value) return "";
  const cpf = value.replace(/\D/g, "");
  if (cpf.length <= 3) return cpf;
  if (cpf.length <= 6) return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
  if (cpf.length <= 9)
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
  return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(
    9,
    11
  )}`;
};
// --- FIM Função CPF ---

function Profile({ userId }) {
  // States
  const [isEditing, setIsEditing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState(initialProfileData);
  const [selectedFile, setSelectedFile] = useState(null); // ID File
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [linking, setLinking] = useState({ google: false, twitter: false });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [linkedProviders, setLinkedProviders] = useState([]);
  const [fanBadges, setFanBadges] = useState([]);

  const totalSteps = 5;
  const profileDocRef = useCallback(
    () => doc(db, "userProfiles", userId),
    [userId]
  );

  // Gerar Badges
  const generateBadges = useCallback((data, linked) => {
    // console.log("[generateBadges] Input:", data, linked);
    const earned = [];
    if (!data) return earned;
    badgeDefinitions.forEach((b) => {
      let met = false;
      try {
        met = b.criteria(data, linked);
      } catch (e) {
        console.error(`Err badge ${b.id}:`, e);
      }
      // console.log(`[generateBadges] Crit '${b.id}': ${met}`);
      if (met) earned.push(b);
    });
    console.log(
      "[generateBadges] Output:",
      earned.map((b) => b.id)
    );
    return earned;
  }, []);

  // Carregar dados (CORRIGIDO - sem refs a esportsProfileLink)
  useEffect(() => {
    let isMounted = true; // console.log("[useEffect] Fetch...");
    const fetchProfile = async () => {
      if (!userId) {
        if (isMounted) setLoading(false);
        return;
      }
      setLoading(true);
      setMessage({ type: "", text: "" });
      let loadedData = initialProfileData;
      let loadedProviders = [];
      let startEditing = true;
      try {
        const docSnap = await getDoc(profileDocRef());
        if (isMounted && docSnap.exists()) {
          const data = docSnap.data();
          // Carrega dados, garantindo tipos e omitindo campos removidos
          loadedData = {
            ...initialProfileData, // Começa com a estrutura limpa
            name: data.name || "",
            cpf: data.cpf || "",
            address: data.address || "",
            avatarUrl: typeof data.avatarUrl === "string" ? data.avatarUrl : "",
            dateOfBirth:
              typeof data.dateOfBirth === "string" ? data.dateOfBirth : "",
            steamNickname: data.steamNickname || "",
            favoriteTeams:
              typeof data.favoriteTeams === "string" ? data.favoriteTeams : "",
            interests: Array.isArray(data.interests) ? data.interests : [],
            activitiesLastYear: Array.isArray(data.activitiesLastYear)
              ? data.activitiesLastYear
              : [],
            eventsLastYear: Array.isArray(data.eventsLastYear)
              ? data.eventsLastYear
              : [],
            purchasesLastYear: Array.isArray(data.purchasesLastYear)
              ? data.purchasesLastYear
              : [],
            socialLinks: data.socialLinks || initialProfileData.socialLinks, // Assume que pode vir do BD
            idDocumentInfo: data.idDocumentInfo || null,
            idValidated: data.idValidated === true,
            lastUpdated: data.lastUpdated?.toDate
              ? data.lastUpdated.toDate()
              : null,
          };
          // Limpa links sociais não esperados (como discord) que possam vir do BD
          loadedData.socialLinks = {
            twitter: loadedData.socialLinks?.twitter || "",
            twitch: loadedData.socialLinks?.twitch || "",
            instagram: loadedData.socialLinks?.instagram || "",
          };

          // console.log("[useEffect] Data loaded:", loadedData);
          if (loadedData.name) startEditing = false;
          if (isMounted) setProfileData(loadedData);
        } else if (isMounted) {
          setProfileData(initialProfileData);
          loadedData = initialProfileData;
        }
        const currentUser = auth.currentUser;
        if (isMounted && currentUser) {
          loadedProviders = currentUser.providerData.map((p) => p.providerId);
          setLinkedProviders(loadedProviders);
        }
        if (isMounted) {
          setFanBadges(generateBadges(loadedData, loadedProviders));
          setIsEditing(startEditing);
          if (!startEditing) setCurrentStep(1);
        }
      } catch (error) {
        console.error("Erro fetch:", error);
        if (isMounted)
          setMessage({ type: "error", text: "Falha carregar dados." });
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, [userId, profileDocRef, generateBadges]);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value },
    }));
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setProfileData((prev) => ({
        ...prev,
        idDocumentInfo: { name: file.name, size: file.size, type: file.type },
        idValidated: false,
      }));
      setMessage({ type: "info", text: `Doc ID: ${file.name} pronto.` });
    } else {
      setSelectedFile(null);
    }
    e.target.value = null;
  };
  const handleAddItem = (fieldName, item) => {
    if (
      item &&
      Array.isArray(profileData[fieldName]) &&
      !profileData[fieldName]?.some(
        (i) => i.toLowerCase() === item.toLowerCase()
      )
    ) {
      setProfileData((prev) => ({
        ...prev,
        [fieldName]: [...prev[fieldName], item.trim()],
      }));
    }
  };
  const handleRemoveItem = (fieldName, itemToRemove) => {
    if (Array.isArray(profileData[fieldName])) {
      setProfileData((prev) => ({
        ...prev,
        [fieldName]: prev[fieldName].filter((i) => i !== itemToRemove),
      }));
    }
  };
  const handleLinkAccount = async (providerName) => {
    const user = auth.currentUser;
    if (!user) return;
    let provider;
    if (providerName === "google") provider = new GoogleAuthProvider();
    else if (providerName === "twitter") provider = new TwitterAuthProvider();
    else return;
    setMessage({ type: "", text: "" });
    setLinking((prev) => ({ ...prev, [providerName]: true }));
    try {
      const r = await linkWithPopup(user, provider);
      setLinkedProviders(r.user.providerData.map((p) => p.providerId));
      setMessage({ type: "success", text: `${providerName} vinculado!` });
    } catch (e) {
      console.error(`Erro vincular ${providerName}:`, e);
      if (e.code === "auth/credential-already-in-use")
        setMessage({
          type: "error",
          text: `${providerName} já vinculado a outro usuário.`,
        });
      else if (e.code === "auth/popup-closed-by-user")
        setMessage({ type: "info", text: `Vinculação cancelada.` });
      else
        setMessage({ type: "error", text: `Falha vincular ${providerName}.` });
    } finally {
      setLinking((prev) => ({ ...prev, [providerName]: false }));
    }
  };
  const handleUnlinkAccount = async (providerId) => {
    const user = auth.currentUser;
    if (!user) return;
    const passP = user.providerData.find((p) => p.providerId === "password");
    if (user.providerData.length <= 1 && !passP) {
      setMessage({ type: "error", text: "Não pode desvincular único método." });
      return;
    }
    setMessage({ type: "", text: "" });
    const pName = providerId.split(".")[0];
    setLinking((prev) => ({ ...prev, [pName]: true }));
    try {
      const uUser = await unlink(user, providerId);
      setLinkedProviders(uUser.providerData.map((p) => p.providerId));
      setMessage({ type: "success", text: `${pName} desvinculado.` });
    } catch (e) {
      console.error(`Erro desvincular ${providerId}:`, e);
      setMessage({ type: "error", text: `Falha desvincular ${pName}.` });
    } finally {
      setLinking((prev) => ({ ...prev, [pName]: false }));
    }
  };
  const isLinked = (providerId) => linkedProviders.includes(providerId);
  const handleEditToggle = () => {
    setIsEditing(true);
    setCurrentStep(1);
    setMessage({ type: "", text: "" });
  };
  const handleCPFChange = (e) => {
    const formattedCPF = formatCPF(e.target.value);
    setProfileData((prev) => ({ ...prev, cpf: formattedCPF }));
  };

  // Salvar Perfil (CORRIGIDO - sem validação de link esports)
  const handleSaveProfile = async () => {
    if (!userId) return;
    setMessage({ type: "", text: "" });

    // Validação Links Sociais (mantida)
    const twitterRegex =
      /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/[A-Za-z0-9_]{1,15}\/?$/;
    const instagramRegex =
      /^(https?:\/\/)?(www\.)?instagram\.com\/[A-Za-z0-9_.]{1,30}\/?$/;
    const twitchRegex =
      /^(https?:\/\/)?(www\.)?twitch\.tv\/[a-zA-Z0-9_]{4,25}\/?$/;
    let validationError = "";
    const links = profileData.socialLinks || {};

    if (links.twitter && !twitterRegex.test(links.twitter))
      validationError = "Link Twitter/X inválido.";
    else if (links.instagram && !instagramRegex.test(links.instagram))
      validationError = "Link Instagram inválido.";
    else if (links.twitch && !twitchRegex.test(links.twitch))
      validationError = "Link Twitch inválido.";

    if (validationError) {
      setMessage({ type: "error", text: validationError });
      return;
    }

    setSaving(true);
    let dataToSave = { ...profileData };

    // Garante arrays
    Object.keys(initialProfileData).forEach((key) => {
      if (Array.isArray(initialProfileData[key])) {
        dataToSave[key] = Array.isArray(dataToSave[key]) ? dataToSave[key] : [];
      }
    });

    // Garante strings básicas
    dataToSave.favoriteTeams =
      typeof dataToSave.favoriteTeams === "string"
        ? dataToSave.favoriteTeams
        : "";
    dataToSave.dateOfBirth =
      typeof dataToSave.dateOfBirth === "string" ? dataToSave.dateOfBirth : "";
    dataToSave.avatarUrl =
      typeof dataToSave.avatarUrl === "string" ? dataToSave.avatarUrl : "";

    // Simulações de validação
    let needsIdVal = selectedFile && !dataToSave.idValidated;
    let needsEsportsVal =
      dataToSave.esportsProfileLink && !dataToSave.esportsLinkValidated;

    try {
      const validationPromises = [];

      if (needsIdVal) {
        validationPromises.push(
          simulateAIValidation(
            "ID Document",
            dataToSave.idDocumentInfo?.name
          ).then((r) => {
            dataToSave.idValidated = r;
          })
        );
      }

      if (needsEsportsVal) {
        validationPromises.push(
          simulateAIValidation(
            "Esports Profile Link",
            dataToSave.esportsProfileLink
          ).then((r) => {
            dataToSave.esportsLinkValidated = r;
          })
        );
      }

      if (validationPromises.length > 0) {
        setMessage({ type: "info", text: "Validando dados (simulado)..." });
        await Promise.all(validationPromises);
      }

      // Pronto para salvar
      delete dataToSave.selectedFile;
      dataToSave.lastUpdated = serverTimestamp();
      await setDoc(profileDocRef(), dataToSave, { merge: true });

      const savedData = {
        ...profileData,
        ...dataToSave,
        lastUpdated: new Date(),
      };

      setProfileData(savedData);
      setFanBadges(generateBadges(savedData, linkedProviders));
      setSelectedFile(null);
      setMessage({ type: "success", text: "Perfil salvo!" });
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setMessage({ type: "error", text: "Erro ao salvar o perfil." });
    } finally {
      setSaving(false);
    }
  };

  // Navegação
  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const goToStep = (stepNumber) => {
    if (stepNumber >= 1 && stepNumber <= totalSteps && isEditing) {
      setCurrentStep(stepNumber);
    }
  };

  // --- Renderização ---
  const renderWizard = () => {
    const commonProps = { profileData, handleChange };
    const tagInputProps = { profileData, handleAddItem, handleRemoveItem };
    let StepComponent;
    switch (currentStep) {
      case 1:
        StepComponent = (
          <PersonalInfoStep
            {...commonProps}
            handleFileChange={handleFileChange}
            handleCPFChange={handleCPFChange}
          />
        );
        break;
      case 2:
        StepComponent = <SteamInfoStep {...commonProps} />;
        break;
      case 3:
        StepComponent = (
          <InterestsEventsStep
            {...tagInputProps}
            handleChange={handleChange}
            profileData={profileData}
          />
        );
        break;
      case 4:
        StepComponent = (
          <PurchasesStep {...tagInputProps} profileData={profileData} />
        );
        break;
      case 5:
        StepComponent = (
          <SocialAccountsStep
            profileData={profileData}
            setProfileData={setProfileData} // ✅ CORRIGIDO
            linkedProviders={linkedProviders}
            handleLinkAccount={handleLinkAccount}
            handleUnlinkAccount={handleUnlinkAccount}
            linking={linking}
            isLinked={isLinked}
          />
        );
        break;
      default:
        StepComponent = <div>Etapa inválida</div>;
    }
    return (
      <>
        {" "}
        <h2>{`Configuração (Etapa ${currentStep}/${totalSteps})`}</h2>{" "}
        {renderStepIndicator()}{" "}
        <div className={styles.stepContent}> {StepComponent} </div>{" "}
        <div className={styles.navigationButtons}>
          {" "}
          <button
            onClick={prevStep}
            disabled={
              currentStep === 1 || saving || linking.google || linking.twitter
            }
            className={`${styles.navButton} ${styles.prevButton}`}
          >
            {" "}
            Anterior{" "}
          </button>{" "}
          {currentStep < totalSteps ? (
            <button
              onClick={nextStep}
              disabled={saving || linking.google || linking.twitter}
              className={`${styles.navButton} ${styles.nextButton}`}
            >
              {" "}
              Próximo{" "}
            </button>
          ) : (
            <button
              onClick={handleSaveProfile}
              disabled={saving || linking.google || linking.twitter}
              className={`${styles.navButton} ${styles.finalSaveButton}`}
            >
              {" "}
              {saving ? "Salvando..." : "Salvar Perfil"}{" "}
            </button>
          )}{" "}
        </div>{" "}
      </>
    );
  };
  const renderStepIndicator = () => {
    const stepsInfo = [
      "Pessoal/ID",
      "Steam",
      "Interesses",
      "Compras",
      "Social",
    ]; // 5 etapas
    if (!isEditing) return null;
    return (
      <div className={styles.stepIndicator}>
        {" "}
        {stepsInfo.map((name, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          return (
            <button
              key={stepNumber}
              className={`${styles.step} ${isActive ? styles.stepActive : ""} ${
                styles.stepClickable
              }`}
              onClick={() => goToStep(stepNumber)}
              disabled={loading || saving || linking.google || linking.twitter}
              type="button"
            >
              {" "}
              {stepNumber}. {name}{" "}
            </button>
          );
        })}{" "}
      </div>
    );
  };

  // Renderização principal
  if (loading) {
    return <div className={styles.profileLoading}>Carregando...</div>;
  }
  return (
    <div className={styles.profileContainer}>
      {message.text && (
        <p className={`${styles.message} ${styles[message.type]}`}>
          {" "}
          {message.text}{" "}
        </p>
      )}
      {isEditing ? (
        renderWizard()
      ) : (
        <ProfileDisplay
          profileData={profileData}
          linkedProviders={linkedProviders}
          fanBadges={fanBadges}
          onEdit={handleEditToggle}
        />
      )}
      {!isEditing && profileData.lastUpdated && !saving && (
        <p className={styles.lastUpdated}>
          {" "}
          Última atualização: {profileData.lastUpdated.toLocaleString()}{" "}
        </p>
      )}
    </div>
  );
}
export default Profile;
