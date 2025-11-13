const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

// ParcelMonkey configuration
const PARCELMONKEY_CONFIG = {
    userId: process.env.PM_USER_ID || '1265406',
    apiKey: process.env.PM_API_KEY || '2IRHW-GLXT5-Q37PD-A7YT3-V431M',
    version: '3.1',
    baseUrl: 'https://api.parcelmonkey.co.uk'
};

const getCountryDefaults = (countryCode) => {
    // Phone formats by country (E.164 format)
    const phoneFormats = {
        'GB': '+447911123456',
        'US': '+12125551234',
        'FR': '+33612345678',
        'DE': '+491701234567',
        'ES': '+34612345678',
        'IT': '+393123456789',
        'CA': '+14165551234',
        'AU': '+61412345678',
        'JP': '+819012345678',
        'CN': '+8613812345678',
        'NL': '+31612345678',
        'BE': '+32470123456',
        'CH': '+41791234567',
        'SE': '+46701234567',
        'NO': '+4712345678',
        'DK': '+4512345678',
        'PL': '+48123456789',
        'BR': '+5511987654321',
        'MX': '+521234567890',
        'IN': '+919876543210',
        'DEFAULT': '+12125551234'
    };
    
    // Main cities by country
    const cities = {
        'GB': 'London',
        'US': 'New York',
        'FR': 'Paris',
        'DE': 'Berlin',
        'ES': 'Madrid',
        'IT': 'Rome',
        'CA': 'Toronto',
        'AU': 'Sydney',
        'JP': 'Tokyo',
        'CN': 'Beijing',
        'NL': 'Amsterdam',
        'BE': 'Brussels',
        'CH': 'Zurich',
        'SE': 'Stockholm',
        'NO': 'Oslo',
        'DK': 'Copenhagen',
        'PL': 'Warsaw',
        'CZ': 'Prague',
        'AT': 'Vienna',
        'PT': 'Lisbon',
        'GR': 'Athens',
        'IE': 'Dublin',
        'FI': 'Helsinki',
        'IN': 'New Delhi',
        'BR': 'São Paulo',
        'MX': 'Mexico City',
        'AR': 'Buenos Aires',
        'ZA': 'Johannesburg',
        'EG': 'Cairo',
        'TR': 'Istanbul',
        'RU': 'Moscow',
        'KR': 'Seoul',
        'TH': 'Bangkok',
        'MY': 'Kuala Lumpur',
        'SG': 'Singapore',
        'ID': 'Jakarta',
        'PH': 'Manila',
        'NZ': 'Auckland',
        'IL': 'Tel Aviv',
        'AE': 'Dubai',
        'SA': 'Riyadh',
        'HK': 'Hong Kong',
        'TW': 'Taipei',
        'DEFAULT': 'Capital City'
    };
    
    // Generic county/state/region names
    const regions = {
        'US': 'NY',
        'CA': 'ON',
        'AU': 'NSW',
        'GB': 'Greater London',
        'DEFAULT': 'Region'
    };
    
    return {
        phone: phoneFormats[countryCode] || phoneFormats['DEFAULT'],
        city: cities[countryCode] || cities['DEFAULT'],
        address: '123 Main Street',
        region: regions[countryCode] || regions['DEFAULT']
    };
};

