window.onload = function() {
  var input = document.querySelector('.search');
  var datalist = document.querySelector('datalist#searchStreams')
  var radioBtn = $('.chooseStuff input');
  var timeout;
  radioBtn.on('click', search);
  input.addEventListener('keyup', handleInput);

  //Search incremental
  function search() {
    var inputValue = input.value;
    var inputChecked = $('.chooseStuff').find('input:checked').val();
    if (inputValue != '') {
      $.ajax({
        //Limitando o número de streams por search para 20, fazemos com que os utilizadores não estejam com informação a mais.
        url: `https://api.twitch.tv/kraken/search/streams?q=${inputValue}&limit=${inputChecked}`,
        type: 'GET',
        //A Twitch API necessita que envie no Request Header um client id que foi gerado no momento de criação do projeto.
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Client-ID', '3y2vfbblxxd7njgs723mfvu9rp42nj');
        },
        success: function(response) {
          $('.streamer').remove();
          $('.searchList').show();
          var streams = response.streams;

          streams.forEach(function(stream) {
            var streamPreview = stream.preview.medium,
              streamGame = stream.game,
              streamName = stream.channel.name;

            var template = `<li class="streamer">
                              <img src="${streamPreview}">
                              <p>A jogar:${streamGame}</p>
                              <p>Nome: ${streamName}</p>
                            </li>`;

            $('.searchList').append(template);

          })
          console.log(response);
        }
      });
    } else {
      $('.streamer').remove();
      $('.searchList').hide();
    }

  }
  function handleInput() {
    clearTimeout(timeout);

    timeout = setTimeout(function () {
      search();
    }, 1000);

  }
}
