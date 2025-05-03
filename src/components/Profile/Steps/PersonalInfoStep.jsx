// src/components/Profile/Steps/PersonalInfoStep.jsx
import React from "react";
import styles from "../Profile.module.css";
import { FaUserCircle } from "react-icons/fa";

// Recebe handlers específicos e o geral
function PersonalInfoStep({
  profileData,
  handleChange,
  handleFileChange,
  handleCPFChange,
}) {
  const currentAvatarUrl = profileData.avatarUrl;

  return (
    <fieldset className={styles.stepFieldset}>
      <legend>Informações Pessoais e Identificação</legend>

      {/* Avatar URL Input/Preview */}
      <div className={styles.formGroup}>
        <label htmlFor="avatarUrl">URL da Imagem de Avatar (Opcional):</label>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          {currentAvatarUrl ? (
            <img
              src={currentAvatarUrl}
              alt="Avatar atual"
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : (
            <FaUserCircle
              style={{
                fontSize: "60px",
                color: "var(--furia-medium-gray)",
                flexShrink: 0,
              }}
            />
          )}
          <input
            type="url"
            id="avatarUrl"
            name="avatarUrl"
            value={profileData.avatarUrl || ""}
            onChange={handleChange}
            placeholder="https://exemplo.com/imagem.jpg"
            className={styles.inputField}
            style={{ flexGrow: 1 }}
          />
        </div>
        <small>Cole o link direto para uma imagem hospedada.</small>
      </div>

      <hr style={{ borderColor: "var(--furia-dark-gray)", margin: "10px 0" }} />

      {/* Informações de Texto */}
      <div className={styles.formGroup}>
        <label htmlFor="name">Nome Completo:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={profileData.name || ""}
          onChange={handleChange}
          required
          className={styles.inputField}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="dateOfBirth">Data de Nascimento:</label>
        <input
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          value={profileData.dateOfBirth || ""}
          onChange={handleChange}
          className={styles.inputField}
          max={new Date().toISOString().split("T")[0]}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="cpf">CPF:</label>
        <input
          type="text"
          id="cpf"
          name="cpf"
          value={profileData.cpf || ""}
          onChange={handleCPFChange}
          placeholder="000.000.000-00"
          maxLength="14"
          autoComplete="off"
          className={styles.inputField}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="address">Endereço:</label>
        <input
          type="text"
          id="address"
          name="address"
          value={profileData.address || ""}
          onChange={handleChange}
          className={styles.inputField}
        />
      </div>

      {/* Validação de ID */}
      <div
        className={styles.formGroup}
        style={{
          marginTop: "20px",
          borderTop: "1px solid var(--furia-dark-gray)",
          paddingTop: "20px",
        }}
      >
        <label htmlFor="idDocument">
          Documento para Validação (Opcional, Simulado):
        </label>
        <input
          type="file"
          id="idDocument"
          name="idDocument"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
          style={{ border: "none", padding: "0", colorScheme: "dark" }}
        />
        {profileData.idDocumentInfo && (
          <span className={styles.fileInfo} style={{ marginLeft: 0 }}>
            Selecionado: {profileData.idDocumentInfo.name}
          </span>
        )}
        <div className={styles.validationStatus} style={{ marginTop: "5px" }}>
          {" "}
          Status Validação:{" "}
          {!profileData.idDocumentInfo ? (
            <em> Nenhum</em>
          ) : profileData.idValidated ? (
            <strong className={styles.statusValidated}> OK (Simulado)</strong>
          ) : (
            <strong className={styles.statusPending}>
              {" "}
              Pendente (Simulado)
            </strong>
          )}{" "}
        </div>
        <small>Arquivo não enviado (Plano Spark). Validação simulada.</small>
      </div>
    </fieldset>
  );
}
export default PersonalInfoStep;
