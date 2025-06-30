const BASE_URL = 'https://pokeapi.co/api/v2/pokemon?limit=';

const typeColors = {
    fire: '#F08030', 
    water: '#6890F0', 
    grass: '#78C850',
    electric: '#F8D030', 
    psychic: '#F85888', 
    normal: '#A8A878',
    ground: '#E0C068', 
    rock: '#B8A038', 
    bug: '#A8B820',
    poison: '#A040A0', 
    ghost: '#705898', 
    dragon: '#7038F8',
    dark: '#705848', 
    steel: '#B8B8D0', 
    ice: '#98D8D8',
    fairy: '#EE99AC', 
    fighting: '#C03028', 
    flying: '#A890F0'
};

let pokemonArray = [];

let currentOffset = 0;

let slideIndex = 0;

let pokemonEvoImg = [];

async function init() {
    setupLiveSearch();
    await loadMorePokemon(); // Initiale 10 laden
}
// ⬇ Pokémon laden
async function loadMorePokemon() {
    showSpinner();
    const response = await fetch(`${BASE_URL}10&offset=${currentOffset}`); // anfrage an die API    
    const data = await response.json(); // json Object erhalten
    const results = data.results; // das ist ein array im json

    for (let result of results) {
        const detailsRes = await fetch(result.url);
        const pokemonDetails = await detailsRes.json();
        pokemonArray.push(pokemonDetails);

        const resultDetailsEvo = await fetch(pokemonDetails.species.url)
        const resultEvo = await resultDetailsEvo.json();
        pokemonEvoImg.push(resultEvo);
        console.log(resultEvo); // jetzt muss ich das noch das Template übergeben
    }

    currentOffset += 10; 
    hideSpinner();
    displayPokemon();
}


//  Anzeige
function displayPokemon() {
    const container = document.getElementById('content');
    container.innerHTML = '';

    for (let i = 0; i < pokemonArray.length; i++) {
        const p = pokemonArray[i];
        const type = p.types[0].type.name;
        const bgColor = typeColors[type];
        container.innerHTML += templatePokemon(p, i, bgColor);
    }
}

//  Einzelnes Modal öffnen
function openPokemonModal(index) {
    slideIndex = index;
    const evo = pokemonEvoImg[index]
    const p = pokemonArray[index];
    const modal = document.getElementById('modal');
    const content = document.getElementById('modal-content');
    changeColor(content, p);
    console.log(evo);
    
    content.innerHTML = templatePokemonModal(p, evo);
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    modal.onclick = function (event) {
        if (event.target === modal) closeModal();
    };
}

function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.style.display = 'none'); // alle verstecken

    const activeTab = document.getElementById(tabId);
    if (activeTab) activeTab.style.display = 'block'; // gewünschten zeigen
}


function closeModal() {
    document.getElementById('modal').style.display = 'none';
    document.body.style.overflow = '';
}

function changeSlide(n) {
    slideIndex += n;
    if (slideIndex >= pokemonArray.length) 
        slideIndex = 0;
    else if (slideIndex < 0) 
        slideIndex = pokemonArray.length - 1;
    openPokemonModal(slideIndex);
}

function changeColor(content, pokemon) {
    const mainType = pokemon.types[0].type.name;
    const bgColor = typeColors[mainType];
    content.style.backgroundColor = bgColor;
}

//  Live-Suche
function setupLiveSearch() {
    const input = document.getElementById('searchInput');

    input.addEventListener('input', async () => {
        const query = input.value.trim().toLowerCase();

        if (query.length < 3) {
            displayPokemon();
            return;
        }
        showSpinner();
        await filterPokemon(query);
        hideSpinner();
    });
}

async function filterPokemon(query) {
    const filtered = pokemonArray.filter(p => {
        const name = p.name.toLowerCase();
        const types = p.types.map(t => t.type.name.toLowerCase());
        return name.includes(query) || types.some(type => type.includes(query));
    });

    renderFilteredPokemon(filtered);
}

function renderFilteredPokemon(filtered) {
    const container = document.getElementById('content');
    container.innerHTML = '';

    for (let i = 0; i < filtered.length; i++) {
        const p = filtered[i];
        const type = p.types[0].type.name;
        const bgColor = typeColors[type];
        container.innerHTML += templatePokemon(p, i, bgColor);
    }
}

//  Spinner
function showSpinner() {
    document.getElementById('spinner').classList.remove('hidden');
}
function hideSpinner() {
    document.getElementById('spinner').classList.add('hidden');
}

//  Weitere laden
function loadMore() {
    loadMorePokemon();
}
