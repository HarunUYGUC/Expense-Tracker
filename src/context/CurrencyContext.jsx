import React, { createContext, useState, useContext, useEffect } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  // Başlangıçta localStorage'a bak, yoksa varsayılan USD yap
  const [currency, setCurrency] = useState(() => {
    const saved = localStorage.getItem('app_currency');
    return saved ? JSON.parse(saved) : { code: 'USD', symbol: '$', locale: 'en-US' };
  });

  // Para birimi değişince kaydet
  useEffect(() => {
    localStorage.setItem('app_currency', JSON.stringify(currency));
  }, [currency]);

  // Para birimini güncelleme fonksiyonu
  const updateCurrency = (code) => {
    switch (code) {
      case 'TRY':
        setCurrency({ code: 'TRY', symbol: '₺', locale: 'tr-TR' });
        break;
      case 'EUR':
        setCurrency({ code: 'EUR', symbol: '€', locale: 'de-DE' });
        break;
      case 'GBP':
        setCurrency({ code: 'GBP', symbol: '£', locale: 'en-GB' });
        break;
      case 'USD':
      default:
        setCurrency({ code: 'USD', symbol: '$', locale: 'en-US' });
        break;
    }
  };

  // Fiyat formatlama yardımcısı (Örn: 1250.50 -> ₺1.250,50)
  const formatPrice = (amount) => {
    const num = Number(amount) || 0;
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 2
    }).format(num);
  };

  return (
    <CurrencyContext.Provider value={{ currency, updateCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCurrency = () => useContext(CurrencyContext);