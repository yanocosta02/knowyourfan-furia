import React from "react";
import styles from "../Profile.module.css";

function SteamInfoStep({ profileData, handleChange }) {
  return (
    <fieldset className={styles.stepFieldset}>
      <legend>Conta Steam</legend>
      <div className={styles.formGroup}>
        <label htmlFor="steamNickname">Steam Nickname / Profile ID:</label>
        <input
          type="text"
          id="steamNickname"
          name="steamNickname"
          value={profileData.steamNickname || ""}
          onChange={handleChange}
          placeholder="Seu nome de usuário ou ID numérico da Steam"
          className={styles.inputField}
        />
        <small>
          Forneça seu nome de usuário público ou ID do perfil Steam.
        </small>
      </div>
    </fieldset>
  );
}
export default SteamInfoStep;
