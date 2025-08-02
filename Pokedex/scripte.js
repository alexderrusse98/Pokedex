let BASE_URL = 'https://pokeapi.co/api/v2/pokemon?limit=';

let typeColors = {
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
let pokemonEvoImgShiny = [];

let pokemonEvoNames = [];

async function init() {
    setupLiveSearch();
    checkScrollBalken();
    await loadMorePokemon();
}

async function loadMorePokemon() {
    showSpinner();
    let results = await fetchPokemonList(currentOffset);
    
    for (let result of results) {
        let pokemonDetails = await fetchPokemonDetails(result.url);
        pokemonArray.push(pokemonDetails);

        let evoData = await fetchEvolutionData(pokemonDetails.species.url);
        addEvolutionData(evoData, pokemonDetails);
    }
    currentOffset += 20;
    hideSpinner();
    displayPokemon();
    checkScrollBalken();
}

async function fetchPokemonList(offset) {
    let response = await fetch(`${BASE_URL}10&offset=${offset}`);
    let data = await response.json();
    return data.results;
}

async function fetchPokemonDetails(url) {
    let detailsRes = await fetch(url);
    let pokemonDetails = await detailsRes.json();

    let speciesRes = await fetch(pokemonDetails.species.url);
    let speciesData = await speciesRes.json();
    let description = getFlavorText(speciesData, 'en');

    pokemonDetails.description = description;

    pokemonDetails.speciesData = speciesData;
    
    return pokemonDetails;
}

async function fetchEvolutionData(speciesUrl) {
    let speciesRes = await fetch(speciesUrl);
    let speciesData = await speciesRes.json();

    let evoChainRes = await fetch(speciesData.evolution_chain.url);
    return await evoChainRes.json();
}

async function addEvolutionData(evoChainData) {
    const evoImages = [];
    const evoNames = [];
    const shinyImages = [];
    let current = evoChainData.chain;
    for (let i = 0; i < 3 && current; i++) {
        const name = current.species.name;
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const data = await res.json();
        evoImages.push(data.sprites.front_default);
        evoNames.push(name);
        current = current.evolves_to[0];}
    pokemonEvoImg.push(evoImages);
    pokemonEvoNames.push(evoNames);
    pokemonEvoImgShiny.push(shinyImages);
}

function getFlavorText(speciesData, langCode){
    let entry = speciesData.flavor_text_entries.find(
        (entry) => entry.language.name === langCode
        );
        return entry ? entry.flavor_text.replace(/\f/g, ' ') : 'Keine Beschreibung verfügbar.';
}

function displayPokemon() {
    let container = document.getElementById('content');
    container.innerHTML = '';

    for (let i = 0; i < pokemonArray.length; i++) {
        const p = pokemonArray[i];
        const type = p.types[0].type.name;
        const bgColor = typeColors[type];
        container.innerHTML += templatePokemon(p, i, bgColor);
    }
}

function getEvolutionHtml(evolutionImages, evoNames) {
    let evoHtml = '<div class="evolution_wrapper">';
    for (let i = 0; i < evolutionImages.length; i++) {
        evoHtml += templateEvolutionItem(evoNames[i], evolutionImages[i]);
    }
    evoHtml += '</div>';
    return evoHtml;
}

function renderPokemonModal(pokemon, evoHtml, description) {
    let content = document.getElementById('modal-content');
    changeColor(content, pokemon);
    content.innerHTML = templatePokemonModal(pokemon, evoHtml, description);
}

function openPokemonModal(index) {
    slideIndex = index;
    let p = pokemonArray[index];
    let evoHtml = getEvolutionHtml(pokemonEvoImg[index], pokemonEvoNames[index]);
    renderPokemonModal(p, evoHtml, p.description);

    let modal = document.getElementById('modal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    modal.onclick = e => { if (e.target === modal) closeModal(); };
}


function showTab(tabId) {
    let tabs = document.querySelectorAll('.tab_content');
    tabs.forEach(tab => tab.style.display = 'none'); 

    let activeTab = document.getElementById(tabId);
    if (activeTab) activeTab.style.display = 'block'; 
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
    let mainType = pokemon.types[0].type.name;
    let bgColor = typeColors[mainType];
    content.style.backgroundColor = bgColor;
}

function setupLiveSearch() {
    let input = document.getElementById('searchInput');

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
    let filtered = pokemonArray.filter(p => {
        let name = p.name.toLowerCase();
        let types = p.types.map(t => t.type.name.toLowerCase());
        return name.includes(query) || types.some(type => type.includes(query));
    });

    renderFilteredPokemon(filtered);
}

function renderFilteredPokemon(filtered) {
    let container = document.getElementById('content');
    container.innerHTML = '';

    for (let i = 0; i < filtered.length; i++) {
        const p = filtered[i];
        const type = p.types[0].type.name;
        const bgColor = typeColors[type];
        container.innerHTML += templatePokemon(p, i, bgColor);
    }
}

function loadMore() {
    loadMorePokemon();
}

function likeButton() {
  let likeButton = document.getElementById('like-button');

  if (likeButton.textContent === '🖤') {
    likeButton.textContent = '💖';
  } else {
    likeButton.textContent = '🖤';
  }
}

function checkScrollBalken() {
    let scrollBalken = document.documentElement.scrollHeight > window.innerHeight;
    document.querySelectorAll('.scroll_link').forEach(btn => {btn.style.display = scrollBalken ? "block": "none";
    });
    console.log(scrollBalken);
    
}