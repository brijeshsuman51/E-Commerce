
const CURRENCY_RATES = {
    INR: 83.5,    
    USD: 1,       
    GBP: 0.79,    
    CAD: 1.35,   
    AUD: 1.52    
};

const CURRENCY_SYMBOLS = {
    INR: '₹',
    USD: '$',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$'
};

const COUNTRY_CURRENCY_MAP = {
    INDIA: 'INR',
    USA: 'USD',
    UK: 'GBP',
    CANADA: 'CAD',
    AUSTRALIA: 'AUD'
};

// Get price for country
const getPriceForCountry = (product, country) => {
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
        price: Math.round(convertedPrice * 100) / 100, // Round to 2 decimal places
        currency: targetCurrency,
        symbol: CURRENCY_SYMBOLS[targetCurrency]
    };
};

// Get symbol 
const getCurrencyForCountry = (country) => {
    const currency = COUNTRY_CURRENCY_MAP[country] || 'USD';
    return {
        currency,
        symbol: CURRENCY_SYMBOLS[currency]
    };
};

module.exports = {
    getPriceForCountry,
    getCurrencyForCountry,
    CURRENCY_RATES,
    CURRENCY_SYMBOLS,
    COUNTRY_CURRENCY_MAP
};