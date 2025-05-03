// src/components/Profile/Profile.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../../firebaseConfig'; // Ajuste o caminho
import './Profile.css'; // Crie para estilos do perfil

// --- SIMULAÇÃO DE IA ---
const simulateAIValidation = (dataType, dataValue) => {
  console.log(`[IA SIM] Iniciando validação: ${dataType} (${dataValue ? dataValue.substring(0, 30) + '...' : 'N/A'})`);
  return new Promise(resolve => {
    const delay = 1200 + Math.random() * 1800; // 1.2s a 3s
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% chance de sucesso
      console.log(`[IA SIM] Resultado para ${dataType}: ${success ? 'APROVADO' : 'REPROVADO'}`);
      resolve(success);
    }, delay);
  });
};
// --- FIM SIMULAÇÃO ---

const initialProfileData = {
    name: '',
    cpf: '',
    address: '', // Novo campo básico
    interests: '',
    activitiesLastYear: '',
    eventsLastYear: '',
    purchasesLastYear: '',
    socialLinks: { twitter: '', twitch: '', instagram: '', discord: '' },
    esportsProfileLink: '',
    idDocumentInfo: null, // Guarda { name: 'id.pdf', size: 123, type: 'application/pdf' }
    idValidated: false,
    esportsProfileValidated: false,
    lastUpdated: null,
};

