
export const CURRENCY_RATES = {
    INR: 83.5,    
    USD: 1,       
    GBP: 0.79,    
    CAD: 1.35,    
    AUD: 1.52     
};

export const CURRENCY_SYMBOLS = {
    INR: '₹',
    USD: '$',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$'
};

export const COUNTRY_CURRENCY_MAP = {
    INDIA: 'INR',
    USA: 'USD',
    UK: 'GBP',
    CANADA: 'CAD',
    AUSTRALIA: 'AUD'
};

export const getPriceForCountry = (product, country) => {
    if (product.pricing && product.pricing[country] && product.pricing[country].price > 0) {
        return {
            price: product.pricing[country].price,
            currency: product.pricing[country].currency,
            symbol: CURRENCY_SYMBOLS[product.pricing[country].currency]
        };
    }

    const basePrice = product.price || 0;
    const targetCurrency = COUNTRY_CURRENCY_MAP[country] || 'USD';
    const convertedPrice = basePrice * CURRENCY_RATES[targetCurrency];

    return {
        price: Math.round(convertedPrice * 100) / 100,
        currency: targetCurrency,
        symbol: CURRENCY_SYMBOLS[targetCurrency]
    };
};

// Get currency symbol for a country
export const getCurrencyForCountry = (country) => {
    const currency = COUNTRY_CURRENCY_MAP[country] || 'USD';
    return {
        currency,
        symbol: CURRENCY_SYMBOLS[currency]
    };
};

// Format price with currency symbol
export const formatPrice = (priceOrProduct, country) => {
    if (priceOrProduct && typeof priceOrProduct === 'object' && priceOrProduct.price !== undefined) {
        const pricing = getPriceForCountry(priceOrProduct, country);
        return `${pricing.symbol}${pricing.price.toFixed(2)}`;
    }

    const numeric = Number(priceOrProduct) || 0;
    const currency = COUNTRY_CURRENCY_MAP[country] || 'USD';
    const symbol = CURRENCY_SYMBOLS[currency];
    return `${symbol}${(Math.round(numeric * 100) / 100).toFixed(2)}`;
};

export const formatConvertedPrice = (convertedPrice, country) => {
    const currency = COUNTRY_CURRENCY_MAP[country] || 'USD';
    const symbol = CURRENCY_SYMBOLS[currency];
    return {
        symbol,
        price: Math.round(convertedPrice * 100) / 100
    };
};