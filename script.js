const TYPE_COLORS = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD',
};

async function loadPokemonList() {
    let pokemonList = await fetchPokemonList("?limit=15");    //Die Liste holen begrenzt auf 15 Stück
    let detailPromises = [];     //Ein Array um die Details zu laden
    for (let i = 0; i < pokemonList.length; i++) {
        let detailUrl = pokemonList[i].url;
        detailPromises.push(fetchPokemonDetails(detailUrl));
    }    
    let detailedPokemons = await Promise.all(detailPromises);  // warten, bis ALLE 15 Anfragen fertig sind
    renderPokemonCards(detailedPokemons);
}

function renderPokemonCards(pokemons) {
    let grid = document.getElementById("pokemon-grid");
    grid.innerHTML = ""; 

    for (let i = 0; i < pokemons.length; i++) {
        let p = pokemons[i];
        
        let formattedId = "#" + p.id.toString().padStart(3, '0');
        let type = p.types[0].type.name; // Zieht das Element
        let imgUrl = p.sprites.other['official-artwork'].front_default;
    
        let bgColor = TYPE_COLORS[type] || '#cccccc';   // Die Hintergrundfarbe aus unserer Palette holen (oder Grau als Rückfalll)

        let typeIconUrl = `https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${type}.svg`;

        // dieses Template später auslagern, damit es übersichtlicher wird
        grid.innerHTML += ` 
            <div class="pokemon-card" style="background-color: ${bgColor};">
                <span class="poke-id">${formattedId}</span>
                <img src="${imgUrl}" alt="${p.name}">
                <h2>${p.name}</h2>
                <div class="poke-type">
                    <img src="${typeIconUrl}" alt="${type}" title="${type}" class="type-icon">
                </div>
            </div>
        `;
    }
}