function Profile({ userId }) {
  const [profileData, setProfileData] = useState(initialProfileData);
  const [selectedFile, setSelectedFile] = useState(null); // O objeto File em si (não salvo no BD)
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' }); // 'success', 'error', 'info'

  // Usar useCallback para memorizar a função que cria a referência ao documento
  const profileDocRef = useCallback(() => doc(db, "userProfiles", userId), [userId]);

  // Carregar dados ao montar
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return; // Garante que userId existe
      setLoading(true);
      setMessage({ type: '', text: '' });
      try {
        const docSnap = await getDoc(profileDocRef());
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileData(prev => ({
              ...initialProfileData, // Garante todos os campos default
               ...data,
               // Garante que socialLinks é um objeto
               socialLinks: data.socialLinks || initialProfileData.socialLinks,
               // Converte Timestamp do Firebase se existir
               lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : null
            }));
        } else {
          console.log("Perfil não encontrado, usuário usará formulário em branco.");
          setProfileData(initialProfileData); // Reseta para o inicial se não achar
        }
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        setMessage({ type: 'error', text: "Falha ao carregar o perfil." });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId, profileDocRef]); // Depende de userId

  // Handlers genéricos e específicos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target; // name será 'twitter', 'twitch', etc.
    setProfileData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value }
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo/tamanho aqui se desejar
      setSelectedFile(file);
      setProfileData(prev => ({
          ...prev,
          // Atualiza info do doc e reseta validação
          idDocumentInfo: { name: file.name, size: file.size, type: file.type },
          idValidated: false
      }));
      setMessage({ type: 'info', text: `Arquivo "${file.name}" pronto para validação (simulada) ao salvar.` });
    } else {
      setSelectedFile(null);
      // Opcional: limpar info se cancelar
      // setProfileData(prev => ({ ...prev, idDocumentInfo: null, idValidated: false }));
    }
     e.target.value = null; // Permite selecionar o mesmo arquivo novamente
  };

  // Salvar Perfil
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    let dataToSave = { ...profileData }; // Copia estado atual
    let needsIdValidation = false;
    let needsEsportsLinkValidation = false;

    // 1. Verificar se validações simuladas precisam rodar
    if (selectedFile && !dataToSave.idValidated) { // Novo arquivo E não validado ainda?
        needsIdValidation = true;
    }
    if (dataToSave.esportsProfileLink && !dataToSave.esportsProfileValidated) { // Link existe E não validado?
        needsEsportsLinkValidation = true;
    }

    try {
      // 2. Executar validações simuladas (se necessário)
      const validationPromises = [];
      if (needsIdValidation) {
        setMessage({ type: 'info', text: 'Validando documento (simulado)...' });
        validationPromises.push(
          simulateAIValidation('ID Document', dataToSave.idDocumentInfo?.name)
            .then(result => { dataToSave.idValidated = result; })
        );
      }
      if (needsEsportsLinkValidation) {
         setMessage({ type: 'info', text: 'Validando link de eSports (simulado)...' });
         validationPromises.push(
           simulateAIValidation('Esports Link', dataToSave.esportsProfileLink)
             .then(result => { dataToSave.esportsProfileValidated = result; })
         );
      }

      // Espera as simulações terminarem
      if (validationPromises.length > 0) {
          await Promise.all(validationPromises);
          setMessage({ type: 'info', text: 'Validações (simuladas) concluídas.' });
      }


      // 3. Preparar dados finais e salvar no Firestore
      // NÃO salvamos o objeto 'selectedFile'
      delete dataToSave.selectedFile; // Garante que não vá pro BD
      dataToSave.lastUpdated = serverTimestamp(); // Timestamp do servidor

      await setDoc(profileDocRef(), dataToSave, { merge: true });

      // Atualiza estado local APÓS sucesso no BD
      setProfileData(prev => ({
          ...prev,
          ...dataToSave,
          // Atualiza a data localmente para feedback imediato
          // (o valor real do serverTimestamp só virá na próxima leitura)
          lastUpdated: new Date()
        }));
      setSelectedFile(null); // Limpa o file selecionado

      setMessage({ type: 'success', text: 'Perfil salvo com sucesso!' });

    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      setMessage({ type: 'error', text: 'Erro ao salvar o perfil. Tente novamente.' });
    } finally {
      setSaving(false);
    }
  };

  // Renderização
  if (loading) {
    return <div className="profile-loading">Carregando perfil...</div>;
  }

  return (
    <div className="profile-container">
      <h2>Meu Perfil de Fã de Esports</h2>
      {message.text && (
        <p className={`message ${message.type}`}>
          {message.text}
        </p>
      )}
      <form onSubmit={handleSaveProfile} className="profile-form">

        <fieldset>
          <legend>Informações Pessoais</legend>
          <div className="form-group">
            <label htmlFor="name">Nome Completo:</label>
            <input type="text" id="name" name="name" value={profileData.name} onChange={handleChange} required />
          </div>
           <div className="form-group">
             <label htmlFor="cpf">CPF:</label>
             <input type="text" id="cpf" name="cpf" value={profileData.cpf} onChange={handleChange} placeholder="000.000.000-00" />
           </div>
          <div className="form-group">
            <label htmlFor="address">Endereço:</label>
            <input type="text" id="address" name="address" value={profileData.address} onChange={handleChange} />
          </div>
        </fieldset>

        <fieldset>
          <legend>Interesses e Atividades (Último Ano)</legend>
          <div className="form-group">
            <label htmlFor="interests">Interesses (Jogos, Times, etc.):</label>
            <textarea id="interests" name="interests" value={profileData.interests} onChange={handleChange} rows="3" />
          </div>
          {/* Outros textareas: activitiesLastYear, eventsLastYear, purchasesLastYear */}
          <div className="form-group">
            <label htmlFor="activitiesLastYear">Atividades:</label>
            <textarea id="activitiesLastYear" name="activitiesLastYear" value={profileData.activitiesLastYear} onChange={handleChange} rows="3" />
          </div>
           <div className="form-group">
             <label htmlFor="eventsLastYear">Eventos:</label>
             <textarea id="eventsLastYear" name="eventsLastYear" value={profileData.eventsLastYear} onChange={handleChange} rows="3" />
           </div>
            <div className="form-group">
              <label htmlFor="purchasesLastYear">Compras:</label>
              <textarea id="purchasesLastYear" name="purchasesLastYear" value={profileData.purchasesLastYear} onChange={handleChange} rows="3" />
            </div>
        </fieldset>

        <fieldset>
            <legend>Validação de Identidade (Simulada)</legend>
            <div className="form-group">
                <label htmlFor="idDocument">Anexar Documento (ID, CNH):</label>
                <input type="file" id="idDocument" name="idDocument" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png"/>
                {profileData.idDocumentInfo && (
                    <span className="file-info">Selecionado: {profileData.idDocumentInfo.name}</span>
                )}
            </div>
            <div className="validation-status">
                Status:
                {!profileData.idDocumentInfo ? (
                     <em> Nenhum documento selecionado</em>
                ) : profileData.idValidated ? (
                    <strong className="status-validated"> Validado (Simulado)</strong>
                ) : (
                    <strong className="status-pending"> Pendente / Reprovado (Simulado)</strong>
                )}
            </div>
             <small>O arquivo não é enviado (Plano Spark). A validação é simulada.</small>
        </fieldset>

         <fieldset>
           <legend>Links Sociais e de Jogos</legend>
           {Object.keys(profileData.socialLinks).map((platform) => (
             <div className="form-group" key={platform}>
               <label htmlFor={platform}>{platform.charAt(0).toUpperCase() + platform.slice(1)}:</label>
               <input
                 type="url"
                 id={platform}
                 name={platform}
                 value={profileData.socialLinks[platform]}
                 onChange={handleSocialLinkChange}
                 placeholder={`https://.../${platform}.com/`}
                />
             </div>
           ))}
           <hr />
           <div className="form-group">
             <label htmlFor="esportsProfileLink">Link Perfil Esports (OP.GG, etc.):</label>
             <input type="url" id="esportsProfileLink" name="esportsProfileLink" value={profileData.esportsProfileLink} onChange={handleChange} />
           </div>
            <div className="validation-status">
                Status Link:
                {!profileData.esportsProfileLink ? (
                     <em> Nenhum link fornecido</em>
                 ) : profileData.esportsProfileValidated ? (
                     <strong className="status-validated"> Validado (Simulado)</strong>
                 ) : (
                     <strong className="status-pending"> Pendente / Reprovado (Simulado)</strong>
                 )}
            </div>
         </fieldset>

        <button type="submit" disabled={saving || loading} className="save-button">
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>

         {profileData.lastUpdated && (
            <p className="last-updated">
                Última atualização: {profileData.lastUpdated.toLocaleString()}
            </p>
         )}
      </form>
    </div>
  );
}

export default Profile;