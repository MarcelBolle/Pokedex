const BASE_URL = "https://pokeapi.co/api/v2/pokemon";

// Holt die Liste mit den Namen und URLs
async function fetchPokemonList(path = "") {
    let response = await fetch(BASE_URL + path);
    let data = await response.json();
    return data.results; 
}

// Holt die Details für ein Pokémon anhand seiner URL
async function fetchPokemonDetails(url) {
    let response = await fetch(url);
    let data = await response.json();
    return data;
}