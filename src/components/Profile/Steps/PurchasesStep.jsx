// src/components/Profile/Steps/PurchasesStep.jsx
import React from 'react';
import TagInput from './TagInput'; // Importa o novo componente
import styles from '../Profile.module.css';

// --- Sugestões de Compras (Mova para um arquivo separado se ficarem grandes) ---
const purchaseSuggestionsData = [
    'Cadeira Gamer', 'Mouse Gamer', 'Teclado Mecânico', 'Headset Gamer',
    'Monitor 144Hz', 'Monitor 240Hz', 'Mousepad Gamer', 'Placa de Vídeo',
    'Webcam', 'Microfone', 'Skin CS2', 'Skin Valorant', 'Skin LoL', 'Skin Dota 2',
    'Passe de Batalha', 'Gift Card Steam', 'Jogo na Steam', 'Jogo Epic Games',
    'Assinatura Twitch', 'Bits Twitch', 'Merchandising FURIA', 'Ingresso Evento Esports'
];
// --- Fim Sugestões ---

// Recebe props, incluindo handleAddItem, handleRemoveItem e handleFileChange
function PurchasesStep({ profileData, handleAddItem, handleRemoveItem, handleFileChange }) {
  return (
    <fieldset className={styles.stepFieldset}>
       <legend>Compras e Validação</legend>
      {/* Componente TagInput para Compras */}
       <TagInput
         label="Compras Recentes Relacionadas a Esports/Games"
         fieldName="purchasesLastYear" // Nome do campo no profileData (deve ser um array)
         items={profileData.purchasesLastYear} // Array atual de compras
         suggestionsData={purchaseSuggestionsData} // Todas as sugestões de compras
         handleAddItem={handleAddItem} // Função para adicionar
         handleRemoveItem={handleRemoveItem} // Função para remover
         placeholder="Digite um item comprado e pressione Enter..."
       />
       <small style={{marginTop: '-10px', display: 'block'}}>Apenas descrição manual. Não conectamos com seu histórico de compras.</small>

      {/* Campo Validação de ID */}
      <div className={styles.formGroup} style={{marginTop: '20px', borderTop: '1px solid var(--furia-dark-gray)', paddingTop: '20px'}}>
          <label htmlFor="idDocument">Anexar Documento para Validação (Opcional, Simulado):</label>
          <input
            type="file" id="idDocument" name="idDocument"
            onChange={handleFileChange} // Usa o handler passado por props
            accept=".pdf,.jpg,.jpeg,.png"
            style={{border: 'none', padding: '0', colorScheme: 'dark'}} // Ajuste de estilo básico
           />
           {/* Exibe info do arquivo e status */}
          {profileData.idDocumentInfo && (
              <span className={styles.fileInfo} style={{marginLeft: 0}}>Selecionado: {profileData.idDocumentInfo.name}</span>
          )}
          <div className={styles.validationStatus} style={{marginTop: '5px'}}> Status Validação:
              {!profileData.idDocumentInfo ? (<em> Nenhum doc</em>)
              : profileData.idValidated ? (<strong className={styles.statusValidated}> Validado (Simulado)</strong>)
              : (<strong className={styles.statusPending}> Pendente / Reprovado (Simulado)</strong>)}
          </div>
          <small>Arquivo não enviado (Plano Spark). Validação simulada.</small>
      </div>

    </fieldset>
  );
}
export default PurchasesStep;