const BASE_URL = "https://pokeapi.co/api/v2/pokemon";

async function fetchData(path = "") {
    let response = await fetch(BASE_URL + path);
    let responseAsJson = await response.json();
    return responseAsJson;
}

function loadPokemonList() {
    console.log("test");
    fetchData("?limit=15");     // Hier übergeben wir nur noch den Rest des Pfades (die Parameter)

}