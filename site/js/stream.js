window.onload = function() {
  if(!window.location.href.includes('?')) {
    location.href = "/";
  } else {
    var streamer = window.location.href.split('?')[1];

    $.ajax({
      //Limitando o número de streams por search para 20, fazemos com que os utilizadores não estejam com informação a mais.
      url: `https://api.twitch.tv/kraken/streams/${streamer}`,
      type: 'GET',
      //A Twitch API necessita que envie no Request Header um client id que foi gerado no momento de criação do projeto.
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Client-ID', '3y2vfbblxxd7njgs723mfvu9rp42nj');
      },
      success: function(response) {
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
      console.log(response);
      }
    });
  }
}
