import React from 'react';
import './language_selector.css';

export const LanguageContext = React.createContext<{ language: 'en' | 'nl' }>({ language: 'en' });

interface LanguageSelectorProps {
    value: 'en' | 'nl';
    onChange: (lang: 'en' | 'nl') => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ value, onChange }) => {
    const isEnglish = value === 'en';
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
                onChange={() => onChange(isEnglish ? 'nl' : 'en')}
                aria-label={isEnglish ? 'Switch to Dutch' : 'Switch to English'}
            />
            <span
                className={`language-selector-label nl ${!isEnglish ? 'active' : 'inactive'}`}
            >NL</span>
        </div>
    );
};

