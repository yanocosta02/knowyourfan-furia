import React, { useState, useEffect, useRef } from "react";
import styles from "../Profile.module.css";

function TagInput({
  label,
  fieldName,
  items = [],
  suggestionsData = [],
  handleAddItem,
  handleRemoveItem,
  placeholder,
}) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const filter = () => {
      if (!inputValue || inputValue.length < 1) {
        setSuggestions([]);
        return;
      }
      const lowerCaseQuery = inputValue.toLowerCase();
      const currentItems = Array.isArray(items)
        ? items.map((i) => i.toLowerCase())
        : [];
      const filtered = suggestionsData
        .filter(
          (item) =>
            item.toLowerCase().includes(lowerCaseQuery) &&
            !currentItems.includes(item.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    };
    filter();
  }, [inputValue, suggestionsData, items]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [containerRef]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleSuggestionClick = (suggestion) => {
    if (typeof handleAddItem === "function") {
      handleAddItem(fieldName, suggestion);
    }
    setInputValue("");
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };
  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
      e.preventDefault();
      const newItem = inputValue.trim();
      if (typeof handleAddItem === "function") {
        handleAddItem(fieldName, newItem);
      }
      setInputValue("");
      setShowSuggestions(false);
    } else if (
      e.key === "Backspace" &&
      inputValue === "" &&
      Array.isArray(items) &&
      items.length > 0
    ) {
      if (typeof handleRemoveItem === "function") {
        handleRemoveItem(fieldName, items[items.length - 1]);
      }
    }
  };

  return (
    <div className={styles.formGroup}>
      <label>{label}:</label>
      <div className={styles.suggestionsContainer} ref={containerRef}>
        <div
          className={styles.tagInputContainer}
          onClick={() => inputRef.current?.focus()}
        >
          {Array.isArray(items) &&
            items.map((item, index) => (
              <span
                key={`${fieldName}-${index}-${item}`}
                className={styles.tagItem}
              >
                {item}
                <button
                  type="button"
                  className={styles.tagRemoveButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (typeof handleRemoveItem === "function") {
                      handleRemoveItem(fieldName, item);
                    }
                  }}
                  title={`Remover ${item}`}
                  aria-label={`Remover ${item}`}
                >
                  {" "}
                  ×{" "}
                </button>
              </span>
            ))}
          <input
            ref={inputRef}
            type="text"
            className={styles.tagInputField}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() =>
              setShowSuggestions(
                suggestions.length > 0 && inputValue.length > 0
              )
            }
            placeholder={
              !Array.isArray(items) || items.length === 0 ? placeholder : ""
            }
            aria-label={label}
            autoComplete="off"
          />
        </div>
        {showSuggestions && suggestions.length > 0 && (
          <ul className={styles.suggestionsList}>
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className={styles.suggestionItem}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSuggestionClick(suggestion);
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
export default TagInput;
