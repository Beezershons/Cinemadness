// script.js

// It looks like we are missing the link to the jQuery library.

$(document).ready(function () {
    const apiKey = '2f7924a1e90e50c355edf3798e0bf400';
  
    $('#streamingService, #pickGenre').change(function () {
      getRandomMovie();
    });
  
    function getRandomMovie() {
      const streamingService = $('#streamingService').val();
      const genre = $('#pickGenre').val();

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
        // Should this error be a modal so the user knows there is an error? Otherwise nothing will happen on the website and the user will assume the site doesn't work.
        error: function (error) {
          console.error('Error fetching random movie:', error);
        },
      });
    }
  
    function getGenreId(genre) {
      const genreMap = {
        horror: 27,
        comedy: 35,
        romCom: 10749,
        romance: 10749,
        drama: 18,
        documentary: 99,
        thriller: 53,
        action: 28,
      };
  
      return genreMap[genre] || '';
    }
  });
  