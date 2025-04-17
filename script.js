$(document).ready(function () {
  $('#button-search').click(function () {
    const query = $('#search-input').val().trim();
    if (query === '') {
      alert('Masukkan nama lagu atau artis!');
      return;
    }

    $('#music-list').html('<h5 class="text-center text-info w-100">Mencari...</h5>');

    $.get(`https://api.deezer.com/search?q=${query}&output=jsonp`, function () {}, "jsonp")
      .done(function (res) {
        $('#music-list').html('');
        const data = res.data;

        if (data.length === 0) {
          $('#music-list').html('<h5 class="text-center text-danger w-100">Lagu tidak ditemukan!</h5>');
        } else {
          data.slice(0, 9).forEach(track => {
            $('#music-list').append(`
              <div class="col-md-4 mb-3">
                <div class="card">
                  <img src="${track.album.cover_medium}" class="card-img-top" alt="${track.title}">
                  <div class="card-body text-center">
                    <h5>${track.title}</h5>
                    <p>${track.artist.name}</p>
                    <audio controls class="w-100 mt-2">
                      <source src="${track.preview}" type="audio/mpeg">
                      Browser tidak mendukung audio.
                    </audio>
                    <button class="btn btn-primary mt-2 see-lyrics" 
                      data-title="${track.title}" data-artist="${track.artist.name}" 
                      data-toggle="modal" data-target="#musicDetailModal">
                      Lihat Lirik
                    </button>
                  </div>
                </div>
              </div>
            `);
          });
        }
      });
  });

  // Lihat lirik
  $('#music-list').on('click', '.see-lyrics', function () {
    const title = $(this).data('title');
    const artist = $(this).data('artist');

    $('.modal-title').text(`${title} - ${artist}`);
    $('.modal-body').html('<p>Memuat lirik...</p>');

    $.getJSON(`https://api.lyrics.ovh/v1/${artist}/${title}`)
      .done(function (res) {
        $('.modal-body').html(`<pre>${res.lyrics}</pre>`);
      })
      .fail(function () {
        $('.modal-body').html('<p class="text-danger">Lirik tidak ditemukan.</p>');
      });
  });

  // Enter untuk pencarian
  $('#search-input').keypress(function (e) {
    if (e.which === 13) $('#button-search').click();
  });
});
