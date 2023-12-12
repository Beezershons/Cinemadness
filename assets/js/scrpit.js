// script.js

// It looks like we are missing the link to the jQuery library.

$(document).ready(function () {
    const apiKey = '2f7924a1e90e50c355edf3798e0bf400';

    // Set up event listener for changes in streaming service and genre
    $('#streamingService, #genreChoices').change(function () {
        getRandomMovie();
    });

    // Set up event listener for the "Randomize" button
    $('button').click(function () {
        getRandomMovie();
    });

    function getRandomMovie() {
        const streamingService = $('#streamingService').val();
        const genre = $('#genreChoices').val();

      $.ajax({
        url: `https://api.themoviedb.org/3/discover/movie`,
        method: 'GET',
        data: {
          api_key: apiKey,
          with_genres: getGenreId(genre),
        },
        success: function (data) {
          const randomIndex = Math.floor(Math.random() * data.results.length);
          const movie = data.results[randomIndex];
  
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
