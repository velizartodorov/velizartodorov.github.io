import React from 'react';
import './language_selector.css';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const LanguageSelector: React.FC = () => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const isEnglish = i18n.language === 'en';

    const switchTo = (lang: 'en' | 'nl') => {
        if ((lang === 'en') === isEnglish) return;
        void i18n.changeLanguage(lang);
        navigate(lang === 'nl' ? '/nl' : '/', { replace: true });
    };

    return (
        <div className="lang-pill" role="group" aria-label="Language">
            <button
                type="button"
                className={`lang-pill-btn${isEnglish ? ' active' : ''}`}
                onClick={() => switchTo('en')}
                aria-pressed={isEnglish}
            >EN</button>
            <button
                type="button"
                className={`lang-pill-btn${!isEnglish ? ' active' : ''}`}
                onClick={() => switchTo('nl')}
                aria-pressed={!isEnglish}
            >NL</button>
        </div>
    );
};
