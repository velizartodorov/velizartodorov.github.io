import React from 'react';
import './language_selector.css';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const LanguageSelector: React.FC = () => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const isEnglish = i18n.language === 'en';
    const handleChange = () => {
        const newLang = isEnglish ? 'nl' : 'en';
        void i18n.changeLanguage(newLang);
        navigate(isEnglish ? '/nl' : '/', { replace: true });
    };
    return (
        <div className="form-check form-switch d-flex align-items-center language-selector-switch">
            <span
                className={`language-selector-label en ${isEnglish ? 'active' : 'inactive'}`}
            >EN</span>
            <input
                className="form-check-input language-selector-input"
                type="checkbox"
                id="lang-switch"
                checked={!isEnglish}
                onChange={handleChange}
                aria-label={isEnglish ? 'Switch to Dutch' : 'Switch to English'}
            />
            <span
                className={`language-selector-label nl ${isEnglish ? 'inactive' : 'active'}`}
            >NL</span>
        </div>
    );
};

