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