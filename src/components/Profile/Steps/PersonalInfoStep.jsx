// src/components/Profile/Steps/PersonalInfoStep.jsx
import React from 'react';
import styles from '../Profile.module.css'; // Usa o mesmo CSS Module

function PersonalInfoStep({ profileData, handleChange }) {
  return (
    <fieldset className={styles.stepFieldset}>
      {/* <legend>Informações Pessoais</legend> -> Legenda opcional, pode ser removida */}
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
  );
}
export default PersonalInfoStep;