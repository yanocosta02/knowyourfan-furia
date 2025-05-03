// src/components/Profile/Steps/InterestsEventsStep.jsx
import React from 'react';
import TagInput from './TagInput';
import styles from '../Profile.module.css';
// Importa as listas de sugestões e times
import { gameSuggestionsData, eventSuggestionsData, teamOptions } from '../../../constants'; // Ajuste o caminho se necessário

// Recebe profileData, handleAddItem, handleRemoveItem e teamOptions
function InterestsEventsStep({ profileData, handleAddItem, handleRemoveItem, teamOptions = [] }) {

  return (
    <fieldset className={styles.stepFieldset}>
      <legend>Interesses, Times e Eventos</legend>

       {/* Tag Input para Times Favoritos */}
       <TagInput
         label="Times Favoritos"
         fieldName="favoriteTeams" // Campo no profileData
         items={profileData.favoriteTeams} // Array de times
         suggestionsData={teamOptions} // Usa a lista de times importada
         handleAddItem={handleAddItem}
         handleRemoveItem={handleRemoveItem}
         placeholder="Digite um time e pressione Enter ou selecione..."
       />

       <hr style={{borderColor: 'var(--furia-dark-gray)', margin: '10px 0'}}/>

      {/* Tag Input para Jogos */}
      <TagInput
        label="Jogos de Interesse"
        fieldName="interests"
        items={profileData.interests}
        suggestionsData={gameSuggestionsData} // Usa sugestões de jogos
        handleAddItem={handleAddItem}
        handleRemoveItem={handleRemoveItem}
        placeholder="Digite um jogo e pressione Enter ou selecione..."
      />

       <hr style={{borderColor: 'var(--furia-dark-gray)', margin: '10px 0'}}/>

      {/* Tag Input para Eventos */}
      <TagInput
        label="Eventos Assistidos (Último Ano)"
        fieldName="eventsLastYear"
        items={profileData.eventsLastYear}
        suggestionsData={eventSuggestionsData} // Usa sugestões de eventos
        handleAddItem={handleAddItem}
        handleRemoveItem={handleRemoveItem}
        placeholder="Digite um evento e pressione Enter ou selecione..."
      />

    </fieldset>
  );
}
export default InterestsEventsStep;