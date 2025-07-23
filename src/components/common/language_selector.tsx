
import React from 'react';
import { Dropdown } from 'react-bootstrap';

export const LanguageContext = React.createContext<{ language: 'en' | 'nl' }>({ language: 'en' });

interface LanguageSelectorProps {
    value: 'en' | 'nl';
    onChange: (lang: 'en' | 'nl') => void;
}

const languages = [
    { code: 'en', label: 'English' },
    { code: 'nl', label: 'Nederlands' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ value, onChange }) => {
    return (
        <Dropdown>
            <Dropdown.Toggle variant="secondary" id="language-selector">
                {languages.find(l => l.code === value)?.label || 'Select Language'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {languages.map(lang => (
                    <Dropdown.Item
                        key={lang.code}
                        active={lang.code === value}
                        onClick={() => onChange(lang.code as 'en' | 'nl')}
                    >
                        {lang.label}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};
