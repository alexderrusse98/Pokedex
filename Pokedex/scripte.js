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
let pokemonEvoImgShiny = [];

let pokemonEvoNames = [];

async function init() {
    setupLiveSearch(); // was macht diese function genau? aktiviert das input Feld
    await loadMorePokemon(); // warum await? es holt schon mal die Pokemon
}

async function loadMorePokemon() {
    showSpinner();
    const response = await fetch(`${BASE_URL}10&offset=${currentOffset}`); // anfrage an die API
    const data = await response.json(); // Response-Objekt wird jetzt lesbar gemacht
    const results = data.results; // jetzt wird aus dem object auf results zugegriffen name und weitere url

    for (let result of results) {
        const detailsRes = await fetch(result.url);
        const pokemonDetails = await detailsRes.json();
        pokemonArray.push(pokemonDetails); // holt details zum Pokemon, ID,Types

        const speciesRes = await fetch(pokemonDetails.species.url);
        const speciesData = await speciesRes.json();

        const evoChainRes = await fetch(speciesData.evolution_chain.url);
        const evoChainData = await evoChainRes.json();
    
        const evoImages = [];
        const shinyImages = [];
        const evoNames = [];
        const description = getFlavorText(speciesData, 'en');
        pokemonDetails.description = description;
        let current = evoChainData.chain;

    
        

        for (let i = 0; i < 3 && current; i++) {
            const name = current.species.name;
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
            const data = await res.json();
            evoImages.push(data.sprites.front_default);
            evoNames.push(name);
    
        
    
            current = current.evolves_to[0]; 
        }

        pokemonEvoImg.push(evoImages);
        pokemonEvoNames.push(evoNames);
        pokemonEvoImgShiny.push(shinyImages);
    }

    currentOffset += 20;
    hideSpinner();
    displayPokemon();
} // schwierige function, verstehe es noch nicht ganz

function getFlavorText(speciesData, langCode){
    const entry = speciesData.flavor_text_entries.find(
        (entry) => entry.language.name === langCode
        );
        return entry ? entry.flavor_text.replace(/\f/g, ' ') : 'Keine Beschreibung verfügbar.';
}

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

function openPokemonModal(index) {
    slideIndex = index;
    const p = pokemonArray[index];
    const modal = document.getElementById('modal');
    const content = document.getElementById('modal-content');
    changeColor(content, p);
    const evolutionImages = pokemonEvoImg[index];
    const evoNames = pokemonEvoNames[index];
    let evoHtml = '';
for (let i = 0; i < evolutionImages.length; i++) {
    evoHtml += `<div class="modal_evo_content${i}">
            <h3 class="evo_example_titles${i}">${evoNames[i]}</h3>
            <img src="${evolutionImages[i]}" alt="evolution normal" style="width: 100px;">
         </div> `;
         console.log(i);
         
}

    const description = p.description;
    content.innerHTML = templatePokemonModal(p, evoHtml, description);


    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    modal.onclick = function (event) {
        if (event.target === modal) closeModal();
    };
}

function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.style.display = 'none'); 

    const activeTab = document.getElementById(tabId);
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
    const mainType = pokemon.types[0].type.name;
    const bgColor = typeColors[mainType];
    content.style.backgroundColor = bgColor;
}

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

function loadMore() {
    loadMorePokemon();
}
function likeButton() {
  const likeButton = document.getElementById('like-button');

  if (likeButton.textContent === '🖤') {
    likeButton.textContent = '💖';
  } else {
    likeButton.textContent = '🖤';
  }
}

function showSpinner() {
  document.getElementById('spinner').classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // Scrollen verhindern
}

function hideSpinner() {
  document.getElementById('spinner').classList.add('hidden');
  document.body.style.overflow = ''; // Scrollen wieder erlauben
}
