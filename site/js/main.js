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
              streamName = stream.channel.name,
              link = stream._links.self;

            var template = `<li class="streamer" data-link="${streamName}">
                              <img src="${streamPreview}">
                              <div class="text">
                              <p>A jogar: <span>${streamGame}</span></p>
                              <p>Nome: <span>${streamName}</span></p>
                              </div>
                            </li>`;

            $('.searchList').append(template);

          });

          $('.streamer').on('click', getStream);
        }
      });
    } else {
      $('.streamer').remove();
      $('.searchList').hide();

    }

  }

  function handleInput() {
    clearTimeout(timeout);

    timeout = setTimeout(function() {
      search();
    }, 1000);

  }

  function getStream() {
    var streamerLink = $(this).data('link');
    console.log(streamerLink);

    location.href = "stream.html?" + streamerLink
    // $.ajax({
    //   //Limitando o número de streams por search para 20, fazemos com que os utilizadores não estejam com informação a mais.
    //   url: streamerLink,
    //   type: 'GET',
    //   //A Twitch API necessita que envie no Request Header um client id que foi gerado no momento de criação do projeto.
    //   beforeSend: function(xhr) {
    //     xhr.setRequestHeader('Client-ID', '3y2vfbblxxd7njgs723mfvu9rp42nj');
    //   },
    //   success: function(response) {
    //   console.log(response);
    //   }
    // });
  }
}
