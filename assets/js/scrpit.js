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
            data: {
                api_key: apiKey,
            },
            success: function (data) {
                // Assuming data.results is an array of movie providers
                const movieProviders = data.results;

                // Update your UI or perform actions based on available movie providers
                console.log('Movie Providers:', movieProviders);

                // Call getRandomMovie() to fetch a random movie based on the selected streaming service and genre
                getRandomMovie();
            },
            error: function (error) {
                console.error('Error fetching movie providers:', error);
            },
        });
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
                $('#movieCover').html(`<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="Movie Poster">`);
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
