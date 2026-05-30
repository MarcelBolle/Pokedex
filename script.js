const TYPE_COLORS = {
    normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C',
    grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1',
    ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
    rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705746',
    steel: '#B7B7CE', fairy: '#D685AD',
};

let currentOffset = 0;
const LIMIT = 15;
let allLoadedPokemons = [];

async function loadPokemonList() {
    document.getElementById("loader").classList.remove("hidden");
    document.getElementById("load-more-btn").classList.add("hidden");

    let pokemonList = await fetchPokemonList(`?limit=${LIMIT}&offset=${currentOffset}`);
    
    let detailPromises = [];
    for (let i = 0; i < pokemonList.length; i++) {
        let detailUrl = pokemonList[i].url;
        detailPromises.push(fetchPokemonDetails(detailUrl));
    }
    
    let detailedPokemons = await Promise.all(detailPromises);
    allLoadedPokemons = allLoadedPokemons.concat(detailedPokemons);
    
    renderPokemonCards(allLoadedPokemons);
    currentOffset += LIMIT; 

    document.getElementById("loader").classList.add("hidden");
    document.getElementById("load-more-btn").classList.remove("hidden");
}

function renderPokemonCards(pokemons) {
    let grid = document.getElementById("pokemon-grid");
    grid.innerHTML = ""; 

    for (let i = 0; i < pokemons.length; i++) {
        let p = pokemons[i];
        
        let formattedId = "#" + p.id.toString().padStart(3, '0');
        let type = p.types[0].type.name; 
        let imgUrl = p.sprites.other['official-artwork'].front_default;
        
        let bgColor = TYPE_COLORS[type] || '#cccccc'; 
        let typeIconUrl = `https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${type}.svg`;

        grid.innerHTML += `
            <div class="pokemon-card" style="background-color: ${bgColor};" onclick="openModal(${p.id})">
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

let allPokemonNames = []; 

async function initPokedex() {
    try {
        let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10000");
        let data = await response.json();
        allPokemonNames = data.results;
        
        loadPokemonList(); 
    } catch (error) {
        console.error("Fehler beim Laden der Liste", error);
    }
}

async function searchPokemon() {
    let input = document.getElementById("search-input").value.toLowerCase().trim();
    
    if (input === "") {
        resetSearch(); 
        return;
    }

    if (input.length < 3) {
        alert("Bitte gib mindestens 3 Buchstaben ein, um zu suchen!");
        return;
    }

    document.getElementById("loader").classList.remove("hidden");

    try {
        let matches = allPokemonNames.filter(poke => poke.name.includes(input));
        
        if (matches.length === 0) {
            alert("Kein Pokémon mit diesem Namen gefunden.");
            document.getElementById("loader").classList.add("hidden");
            return;
        }

        let detailPromises = [];
        for (let i = 0; i < matches.length; i++) {
            detailPromises.push(fetchPokemonDetails(matches[i].url));
        }
        
        let searchedPokemons = await Promise.all(detailPromises);
        
        renderPokemonCards(searchedPokemons);
        
        for (let i = 0; i < searchedPokemons.length; i++) {
            let poke = searchedPokemons[i];
            if (!allLoadedPokemons.find(p => p.id === poke.id)) {
                allLoadedPokemons.push(poke);
            }
        }
        
    } catch (error) {
        console.error(error);
        alert("Es gab einen Fehler bei der Suche!");
    } finally {
        document.getElementById("loader").classList.add("hidden");
    }
}
function resetSearch() {
    document.getElementById("search-input").value = "";
    renderPokemonCards(allLoadedPokemons);
}


function openModal(id) {
    let p = allLoadedPokemons.find(poke => poke.id === id);

    let modal = document.getElementById("pokemon-modal");
    let modalContent = document.getElementById("modal-content");

    let type = p.types[0].type.name;
    let bgColor = TYPE_COLORS[type] || '#cccccc';
    let imgUrl = p.sprites.other['official-artwork'].front_default;
    let formattedId = "#" + p.id.toString().padStart(3, '0');

    let height = p.height / 10;
    let weight = p.weight / 10;

    modalContent.innerHTML = `
        <div style="background-color: ${bgColor}; padding: 30px; border-radius: 20px 20px 0 0; margin: -30px -30px 20px -30px; position: relative;">
            <span class="close-btn" onclick="closeModal()">&times;</span>
            <img src="${imgUrl}" alt="${p.name}" style="width: 200px; filter: drop-shadow(0px 8px 15px rgba(0,0,0,0.4));">
        </div>
        <h2 style="text-transform: capitalize; font-size: 2.2rem; margin-bottom: 10px;">${p.name} <span style="color: #888; font-size: 1.2rem;">${formattedId}</span></h2>
        
        <div class="modal-stats">
            <p><strong>📏 Größe:</strong> ${height} m</p>
            <p><strong>⚖️ Gewicht:</strong> ${weight} kg</p>
            <p><strong>❤️ Basis-HP:</strong> ${p.stats[0].base_stat}</p>
            <p><strong>⚔️ Angriff:</strong> ${p.stats[1].base_stat}</p>
            <p><strong>🛡️ Verteidigung:</strong> ${p.stats[2].base_stat}</p>
        </div>
    `;

    modal.classList.remove("hidden");
}

function closeModal() {
    document.getElementById("pokemon-modal").classList.add("hidden");
}