const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

async function loadMovies(searchTerm) {
    try {
        const URL = `https://www.omdbapi.com/?s=${searchTerm}&apikey=857379f2`;
        const res = await fetch(URL);
        const data = await res.json();
        
        if (data.Response === "True") {
            displayMovieList(data.Search);
        } else {
            
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function findMovies() {
    const searchTerm = movieSearchBox.value.trim();
    const hasInput = searchTerm.length > 0;
    
    searchList.classList.toggle('hide-search-list', !hasInput);
    
    if (hasInput) {
        loadMovies(searchTerm);
    }
}
function displayMovieList(movies) {
    searchList.innerHTML = "";
    movies.forEach(movie => {
        const movieListItem = document.createElement('div');
        movieListItem.dataset.id = movie.imdbID; 
        movieListItem.classList.add('search-list-item');

        const thumbnail = document.createElement('div');
        thumbnail.classList.add('search-item-thumbnail');
        const poster = movie.Poster !== "N/A" ? movie.Poster : "image_not_found.png";
        thumbnail.innerHTML = `<img src="${poster}" alt="Movie Poster">`;

        const movieInfo = document.createElement('div');
        movieInfo.classList.add('search-item-info');
        movieInfo.innerHTML = `
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
        `;

        const addToFavoritesButton = document.createElement('button');
        addToFavoritesButton.textContent = 'Add to Favorites';
        addToFavoritesButton.classList.add('add-to-favorites');
        movieListItem.appendChild(thumbnail);
        movieListItem.appendChild(movieInfo);
        movieListItem.appendChild(addToFavoritesButton);

        searchList.appendChild(movieListItem);
    });
    loadMovieDetails();
}

function loadMovieDetails() {
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = '';
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=fc1fef96`);
            const movieDetails = await result.json();
            displayMovieDetails(movieDetails);
            
            const clonedMovie = movie.cloneNode(true);
            clonedMovie.removeEventListener('click', null);
            favoriteMoviesContainer.appendChild(clonedMovie);
        });
    });
}

function displayMovieDetails(details){
    resultGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt = "movie poster">
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <ul class = "movie-misc-info">
            <li class = "year">Year: ${details.Year}</li>
            <li class = "rated">Ratings: ${details.Rated}</li>
            <li class = "released">Released: ${details.Released}</li>
        </ul>
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
    </div>
    <div class="like-icon" onclick="toggleLike(this)">
        <i class="far fa-heart"></i>
    </div>
    `;
}

window.addEventListener('click', (event) => {
    if(event.target.className != "form-control"){
        searchList.classList.add('hide-search-list');
    }
});


function toggleDarkMode() {
    const body = document.body;
    const isDarkMode = body.classList.toggle('dark-mode');

    const bottomSection = document.querySelectorAll('.favorite-controls, .favorite-movies, .liked-posters');
    bottomSection.forEach(element => {
        element.classList.toggle('dark-mode', isDarkMode);
    });

    saveDarkModePreference(isDarkMode);
}

function saveDarkModePreference(isDarkMode) {
    localStorage.setItem('darkMode', isDarkMode);
}

function applySavedDarkMode() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    const body = document.body;
    if (isDarkMode) {
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
    }
}


window.addEventListener('DOMContentLoaded', applySavedDarkMode);


const toggleViewButton = document.getElementById('toggle-view-button');
let isGridView = true; 

toggleViewButton.addEventListener('click', toggleView);

function toggleView() {
    isGridView = !isGridView;
    resultGrid.classList.toggle('list-view', !isGridView);
}

function sortMovies() {
    const sortSelect = document.getElementById('sort-movies');
    const sortBy = sortSelect.value;
    
    const movies = Array.from(document.querySelectorAll('.search-list-item'));
    const sortedMovies = movies.sort((a, b) => {
        const movieA = a.querySelector('.search-item-info h3').textContent;
        const movieB = b.querySelector('.search-item-info h3').textContent;
        
        if (sortBy === 'title') {
            return movieA.localeCompare(movieB);
        } else if (sortBy === 'year') {
            const yearA = a.querySelector('.search-item-info p').textContent;
            const yearB = b.querySelector('.search-item-info p').textContent;
            return parseInt(yearA) - parseInt(yearB);
        }
    });

    const searchList = document.getElementById('search-list');
    searchList.innerHTML = '';
    sortedMovies.forEach(movie => {
        searchList.appendChild(movie);
    });
}

function addToFavorites(movie) {
    const clonedMovie = movie.cloneNode(true);
    clonedMovie.removeEventListener('click', null); 
    favoriteMoviesContainer.appendChild(clonedMovie);
}

function loadMovieDetails() {
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = '';
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=fc1fef96`);
            const movieDetails = await result.json();
            displayMovieDetails(movieDetails);

            addToFavorites(movie);
        });
    });
}

function sortFavorites() {
    const favoriteMovies = Array.from(favoriteMoviesContainer.querySelectorAll('.search-list-item'));
    const sortedFavorites = favoriteMovies.sort((a, b) => {
        const movieA = a.querySelector('.search-item-info h3').textContent;
        const movieB = b.querySelector('.search-item-info h3').textContent;
        return movieA.localeCompare(movieB);
    });

    favoriteMoviesContainer.innerHTML = '';
    sortedFavorites.forEach(movie => {
        favoriteMoviesContainer.appendChild(movie);
    });
}

const likedMovies = [];

function toggleLike(likeIcon) {
    const movieDetails = likeIcon.parentElement;
    const movieId = movieDetails.dataset.id;

    if (!likedMovies.includes(movieId)) {
        likedMovies.push(movieId);
        likeIcon.innerHTML = '<i class="fas fa-heart"></i>'; 
    } else {
        const index = likedMovies.indexOf(movieId);
        likedMovies.splice(index, 1);
        likeIcon.innerHTML = '<i class="far fa-heart"></i>'; 
    }

}

function toggleLike(likeIcon) {
    const movieDetails = likeIcon.parentElement;
    const movieId = movieDetails.dataset.id;
    const moviePoster = movieDetails.querySelector('.movie-poster img').src; // Get the movie poster URL

    if (!likedMovies.includes(movieId)) {
        likedMovies.push(movieId);
        likeIcon.innerHTML = '<i class="fas fa-heart"></i>'; // Change icon to filled heart for liked movie
        displayLikedPoster(moviePoster); // Display the liked movie poster at the bottom
    } else {
        const index = likedMovies.indexOf(movieId);
        likedMovies.splice(index, 1);
        likeIcon.innerHTML = '<i class="far fa-heart"></i>'; // Change icon to outline heart for unliked movie
        removeLikedPoster(moviePoster); // Remove the unliked movie poster from the bottom
    }

    // You can store likedMovies array in local storage or send it to server for further processing
}

function displayLikedPoster(posterUrl) {
    const likedPosters = document.getElementById('liked-posters');
    const posterImage = document.createElement('img');
    posterImage.src = posterUrl;
    posterImage.classList.add('liked-poster-item');
    likedPosters.appendChild(posterImage);
}

function removeLikedPoster(posterUrl) {
    const likedPosters = document.getElementById('liked-posters');
    const posters = likedPosters.querySelectorAll('.liked-poster-item');
    posters.forEach(poster => {
        if (poster.src === posterUrl) {
            poster.remove();
        }
    });
}

const searchButton = document.getElementById('search-button'); // Assuming the search button has an ID of 'search-button'
searchButton.addEventListener('click', () => {
    const searchTerm = movieSearchBox.value.trim();
    if (searchTerm.length > 0) {
        loadMovies(searchTerm);
    }
});


function addToFavorites(movie) {
    const addToFavoritesButtons = document.querySelectorAll('.add-to-favorites');
    addToFavoritesButtons.forEach(button => {
        button.addEventListener('click', () => {
        });
    });
};
