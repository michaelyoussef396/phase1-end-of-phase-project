const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

async function loadMovies(searchTerm) {
    const URL = `http://www.omdbapi.com/?s=${searchTerm}&apikey=857379f2`;
    const res = await fetch(URL);
    const data = await res.json();
    // console.log(data.Search);
    if(data.Response == "True") displayMovieList(data.Search);
}

function findMovies(){
    let SearchTerm = (movieSearchBox.value);
    console.log(searchTerm);
}

function displayMovieList(movies){

}