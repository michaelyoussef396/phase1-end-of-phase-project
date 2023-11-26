const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

async function loadMovies(searchTerm) {
    const URL = `http://www.omdbapi.com/?s=${searchTerm}&apikey=857379f2`;
    const res = await fetch(URL);
    const data = await res.json();
    // console.log(data.Search);
    if (data.Response == "True") {
        displayMovieList(data.Search);
    }
}

function findMovies() {
    let searchTerm = (movieSearchBox.value).trim(); 
    if (searchTerm.length > 0) {
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

function displayMovieList(movies){
    searchList.innerHTML = "";
    for(let idx = 0; idx < movies.length; idx++){
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in  data-id
        movieListItem.classList.add('search-list-item');
        if(movies[idx].Poster != "N/A")
            moviePoster = movies[idx].Poster;
        else 
            moviePoster = "https://artsmidnorthcoast.com/wp-content/uploads/2014/05/no-image-available-icon-6-300x188.png";

        movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
        `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

function loadMovieDetails() {
    const searchList = document.getElementById('yourSearchListId');
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            console.log(movie.dataset.id);
        });
    });
}