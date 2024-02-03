// defines the base URL for fetching Pokémon types from the PokeAPI.
const pokeTypeURL = `https://pokeapi.co/api/v2/type/`;
const typeParams = new URLSearchParams(window.location.search);
const typeSearch = typeParams.get('type'); // retrieves the value of the type


const pokedex = document.getElementById('pokedex'); // use din createPokemonCard()
const pokemonSearchForm = document.querySelector('#pokemon-search-form');
const pokemonTypeFilter = document.querySelector('.type-filter'); // will use in generateTypes()

let uniqueTypes = new Set(); // set is unique
let pokemonArray = [];



const fetchPokemon = () => {
    const promises = [];
    for (let i = 1; i <= 151; i++) {
        const pokemonURL = `https://pokeapi.co/api/v2/pokemon/${i}`;
        console.log(pokemonURL);
        promises.push(fetch(pokemonURL).then(response => response.json()))
    }
    Promise.all(promises)
        .then(allPokemon => {
            const firstGenPokemon = allPokemon.map(pokemon => ({
                frontImage: pokemon.sprites['front_default'],
                backImage: pokemon.sprites['back_default'],
                pokemon_id: pokemon.id,
                name: pokemon.name,
                type: pokemon.types[0].type.name,
                abilities: pokemon.abilities.map(ability => ability.ability.name).join(', '),
                description: pokemon.species.url
            }))
            pokemonArray = firstGenPokemon;
            console.log(firstGenPokemon);
            createPokemonCards(firstGenPokemon); // 
        })
        .then(generateTypes);
}
fetchPokemon()

// Advanced search on 'input' event

pokemonSearchForm.addEventListener('input', (event) => {
    const filterPokemon =
        pokemonArray.filter(pokemon => pokemon.name.includes(event.target.value.toLowerCase()))
    clearPokedex() // sab khali kar do
    createPokemonCards(filterPokemon) // search the desired one.
})

function clearPokedex() {
    let section = document.querySelector('#pokedex');
    section.innerHTML = ''
}

// *********









function createPokemonCards(pokemons) {
    let currentPokemon = pokemons;
    if (typeSearch) {
        currentPokemon = pokemons.filter(pokemon => pokemon.type.includes(typeSearch.toLowerCase()))
    }
    currentPokemon.forEach(pokemon => {
        createPokemonCard(pokemon)
    })
}

function createPokemonCard(pokemon) {


    // Div-1: Total card for a particular pokemon:
    const flipCard = document.createElement("div")
    flipCard.classList.add("flip-card") // dynamically giving class name "flip-card"
    pokedex.append(flipCard)


    // Div-2: ( front & back container)
    const flipCardInner = document.createElement("div")
    flipCardInner.classList.add("flip-card-inner") // class "flip-card-inner" for flip
    flipCard.append(flipCardInner) // append this flip card in the Div-1

    //********************************************************************/

    // Div-3: front of card
    const frontCard = document.createElement("div")
    frontCard.classList.add('front-pokemon-card') // dynamic CSS adding:

    // Lets see what is visible on front side: i) img ii) name iii) id iv) type
    // i) img
    const frontImage = document.createElement('img')
    frontImage.src = `${pokemon.frontImage}`
    frontImage.classList.add("front-pokemon-image")
    //  ii) name
    const frontPokeName = document.createElement('h2')
    frontPokeName.innerHTML = `<a href="/pokemon.html?pokemon_id=${pokemon.pokemon_id}">
    ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</a>`

    // iii) id
    const frontPokeID = document.createElement('p')
    frontPokeID.textContent = `#${pokemon.pokemon_id}`
    frontPokeID.classList.add("front-poke-id")
    // iv) type
    const frontPokeType = document.createElement('p')
    frontPokeType.textContent = `${pokemon.type.toUpperCase()}`
    frontPokeType.classList.add("front-pokemon-type")
    // Add all this things in front portion
    frontCard.append(frontImage, frontPokeID, frontPokeName, frontPokeType)

    // Div-4: back of card 

    // back of card i) img ii) id iii) name iv) abilities
    const backCard = document.createElement("div")
    backCard.classList.add('back-pokemon-card')
    // i) img  : 
    const backImage = document.createElement('img')
    backImage.src = `${pokemon.backImage}`
    backImage.classList.add("back-pokemon-image")
    // ii) id 
    const backPokeID = document.createElement('p')
    backPokeID.textContent = `#${pokemon.pokemon_id}`
    backPokeID.classList.add("back-poke-id")

    // iii) name
    const backPokeName = document.createElement('h2')
    backPokeName.innerHTML = `<a href="/pokemon.html?pokemon_id=${pokemon.pokemon_id}">
    ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</a>`
    backPokeName.classList.add("back-pokemon-name")
    // iv) ability
    const backPokeAbilities = document.createElement("p")
    backPokeAbilities.innerHTML = `<p>Abilities:<br>${pokemon.abilities}<p>`
    backPokeAbilities.classList.add("back-pokemon-abilities")
    // Add all this things in back portion
    backCard.append(backImage, backPokeID, backPokeName, backPokeAbilities)

    flipCardInner.append(frontCard, backCard); // added the front and back to Div-2
    uniqueTypes.add(pokemon.type); // add "type" in the set to make it unique. WHY? => see down
}

function generateTypes() {
    uniqueTypes.forEach(type => {
        const typeOption = document.createElement('option');
        typeOption.textContent = type.charAt(0).toUpperCase() + type.slice(1); // Dragon
        typeOption.value = type;

        // append it in HTML for type
        pokemonTypeFilter.append(typeOption)
    })
}
