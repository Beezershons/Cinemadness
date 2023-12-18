$(document).ready(function () {
const apiKey = '2f7924a1e90e50c355edf3798e0bf400';

// Set up event listener for changes in streaming service and genre
$('#streamingService, #genreChoices').change(function () {
getMovieProviders();
});

// Set up event listener for the "Randomize" button
$('button').click(function () {
    getRandomMovie();
});

function getMovieProviders() {
$.ajax({
    url: 'https://api.themoviedb.org/3/watch/providers/movie',
    method: 'GET',
    headers: {
    Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZjc5MjRhMWU5MGU1MGMzNTVlZGYzNzk4ZTBiZjQwMCIsInN1YiI6IjY1NzI3NGRiMjExY2U1MDExYmFjY2FkZjYyMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Q4XaeeNH7quaqUxYCtRma0vhqh6js0QBiN4MQxfZY2s',
    Accept: 'application/json',
    },
    data: {
    api_key: apiKey,
    language: 'en-US',
    },
    success: function (data) {
        const movieProviders = data.results;
        console.log('Movie Providers:', movieProviders);

        // Fetch streaming service IDs dynamically
        fetchStreamingServiceIds();
    },
    error: function (error) {
    console.error('Error fetching movie providers:', error);
    },
});
}

$('.randBtn').click(function () {
    fetchStreamingServiceIds();

    async function fetchStreamingServiceIds() {
    const streamingServiceMap = {
        netflix: null,
        amazon_prime: null,
        hulu: null,
        paramount_plus: null,
        disney_plus: null,
        hbo_max: null,
        // Add more streaming services as needed
    };

    for (const service in streamingServiceMap) {
    if (streamingServiceMap.hasOwnProperty(service)) {
        const response = await $.ajax({
        url: 'https://api.themoviedb.org/3/watch/providers/movie',
        method: 'GET',
        data: {
            api_key: apiKey,
            region: 'US',
        },
        dataType: 'json',
        });

        console.log('API Response:', response);

        // Find the streaming service ID from the API response
        const serviceData = response.results.find(
        (item) => item.provider_name.toLowerCase() === service
        );

        if (serviceData) {
        streamingServiceMap[service] = serviceData.provider_id.toString();
        }
    }
    }

    console.log(
        'API Request URL:',
        'https://api.themoviedb.org/3/watch/providers',
        { api_key: apiKey, region: 'US' }
    );

      // Now, streamingServiceMap will be populated with actual TMDB streaming service IDs
    console.log('Updated Streaming Service IDs:', streamingServiceMap);

      // Call getRandomMovie() to fetch a random movie based on the selected streaming service and genre
    const genreId = '';
    const streamingServiceId = '';
    const genre = '';
    console.log('streamingServiceId', streamingServiceId);
    getRandomMovie();
    generateRandomMovieForPlaceholder(1, genreId, streamingServiceId, genre);
    generateRandomMovieForPlaceholder(2, genreId, streamingServiceId, genre);
    generateRandomMovieForPlaceholder(3, genreId, streamingServiceId, genre);
    generateRandomMovieForPlaceholder(4, genreId, streamingServiceId, genre);
    }
    });
    function getRandomMovie() {
    const streamingService = $('#streamingService').val();
    const genre = $('#genreChoices').val();
    const providerName = $('#streamingService').val();

    // Map streaming services to TMDB API endpoints
    const streamingServiceMap = {
    netflix: '8',
    amazon_prime: '119',
    };

    // Get the TMDB streaming service id for the selected streaming service
    const tmdbStreamingServiceId = streamingServiceMap[streamingService] || '';

    $.ajax({
    url: `https://api.themoviedb.org/3/discover/movie?with_watch_providers=${providerName}&watch_region=usa`,
    method: 'GET',
    data: {
        api_key: apiKey,
        with_genres: getGenreId(genre),
        with_watch_providers: tmdbStreamingServiceId, // Add streaming service parameter
    },
    success: function (data) {
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const movie = data.results[randomIndex];
        console.log('Random Movie:', movie);

        const imdbId = movie.imdb_id;
        console.log('IMDb ID:', imdbId);
        const movieRating = getMovieDetailsFromOMDB(imdbId);

        // Debugging: Log the retrieved movie details
        console.log('Random Movie Details:', movie);

        // Update the HTML with movie details
        $('#movieTitle').text(`Title: ${movie.title}`);
        $('#movieGenre').text(`Genre: ${genre}`);
        $('#movieYear').text(`Year: ${movie.release_date.substring(0, 4)}`);
        $('#movieCover').html(
        `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" width= "250" height= "375" alt="Movie Poster">`
        );
    $(`#movieService`).text(`Streaming Service: ${providerName}`);

    // Debugging: Log the IMDb ID
    console.log('IMDb ID:', movie.imdb_id);

    getMovieDetailsFromOMDB(movie.imdb_id);
    },
    error: function (error) {
    console.error('Error fetching random movie:', error);
    },
});
}

function getMovieDetailsFromOMDB(imdbId) {
const omdbApiKey = '55929535';
const omdbApiUrl = `https://www.omdbapi.com/?apikey=${omdbApiKey}&i=${imdbId}`;

$.ajax({
    url: omdbApiUrl,
    method: 'GET',
    dataType: 'json',
    success: function (omdbData) {
    // Extract ratings from the OMDB API response and update your UI
    const imdbRating = omdbData.imdbRating;
    const rottenTomatoesRating = omdbData.Ratings.find(
    (rating) => rating.Source === 'Rotten Tomatoes'
    );

    // Now you can use these ratings to update your UI or perform other actions
    console.log('IMDb Rating:', imdbRating);
    console.log(
        'Rotten Tomatoes Rating:',
        rottenTomatoesRating ? rottenTomatoesRating.Value : 'N/A'
    );

    // Update UI with ratings
    $('#imdbRating').text(`IMDb Rating: ${imdbRating}`);
    $('#rottenTomatoesRating').text(
        `Rotten Tomatoes Rating: ${
        rottenTomatoesRating ? rottenTomatoesRating.Value : 'N/A'
        }`
    );
    },
    error: function (error) {
    console.error('Error fetching movie details from OMDB:', error);
    },
});
}

// Helper function to map genre names to TMDB genre ids
function getGenreId(genre) {
const genreMap = {
    Horror: 27,
    Comedy: 35,
    RomCom: 10749,
    Romance: 10749,
    Drama: 18,
    Documentary: 99,
    Thriller: 53,
    Action: 28,
};

return genreMap[genre] || '';
}
});

