    function templatePokemon(pokemon, index, bgColor) {
        return `
            <div  onclick="openPokemonModal(${index})" class="pokemon-card" style="background-color: ${bgColor};">
                <p class="pokemon_card_number">#${pokemon.id}</p>
                <h2 class="pokemon-card_title">${pokemon.name}</h2>
                <div class="pokemon_card_img_and_types">
                    <img src="${pokemon.sprites.front_default}" alt="">
                    <div class="typ_attributes">    
                        <p>${pokemon.types.map(t => `<p class="typ_attributes_p_tag">${t.type.name}</p>`).join(' ')}</p>
                    </div>
                </div>
            </div>
        `;
} // <div></div>
function templatePokemonModal(pokemon, evoHtml) {
    return `
        <span class="modal-close" onclick="closeModal()">&times;</span>
        <p>#${pokemon.id}</p>
        <h2 class="modal_h2">${pokemon.name}</h2>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">

        <!--  NavBar mit Tabs -->
        <div class="modal_content_section">
            <ul class="tab-nav">
                <li><a href="#" onclick="showTab('basics')">Basis</a></li>
                <li><a href="#" onclick="showTab('stats')">Stats</a></li>
                <li><a href="#" onclick="showTab('evo')">Evolution</a></li>
            </ul>

        <!--  Inhalt pro Tab -->
        <div id="basics" class="tab-content">
            <p><strong>Typ:</strong> ${pokemon.types[0].type.name}</p>
            <p><strong>Größe:</strong> ${pokemon.height / 10} m</p>
            <p><strong>Gewicht:</strong> ${pokemon.weight / 10} kg</p>
        </div>
        
         <!--  Diagramm -->
         
        <div id="stats" class="tab-content" style="display:none;">
            ${pokemon.stats.map(attribut => ` 
        <div class="stat-row">
            <span class="stat-name">${attribut.stat.name.toUpperCase()}:</span> 
            <div class="stat-bar">
                <div class="stat-fill" style="width: ${attribut.base_stat / 2}%;">
        </div>
                <span class="stat-value">${attribut.base_stat}</span>
            </div>
        </div>
            `).join('')}
        </div>

        
    

        <div id="evo" class="tab-content" style="display:none;">
            ${evoHtml}
        </div>
        
            <div class="slide_button">
                <button class="prev" onclick="changeSlide(-1)">&#8678;</button>
                <button class="next" onclick="changeSlide(1)">&#8680;</button>
            </div>
        </div>
    `;
}


