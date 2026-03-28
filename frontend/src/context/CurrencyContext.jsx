import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "tracker_currency_preference";

const currencyConfig = {
  INR: { symbol: "₹", rate: 1, locale: "en-IN" },
  USD: { symbol: "$", rate: 0.012, locale: "en-US" },
  EUR: { symbol: "€", rate: 0.011, locale: "de-DE" },
};

const CurrencyContext = createContext(null);

const replaceCurrencyInText = (text, formatter) => {
  if (!text) return text;

  return text.replace(/(?:Rs\.?|₹)\s?([\d,]+(?:\.\d+)?)/gi, (_, amount) =>
    formatter(Number(String(amount).replace(/,/g, "")))
  );
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => localStorage.getItem(STORAGE_KEY) || "INR");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currency);
  }, [currency]);

  const value = useMemo(() => {
    const config = currencyConfig[currency] || currencyConfig.INR;

    const convertAmount = (amount = 0) => Number(amount || 0) * config.rate;
    const convertToBaseAmount = (amount = 0) => Number(amount || 0) / config.rate;

    const formatCurrency = (amount = 0, options = {}) => {
      const convertedAmount = convertAmount(amount);
      const formatter = new Intl.NumberFormat(config.locale, {
        minimumFractionDigits: options.minimumFractionDigits ?? 0,
        maximumFractionDigits: options.maximumFractionDigits ?? 2,
      });

      return `${config.symbol}${formatter.format(convertedAmount)}`;
    };

    const formatRate = (amount = 0, options = {}) =>
      `${formatCurrency(amount, options)}${options.suffix ?? "/h"}`;

    const formatInsightText = (text) => replaceCurrencyInText(text, (amount) => formatCurrency(amount));

    return {
      currency,
      setCurrency,
      conversionRate: config.rate,
      symbol: config.symbol,
      supportedCurrencies: Object.keys(currencyConfig),
      convertAmount,
      convertToBaseAmount,
      formatCurrency,
      formatRate,
      formatInsightText,
    };
  }, [currency]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = () => useContext(CurrencyContext);
