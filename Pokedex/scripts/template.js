    function templatePokemon(pokemon, index, bgColor) {
        return `
            <div  onclick="openPokemonModal(${index})" class="pokemon-card" style="background-color: ${bgColor};">
                <h2>${pokemon.name}</h2>
                <img src="${pokemon.sprites.front_default}" alt="">
                <p>${pokemon.id}</p>
                <p>${pokemon.types.map(t => t.type.name).join(' ')}</p>
            </div>
        `;
}
function templatePokemonModal(pokemon) {
    return `
        <h2>${pokemon.name}</h2>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">

        <!--  NavBar mit Tabs -->
        <ul class="tab-nav">
            <li><a href="#" onclick="showTab('basics')">Basis</a></li>
            <li><a href="#" onclick="showTab('stats')">Stats</a></li>
            <li><a href="#" onclick="showTab('evo')">Evolution</a></li>
        </ul>

        <!--  Inhalt pro Tab -->
        <div id="basics" class="tab-content">
            <p><strong>Typ:</strong> ${pokemon.types.map(t => t.type.name).join(', ')}</p>
            <p><strong>Größe:</strong> ${pokemon.height / 10} m</p>
            <p><strong>Gewicht:</strong> ${pokemon.weight / 10} kg</p>
            <p><strong>ID:</strong> ${pokemon.id}</p>
        </div>

        <div id="stats" class="tab-content" style="display:none;">
            ${pokemon.stats.map(s => `
                <p><strong>${s.stat.name}:</strong> ${s.base_stat}</p>
            `).join('')}
        </div>

        <div id="evo" class="tab-content" style="display:none;">
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        </div>

        <button class="prev" onclick="changeSlide(-1)">&#10094;</button>
        <button class="next" onclick="changeSlide(1)">&#10095;</button>
        <span class="modal-close" onclick="closeModal()">&times;</span>
    `;
}
