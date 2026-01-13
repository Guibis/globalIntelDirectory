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
