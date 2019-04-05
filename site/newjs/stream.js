"use strict";

window.onload = function () {
  //Se a query string não existir, mandar para a página inicial
  if (!window.location.href.includes('?')) {
    location.href = "/";
  } else {
    var streamer = window.location.href.split('?')[1];
    $.ajax({
      url: "https://api.twitch.tv/kraken/streams/".concat(streamer),
      type: 'GET',
      beforeSend: function beforeSend(xhr) {
        xhr.setRequestHeader('Client-ID', '3y2vfbblxxd7njgs723mfvu9rp42nj');
      },
      success: function success(response) {
        //Se a stream não existir, mostrar mensagem de erro
        if (response.stream == null) {
          console.log('erro');
          $('.stream').append('<div class="erro">ERRO! ESSE STREAMER NÃO EXISTE</div>');
        } //Se a stream existir, mostrar toda a info dela
        else {
            var streamerName = response.stream.channel.name,
                views = response.stream.viewers,
                logo = response.stream.channel.logo,
                description = response.stream.channel.status;
            console.log(response);
            var templateStream = "<div>\n                                  <iframe src=\"https://player.twitch.tv/?channel=".concat(streamerName, "\"></iframe>\n                                  <div class=\"streamInfo\">\n                                    <p id=\"viewers\">Viewers: ").concat(views, "</p>\n                                    <p>Description: ").concat(description, "</p>\n                                  </div>\n                                </div>");
            $('.stream').append(templateStream);
          }
      },
      error: function error(xhr, responseType, _error) {
        $('.stream').append('<div class="erro">ERRO! Pedimos desculpa mas algo de errado não está certo</div>');
      }
    });
  } //Funçao corre de 20 em 20 segs


  setInterval(updateViewers, 20000);

  function updateViewers() {
    var streamer = window.location.href.split('?')[1];
    $.ajax({
      url: "https://api.twitch.tv/kraken/streams/".concat(streamer),
      type: 'GET',
      beforeSend: function beforeSend(xhr) {
        xhr.setRequestHeader('Client-ID', '3y2vfbblxxd7njgs723mfvu9rp42nj');
      },
      success: function success(response) {
        console.log(response);
        var newViewers = response.stream.viewers;
        $('#viewers').text('Viewers:' + newViewers);
      }
    });
  }
};