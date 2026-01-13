let allCountries = [];
let filteredCountries = [];
let isPopulationSorted = false;
let currentRegion = 'all';

const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const gridEl = document.getElementById('country-grid');
const regionFilter = document.getElementById('region-filter');
const populationToggle = document.getElementById('population-toggle');
const statsEl = document.getElementById('stats');

const fetchCountries = async () => {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,region,currencies,flags,population');
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Failed to fetch country data: ${error.message}`);
    }
};

const getCurrency = (currencies) => {
    if (!currencies) return 'N/A';
    
    const currencyKeys = Object.keys(currencies);
    if (currencyKeys.length === 0) return 'N/A';
    
    const currency = currencies[currencyKeys[0]];
    return `${currency.name} (${currency.symbol || '?'})`;
};

 const renderCountries = (countries) => {
    gridEl.innerHTML = '';

    countries.forEach(country => {
        const card = document.createElement('div');
        card.className = 'country-card';

        const flag = document.createElement('img');
        flag.className = 'flag';
        flag.src = country.flags.png || country.flags.svg;
        flag.alt = `Flag of ${country.name.common}`;

        const name = document.createElement('div');
        name.className = 'country-name';
        name.textContent = country.name.common;

        const infoDiv = document.createElement('div');
        infoDiv.className = 'country-info';

        const createInfoRow = (label, value) => {
            const row = document.createElement('div');
            row.className = 'info-row';
            
            const labelSpan = document.createElement('span');
            labelSpan.className = 'info-label';
            labelSpan.textContent = label;
            
            const valueSpan = document.createElement('span');
            valueSpan.className = 'info-value';
            valueSpan.textContent = value;
            
            row.appendChild(labelSpan);
            row.appendChild(valueSpan);
            return row;
        };

        infoDiv.appendChild(createInfoRow('Region:', country.region || 'N/A'));
        infoDiv.appendChild(createInfoRow('Capital:', country.capital?.[0] || 'N/A'));
        infoDiv.appendChild(createInfoRow('Currency:', getCurrency(country.currencies)));
        infoDiv.appendChild(createInfoRow('Population:', country.population.toLocaleString()));

        card.appendChild(flag);
        card.appendChild(name);
        card.appendChild(infoDiv);

        gridEl.appendChild(card);
    });

    updateStats(countries.length);
};

const updateStats = (count) => {
    statsEl.textContent = `SHOWING ${count} TARGET${count !== 1 ? 'S' : ''} // REGION: ${currentRegion.toUpperCase()}`;
};

const filterByRegion = (region) => {
    currentRegion = region;
    
    if (region === 'all') {
        filteredCountries = [...allCountries];
    } else {
        filteredCountries = allCountries.filter(country => country.region === region);
    }
    
    applySort();
    renderCountries(filteredCountries);
};

const applySort = () => {
    if (isPopulationSorted) {
        filteredCountries.sort((a, b) => b.population - a.population);
    }
};
