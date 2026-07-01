import React from 'react';
import './language_selector.css';
import { useNavigate, useLocation } from 'react-router-dom';

export const LanguageSelector: React.FC = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const isEnglish = pathname !== '/nl' && !pathname.startsWith('/nl/');

    const switchTo = (lang: 'en' | 'nl') => {
        const target = (lang === 'en') === isEnglish ? (isEnglish ? 'nl' : 'en') : lang;
        navigate(target === 'nl' ? '/nl' : '/', { replace: true });
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
