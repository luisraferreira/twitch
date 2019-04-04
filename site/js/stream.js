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
        }
        //Se a stream existir, mostrar toda a info dela
        else {
          var streamerName = response.stream.channel.name,
            views = response.stream.channel.views,
            logo = response.stream.channel.logo,
            description = response.stream.channel.status;

          var templateStream = `<div>
                                  <iframe src="https://player.twitch.tv/?channel=${streamerName}"></iframe>
                                  <div class="streamInfo">
                                    <p>Views: ${views}</p>
                                    <p>Description: ${description}</p>
                                  </div>
                                </div>`;

          $('.stream').append(templateStream);
        }

      },
    });
  }
}
