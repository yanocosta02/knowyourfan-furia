// src/components/Profile/Steps/PurchasesStep.jsx
import React from "react";
import TagInput from "./TagInput"; // Importa o novo componente
import styles from "../Profile.module.css";

// --- Sugestões de Compras (Mova para um arquivo separado se ficarem grandes) ---
const purchaseSuggestionsData = [
  "Cadeira Gamer",
  "Mouse Gamer",
  "Teclado Mecânico",
  "Headset Gamer",
  "Monitor 144Hz",
  "Monitor 240Hz",
  "Mousepad Gamer",
  "Placa de Vídeo",
  "Webcam",
  "Microfone",
  "Skin CS2",
  "Skin Valorant",
  "Skin LoL",
  "Skin Dota 2",
  "Passe de Batalha",
  "Gift Card Steam",
  "Jogo na Steam",
  "Jogo Epic Games",
  "Assinatura Twitch",
  "Bits Twitch",
  "Merchandising FURIA",
  "Ingresso Evento Esports",
];
// --- Fim Sugestões ---

// Recebe props, incluindo handleAddItem, handleRemoveItem e handleFileChange
function PurchasesStep({
  profileData,
  handleAddItem,
  handleRemoveItem,
  handleFileChange,
}) {
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
      <small style={{ marginTop: "-10px", display: "block" }}>
        Apenas descrição manual. Não conectamos com seu histórico de compras.
      </small>
    </fieldset>
  );
}
export default PurchasesStep;