// Function to generate a random movie and update the UI for the other random movie placeholders
function generateRandomMovieForPlaceholder(
placeholderNumber,
genreId,
streamingServiceId,
genre
) {
const providerName = $('#streamingService').val();
const apiKey = '2f7924a1e90e50c355edf3798e0bf400';
$.ajax({
    url: `https://api.themoviedb.org/3/discover/movie?with_watch_providers=${providerName}`,
    method: 'GET',
    data: {
    api_key: apiKey,
    with_genres: genreId,
    with_watch_providers: streamingServiceId,
    },
    success: function (data) {
    console.log(data);
    const randomIndex = Math.floor(Math.random() * data.results.length);
    const movie = data.results[randomIndex];

      // Update the HTML with movie details for the specific placeholder
    $(`#movieTitle-${placeholderNumber}`).text(`Title: ${movie.title}`);
    $(`#movieGenre-${placeholderNumber}`).text(`Genre: ${genre}`);
    $(`#movieYear-${placeholderNumber}`).text(
        `Year: ${movie.release_date.substring(0, 4)}`
    );
    // Update the movie cover for the specific placeholder
    $(`#movieCover-${placeholderNumber}`).html(
    `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" width="250" height="375" alt="Movie Poster">`
    );
    $(`#streamingService-${placeholderNumber}`).text(
    `Streaming Service: ${providerName}`
    );
    },
    error: function (error) {
    console.error(
        `Error fetching random movie for placeholder ${placeholderNumber}:`,
        error
    );
    },
});
}

$(document).ready(function () {
$('button').click(function () {
    // Get random movies for all four placeholders
    generateRandomMovieForPlaceholder(1, '27', '8', 'Horror');
    generateRandomMovieForPlaceholder(2, '35', '119', 'Comedy');
    generateRandomMovieForPlaceholder(3, '18', '8', 'Drama');
    generateRandomMovieForPlaceholder(4, '10749', '119', 'Romance');
});
});
