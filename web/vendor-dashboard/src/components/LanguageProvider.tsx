import React, { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type Language = "ar" | "en";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { i18n } = useTranslation();
    const [language, setLanguageState] = useState<Language>(i18n.language as Language);

    const setLanguage = (lang: Language) => {
        i18n.changeLanguage(lang);
        setLanguageState(lang);
    };

    const isRTL = language === "ar";

    useEffect(() => {
        document.documentElement.dir = isRTL ? "rtl" : "ltr";
        document.documentElement.lang = language;
    }, [language, isRTL]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, isRTL }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
