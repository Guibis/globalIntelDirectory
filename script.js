let allCountries = [];
let filteredCountries = [];
let isPopulationSorted = false;
let currentRegion = 'all';
let searchTerm = '';

const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const gridEl = document.getElementById('country-grid');
const regionFilter = document.getElementById('region-filter');
const populationToggle = document.getElementById('population-toggle');
const searchInput = document.getElementById('country-search');
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
    statsEl.textContent = `SHOWING ${count} COUNTRY${count !== 1 ? 'S' : ''} // REGION: ${currentRegion.toUpperCase()}`;
};

const applyFilters = () => {
    let result = [...allCountries];

    // Filter by Region
    if (currentRegion !== 'all') {
        result = result.filter(country => country.region === currentRegion);
    }

    // Filter by Search Term
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(country => 
            country.name.common.toLowerCase().includes(term)
        );
    }

    // Sort by Population
    if (isPopulationSorted) {
        result.sort((a, b) => b.population - a.population);
    }

    filteredCountries = result;
    renderCountries(filteredCountries);
};

const filterByRegion = (region) => {
    currentRegion = region;
    applyFilters();
};

const togglePopulationSort = () => {
    isPopulationSorted = !isPopulationSorted;
    
    if (isPopulationSorted) {
        populationToggle.classList.add('active');
    } else {
        populationToggle.classList.remove('active');
    }
    
    applyFilters();
};

regionFilter.addEventListener('change', (e) => {
    filterByRegion(e.target.value);
});

searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value.trim();
    applyFilters();
});

populationToggle.addEventListener('click', togglePopulationSort);

const init = async () => {
    try {
        loadingEl.style.display = 'block';
        errorEl.style.display = 'none';
        
        allCountries = await fetchCountries();
        filteredCountries = [...allCountries];
        
        loadingEl.style.display = 'none';
        renderCountries(filteredCountries);
    } catch (error) {
        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';
        errorEl.textContent = `⚠️ MISSION FAILED: ${error.message}`;
    }
};

init();
