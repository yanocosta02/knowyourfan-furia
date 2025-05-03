import React from "react";
import TagInput from "./TagInput";
import styles from "../Profile.module.css";
import {
  gameSuggestionsData,
  eventSuggestionsData,
  teamOptions,
} from "../../../constants"; // Ajuste caminho

// Recebe props para tag inputs e handleChange para o select
function InterestsEventsStep({
  profileData,
  handleAddItem,
  handleRemoveItem,
  handleChange,
}) {
  return (
    <fieldset className={styles.stepFieldset}>
      <legend>Interesses, Time e Eventos</legend>

      {/* SELEÇÃO ÚNICA DE TIME FAVORITO (Dropdown) */}
      <div className={styles.formGroup}>
        <label htmlFor="favoriteTeamSelect">
          Time Favorito (Selecione um):
        </label>
        <select
          id="favoriteTeamSelect"
          name="favoriteTeams" // Nome do campo no state
          value={profileData.favoriteTeams || ""} // Vincula ao valor string
          onChange={handleChange} // Usa o handler geral
          className={styles.selectField}
        >
          <option value="">-- Nenhum / Não informar --</option>
          {teamOptions.map((team) => (
            <option key={team} value={team}>
              {team}
            </option>
          ))}
        </select>
        <small>Escolha o seu time principal.</small>
      </div>

      <hr style={{ borderColor: "var(--furia-dark-gray)", margin: "10px 0" }} />

      {/* Tag Input para Jogos */}
      <TagInput
        label="Jogos de Interesse (Adicione vários)"
        fieldName="interests"
        items={profileData.interests} // Passa o array
        suggestionsData={gameSuggestionsData}
        handleAddItem={handleAddItem} // Passa o handler correto
        handleRemoveItem={handleRemoveItem} // Passa o handler correto
        placeholder="Digite um jogo e pressione Enter..."
      />

      <hr style={{ borderColor: "var(--furia-dark-gray)", margin: "10px 0" }} />

      {/* Tag Input para Eventos */}
      <TagInput
        label="Eventos Assistidos (Adicione vários)"
        fieldName="eventsLastYear"
        items={profileData.eventsLastYear} // Passa o array
        suggestionsData={eventSuggestionsData}
        handleAddItem={handleAddItem} // Passa o handler correto
        handleRemoveItem={handleRemoveItem} // Passa o handler correto
        placeholder="Digite um evento e pressione Enter..."
      />
    </fieldset>
  );
}
export default InterestsEventsStep;
