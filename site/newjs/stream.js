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
          document.querySelector('.stream').insertAdjacentHTML('beforeend', '<div class="erro"><p>Talvez não estejas no sítio certo.<span>Este streamer não existe ou neste momento não está em direto</span></p><img src="/css/errorGif.gif"</div>');
        } //Se a stream existir, mostrar toda a info dela
        else {
            var streamerName = response.stream.channel.name,
                views = response.stream.viewers,
                logo = response.stream.channel.logo,
                description = response.stream.channel.status,
                game = response.stream.game;
            var templateStream = "<div>\n                                  <iframe src=\"https://player.twitch.tv/?channel=".concat(streamerName, "\"></iframe>\n                                  <div class=\"streamInfo\">\n                                    <img src=\"").concat(logo, "\">\n                                    <div class=\"text\">\n                                    <p class=\"description\">").concat(description, "<span><i class=\"fa fa-gamepad\"></i>").concat(game, "</span></p>\n                                      <p id=\"viewers\"><i class=\"fa fa-user\"></i><span>").concat(views, "</span></p>\n                                    </div>\n                                  </div>\n                                </div>");
            document.querySelector('.stream').insertAdjacentHTML('beforeend', templateStream);
          }
      },
      error: function error(xhr, responseType, _error) {
        document.querySelector('.stream').insertAdjacentHTML('beforeend', '<div class="erro"><p>Talvez não estejas no sítio certo.</p><img src="/css/errorGif.gif"</div>');
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
        var newViewers = response.stream.viewers;
        document.querySelector('#viewers span').innerText = newViewers;
      }
    });
  }
};