const getValidPostcode = (countryCode, providedPostcode) => {
    // If we have a valid postcode provided, use it
    if (providedPostcode && providedPostcode !== '10001' && providedPostcode !== 'SW1A 1AA') {
        return providedPostcode;
    }
    
    // Otherwise, generate a valid format for each country
    const postcodeFormats = {
        'GB': 'SW1A 1AA',     // London
        'US': '10001',        // New York
        'CA': 'M5V 3A8',      // Toronto
        'FR': '75001',        // Paris
        'DE': '10115',        // Berlin
        'ES': '28001',        // Madrid
        'IT': '00100',        // Rome
        'AU': '2000',         // Sydney
        'JP': '100-0001',     // Tokyo
        'CN': '100000',       // Beijing
        'NL': '1011 AB',      // Amsterdam
        'BE': '1000',         // Brussels
        'CH': '8001',         // Zurich
        'SE': '111 21',       // Stockholm
        'NO': '0001',         // Oslo
        'DK': '1000',         // Copenhagen
        'PL': '00-001',       // Warsaw
        'CZ': '110 00',       // Prague
        'AT': '1010',         // Vienna
        'PT': '1000-001',     // Lisbon
        'GR': '105 57',       // Athens
        'IE': 'D01 F5P2',     // Dublin (Eircode)
        'FI': '00100',        // Helsinki
        'IN': '110001',       // New Delhi
        'BR': '01000-000',    // São Paulo
        'MX': '01000',        // Mexico City
        'AR': 'C1002',        // Buenos Aires
        'ZA': '2001',         // Johannesburg
        'EG': '11511',        // Cairo
        'TR': '34000',        // Istanbul
        'RU': '101000',       // Moscow
        'KR': '04524',        // Seoul
        'TH': '10200',        // Bangkok
        'MY': '50450',        // Kuala Lumpur
        'SG': '018956',       // Singapore
        'ID': '10110',        // Jakarta
        'PH': '1000',         // Manila
        'NZ': '1010',         // Auckland
        'IL': '6100000',      // Tel Aviv
        'AE': '00000',        // Dubai (UAE doesn't use postcodes)
        'SA': '11564',        // Riyadh
        'HK': '999077',       // Hong Kong
        'TW': '100',          // Taipei
        'DEFAULT': '12345'
    };
    
    return postcodeFormats[countryCode] || postcodeFormats['DEFAULT'];
};

function getNextBusinessDay() {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    if (date.getDay() === 0) date.setDate(date.getDate() + 1); // Skip Sunday
    if (date.getDay() === 6) date.setDate(date.getDate() + 2); // Skip Saturday
    return date.toISOString().split('T')[0];
}

// Corrected fallback rates function
function getFallbackRates(collection_country, delivery_country, weight, currentCost = 100) {
    const isInternational = collection_country !== delivery_country;
    const basePrice = currentCost;
    
    let rates = [];
    
    if (!isInternational && collection_country === 'GB') {
        // UK Domestic rates - realistic discounts
        rates = [
            { carrier: 'Royal Mail', service: 'Special Delivery Guaranteed by 1pm', price: basePrice * 0.92, transit: 'Next working day by 1pm' },
            { carrier: 'DPD', service: 'Next Day', price: basePrice * 0.90, transit: 'Next working day by 12pm' },
            { carrier: 'ParcelForce', service: 'Express24', price: basePrice * 0.93, transit: 'Next working day' },
            { carrier: 'UPS', service: 'Express', price: basePrice * 0.94, transit: 'Next working day' },
            { carrier: 'Hermes', service: 'Next Day', price: basePrice * 0.88, transit: '1-2 working days' }
        ];
    } else if (isInternational) {
        // International rates - smaller discounts
        rates = [
            { carrier: 'DHL Express', service: 'Express Worldwide', price: basePrice * 0.95, transit: '2-4 business days' },
            { carrier: 'FedEx', service: 'International Priority', price: basePrice * 0.96, transit: '2-4 business days' },
            { carrier: 'UPS', service: 'Worldwide Express', price: basePrice * 0.97, transit: '2-5 business days' },
            { carrier: 'ParcelForce', service: 'Global Priority', price: basePrice * 0.94, transit: '3-5 business days' },
            { carrier: 'Royal Mail', service: 'International Tracked', price: basePrice * 0.93, transit: '5-7 business days' }
        ];
    }
    
    // Adjust for weight
    if (weight > 30) {
        rates = rates.map(r => ({ ...r, price: r.price * 1.05 })); // 5% increase for heavy items
    }
    
    return rates.sort((a, b) => a.price - b.price);
}

