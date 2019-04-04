window.onload = function() {

  //Se a query string não existir, mandar para a página inicial
  if (!window.location.href.includes('?')) {
    location.href = "/";
  } else {
    var streamer = window.location.href.split('?')[1];
    $.ajax({
      url: `https://api.twitch.tv/kraken/streams/${streamer}`,
      type: 'GET',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Client-ID', '3y2vfbblxxd7njgs723mfvu9rp42nj');
      },
      success: function(response) {
        //Se a stream não existir, mostrar mensagem de erro
        if (response.stream == null) {
          console.log('erro');
          $('.stream').append('<div class="erro">ERRO! ESSE STREAMER NÃO EXISTE</div>')
        }
        //Se a stream existir, mostrar toda a info dela
        else {
          var streamerName = response.stream.channel.name,
            views = response.stream.viewers,
            logo = response.stream.channel.logo,
            description = response.stream.channel.status;
            console.log(response);

          var templateStream = `<div>
                                  <iframe src="https://player.twitch.tv/?channel=${streamerName}"></iframe>
                                  <div class="streamInfo">
                                    <p id="viewers">Viewers: ${views}</p>
                                    <p>Description: ${description}</p>
                                  </div>
                                </div>`;

          $('.stream').append(templateStream);
        }

      },
      error: function(xhr, responseType, error) {
        $('.stream').append('<div class="erro">ERRO! Pedimos desculpa mas algo de errado não está certo</div>')        
      }
    });


  }
  //Funçao corre de 20 em 20 segs
  setInterval(updateViewers, 20000);

  function updateViewers() {
    var streamer = window.location.href.split('?')[1];

    $.ajax({
      url: `https://api.twitch.tv/kraken/streams/${streamer}`,
      type: 'GET',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Client-ID', '3y2vfbblxxd7njgs723mfvu9rp42nj');
      },
      success: function(response) {
        console.log(response);
        var newViewers = response.stream.viewers;

        $('#viewers').text('Viewers:' + newViewers)
      },
    });
  }
}
