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
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZjc5MjRhMWU5MGU1MGMzNTVlZGYzNzk4ZTBiZjQwMCIsInN1YiI6IjY1NzI3NGRiMjExY2U1MDExYmZlY2YyMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Q4XaeeNH7quaqUxYCtRma0vhqh6js0QBiN4MQxfZY2s',
                'Accept': 'application/json',
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
    async function fetchStreamingServiceIds() {
        const streamingServiceMap = {
            netflix: null,
            amazon_prime: null,
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
                const serviceData = response.results.find(item => item.provider_name.toLowerCase() === service);
                if (serviceData) {
                    streamingServiceMap[service] = serviceData.provider_id.toString();
                }
            }
        }
        console.log('API Request URL:', 'https://api.themoviedb.org/3/watch/providers', { api_key: apiKey, region: 'US' });

        // Now, streamingServiceMap will be populated with actual TMDB streaming service IDs
        console.log('Updated Streaming Service IDs:', streamingServiceMap);

        // Call getRandomMovie() to fetch a random movie based on the selected streaming service and genre
        getRandomMovie();
    }

    function getRandomMovie() {
        const streamingService = $('#streamingService').val();
        const genre = $('#genreChoices').val();

        // Map streaming services to TMDB API endpoints
        const streamingServiceMap = {
            netflix: '8', // Replace '8' with the actual TMDB streaming service id for Netflix
            amazon_prime: '119', // Replace '119' with the actual TMDB streaming service id for Amazon Prime
            // Add more streaming services as needed
        };

        // Get the TMDB streaming service id for the selected streaming service
        const tmdbStreamingServiceId = streamingServiceMap[streamingService] || '';

        $.ajax({
            url: `https://api.themoviedb.org/3/discover/movie`,
            method: 'GET',
            data: {
                api_key: apiKey,
                with_genres: getGenreId(genre),
                with_watch_providers: tmdbStreamingServiceId, // Add streaming service parameter
            },
            success: function (data) {
                const randomIndex = Math.floor(Math.random() * data.results.length);
                const movie = data.results[randomIndex];

                // Update the HTML with movie details
                $('#movieTitle').text(`Title: ${movie.title}`);
                $('#movieGenre').text(`Genre: ${genre}`);
                $('#movieYear').text(`Year: ${movie.release_date.substring(0, 4)}`);
                $('#movieCover').html(`<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" width= "250" height= "375" alt="Movie Poster">`);
            },
            error: function (error) {
                console.error('Error fetching random movie:', error);
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
// Function to generate a random movie and update the UI for the other random movie placeholders
function generateRandomMovieForPlaceholder(placeholderNumber, genreId, streamingServiceId, genre) {
    const apiKey = '2f7924a1e90e50c355edf3798e0bf400';
    $.ajax({
        url: `https://api.themoviedb.org/3/discover/movie`,
        method: 'GET',
        data: {
            api_key: apiKey,
            with_genres: genreId,
            with_watch_providers: streamingServiceId,
        },
        success: function (data) {
            const randomIndex = Math.floor(Math.random() * data.results.length);
            const movie = data.results[randomIndex];

            // Update the HTML with movie details for the specific placeholder
            $(`#movieTitle-${placeholderNumber}`).text(`Title: ${movie.title}`);
            $(`#movieGenre-${placeholderNumber}`).text(`Genre: ${genre}`);
            $(`#movieYear-${placeholderNumber}`).text(`Year: ${movie.release_date.substring(0, 4)}`);
            // Update the movie cover for the specific placeholder
            $(`#movieCover-${placeholderNumber}`).html(`<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" width="250" height="375" alt="Movie Poster">`);
        },
        error: function (error) {
            console.error(`Error fetching random movie for placeholder ${placeholderNumber}:`, error);
        }
    });
}
    $(document).ready(function () {
        $('button').click(function () {
            // Get random movies for all four placeholders
            generateRandomMovieForPlaceholder(1, '27', '8', 'Horror');
            generateRandomMovieForPlaceholder(2, '35', '119', 'Comedy');
            generateRandomMovieForPlaceholder(3, '18', '8', 'Drama');
            generateRandomMovieForPlaceholder(4, '10749', '119', 'Romance'); // Example for the fourth placeholder
        });
    });