// Endpoint to get shipping rates
app.post('/api/shipping-rates', async (req, res) => {
    try {
        const { 
            collection_country, 
            delivery_country, 
            weight,
            collection_postcode,
            delivery_postcode
        } = req.body;

        console.log('Received rate request:', {
            from: `${collection_country} (${collection_postcode})`,
            to: `${delivery_country} (${delivery_postcode})`,
            weight: `${weight}kg`
        });

        // Get country-specific defaults
        const senderDefaults = getCountryDefaults(collection_country);
        const recipientDefaults = getCountryDefaults(delivery_country);
        
        // Get valid postcodes
        const validCollectionPostcode = getValidPostcode(collection_country, collection_postcode);
        const validDeliveryPostcode = getValidPostcode(delivery_country, delivery_postcode);

        const collectionDate = getNextBusinessDay();

        const requestBody = {
            origin: collection_country,
            destination: delivery_country,
            boxes: [{
                weight: weight || 1,
                length: 30,
                width: 25,
                height: 20
            }],
            goods_value: 100,
            collection_date: collectionDate,
            sender: {
                name: "Test Sender",
                phone: senderDefaults.phone,
                email: "sender@example.com",
                address1: senderDefaults.address,
                town: senderDefaults.city,
                county: senderDefaults.region,
                postcode: validCollectionPostcode
            },
            recipient: {  // Using correct spelling as shown in API examples
                name: "Test Recipient",
                phone: recipientDefaults.phone,
                email: "recipient@example.com",
                address1: recipientDefaults.address,
                town: recipientDefaults.city,
                county: recipientDefaults.region,
                postcode: validDeliveryPostcode
            }
        };

        console.log('Sending to ParcelMonkey:', JSON.stringify(requestBody, null, 2));

        // Use the configured base URL and proper authentication
        const response = await axios.post(
            `${PARCELMONKEY_CONFIG.baseUrl}/GetQuote`,
            requestBody,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'apiversion': PARCELMONKEY_CONFIG.version,
                    'userid': PARCELMONKEY_CONFIG.userId,
                    'token': PARCELMONKEY_CONFIG.apiKey
                }
            }
        );

        console.log('ParcelMonkey response:', response.data);

        const quotes = response.data || [];
        
        if (quotes.length === 0) {
            console.log('No quotes received from ParcelMonkey');
            throw new Error('No quotes received from ParcelMonkey');
        }

        // Format the response
        const formattedRates = quotes.map(quote => ({
            carrier: quote.carrier || quote.service,
            service: quote.service_name || quote.service,
            price: parseFloat(quote.shipping_price_net || quote.total_price_net),
            transit: quote.service_description || 'Standard delivery'
        }));

        // Sort by price
        formattedRates.sort((a, b) => a.price - b.price);

        res.json({
            success: true,
            rates: formattedRates,
            route: `${collection_country} → ${delivery_country}`,
            weight: weight
        });

    } catch (error) {
        console.error('Error fetching rates:', error.message);
        
        // Return fallback rates on error - fixed function call
        const fallbackRates = getFallbackRates(
            req.body.collection_country,
            req.body.delivery_country,
            req.body.weight,
            100 // default current cost
        );
        
        res.json({
            success: false,
            error: error.message,
            rates: fallbackRates,
            route: `${req.body.collection_country} → ${req.body.delivery_country}`,
            weight: req.body.weight
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        service: 'ParcelMonkey Proxy',
        timestamp: new Date().toISOString(),
        config: {
            baseUrl: PARCELMONKEY_CONFIG.baseUrl,
            version: PARCELMONKEY_CONFIG.version,
            userId: PARCELMONKEY_CONFIG.userId ? 'configured' : 'missing'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: err.message
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`ParcelMonkey proxy server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`Using ParcelMonkey API: ${PARCELMONKEY_CONFIG.baseUrl}`);
});