window.onload = function() {
  //Se a query string não existir, mandar para a página inicial
  if (!window.location.href.includes('?')) {
    location.href = "/";
  } else {
    const streamer = window.location.href.split('?')[1];
    $.ajax({
      url: `https://api.twitch.tv/kraken/streams/${streamer}`,
      type: 'GET',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Client-ID', '3y2vfbblxxd7njgs723mfvu9rp42nj');
      },
      success: function(response) {
        //Se a stream não existir, mostrar mensagem de erro
        if (response.stream == null) {
          document.querySelector('.stream').insertAdjacentHTML('beforeend', '<div class="erro"><p>Talvez não estejas no sítio certo.<span>Este streamer não existe ou neste momento não está em direto</span></p><img src="/css/errorGif.gif"</div>');
        }
        //Se a stream existir, mostrar toda a info dela
        else {
          const streamerName = response.stream.channel.name,
            views = response.stream.viewers,
            logo = response.stream.channel.logo,
            description = response.stream.channel.status,
            game = response.stream.game;

          var templateStream = `<div>
                                  <iframe src="https://player.twitch.tv/?channel=${streamerName}"></iframe>
                                  <div class="streamInfo">
                                    <img src="${logo}">
                                    <div class="text">
                                    <p class="description">${description}<span><i class="fa fa-gamepad"></i>${game}</span></p>
                                      <p id="viewers"><i class="fa fa-user"></i><span>${views}</span></p>
                                    </div>
                                  </div>
                                </div>`;

          document.querySelector('.stream').insertAdjacentHTML('beforeend', templateStream);
        }

      },
      
      error: function(xhr, responseType, error) {
        document.querySelector('.stream').insertAdjacentHTML('beforeend', '<div class="erro"><p>Talvez não estejas no sítio certo.</p><img src="/css/errorGif.gif"</div>');
      }
    });


  }
  //Funçao corre de 20 em 20 segs
  setInterval(updateViewers, 20000);

  function updateViewers() {
    const streamer = window.location.href.split('?')[1];

    $.ajax({
      url: `https://api.twitch.tv/kraken/streams/${streamer}`,
      type: 'GET',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Client-ID', '3y2vfbblxxd7njgs723mfvu9rp42nj');
      },
      success: function(response) {
        const newViewers = response.stream.viewers;
        document.querySelector('#viewers span').innerText = newViewers;
      },
    });
  }
}
