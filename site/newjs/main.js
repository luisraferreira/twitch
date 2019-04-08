"use strict";

window.onload = function () {
  var input = document.querySelector('.search');
  var datalist = document.querySelector('datalist#searchStreams'); //A variavel de baixo tem de ser transformada num Array visto o IE não conseguir ler o forEach para NodeLists

  var radioBtn = Array.prototype.slice.call(document.querySelectorAll('.chooseView input'), 0);
  var timeout; //Clean value on back

  input.value = "";
  var valueSaved = localStorage.getItem('valuePerPage'); //Verificar se existe algum valor na localStorage, se sim seleciona o valor que tem lá para fazer a pesquisa
  //Se não retorna para o valor default que é 12

  if (valueSaved != null) {
    document.querySelector("input[value=\"".concat(valueSaved, "\"]")).checked = "true";
  } else {
    document.querySelector('input[value="12"]').checked = "true";
    var inputCheckedValue = document.querySelector('input:checked').value;
    localStorage.setItem('valuePerPage', inputCheckedValue);
  }

  radioBtn.forEach(function (radioInput) {
    radioInput.addEventListener('click', search); //radioInput.addEventListener('click', setLocalStorage);
  });
  input.addEventListener('keyup', handleInput); //Search incremental

  function search() {
    var inputValue = input.value;
    var inputChecked = document.querySelector(':checked').value; //setLocalStorage

    localStorage.setItem('valuePerPage', inputChecked);

    if (inputValue != '') {
      document.querySelector('nav').classList.add('searching');
      document.querySelector('.searchList').style.display = "block";
      document.querySelector('.searchResults').style.display = "flex";
      $.ajax({
        //Aqui o resultado da procura vai depender do que o utilizador tenha escrito no input e do que tenha selecionado nos radiobuttons.
        url: "https://api.twitch.tv/kraken/search/streams?q=".concat(inputValue, "&limit=").concat(inputChecked),
        type: 'GET',
        //A Twitch API necessita que envie no Request Header um client id que foi gerado no momento de criação do projeto.
        beforeSend: function beforeSend(xhr) {
          xhr.setRequestHeader('Client-ID', '3y2vfbblxxd7njgs723mfvu9rp42nj');
          cleanDOM();
          document.querySelector('.loading').style.display = "block";
        },
        complete: function complete() {
          document.querySelector('.loading').style.display = "none";
        },
        success: function success(response) {
          cleanDOM();
          populatePage(response);
        },
        error: function error(xhr, responseType) {
          var errorTemplate = "<div class=\"error\">Pedimos desculpa mas houve um problema com o servidor\".</div>";
          document.querySelector('.searchResults').insertAdjacentHTML('afterbegin', errorTemplate);
        }
      });
    } else {
      cleanDOM();
      document.querySelector('.searchResults').style.display = "none";
    }
  }

  function populatePage(response) {
    var inputValue = input.value;
    var streams = response.streams;

    if (streams.length > 0) {
      streams.forEach(function (stream) {
        var streamPreview = stream.preview.medium,
            streamGame = stream.game,
            streamName = stream.channel.name,
            link = stream._links.self,
            logo = stream.channel.logo,
            status = stream.channel.status; //Templating para popular a página com cada streamer que venha no serviço

        var template = "<li class=\"streamer\" data-link=\"".concat(streamName, "\">\n                          <img src=\"").concat(streamPreview, "\">\n                          <div class=\"bottom\">\n                          <img src=\"").concat(logo, "\">\n                          <div class=\"text\">\n                          <p>").concat(status, "</p>\n                          <p>").concat(streamName, "</p>\n                          </div>\n                          </div>\n\n                        </li>");
        document.querySelector('.searchResults').insertAdjacentHTML('beforeend', template);
      }); //Criar o "Ver mais"

      var nextPage = response._links.next,
          prevPage = response._links.prev;
      var nextTemplate = "<button data-page=\"".concat(nextPage, "\" class=\"pagination\">Next</button>");
      var prevTemplate = "<button data-page=\"".concat(prevPage, "\" class=\"pagination\">Prev</button>");

      if (nextPage && response._total > 12
      /*&& streams.length == 12*/
      ) {
          document.querySelector('.seeMore').insertAdjacentHTML('beforeend', nextTemplate);
        }

      if (prevPage) {
        document.querySelector('.seeMore').insertAdjacentHTML('afterbegin', prevTemplate);
      } //Event listener para depois de serem criadas os botões da paginação


      var paginationButtons = Array.prototype.slice.call(document.querySelectorAll('.pagination'), 0);
      paginationButtons.forEach(function (button) {
        button.addEventListener('click', seeOthers);
      }); //Event listener para depois de serem criadas as <li> com os streamers e abrir numa nova página a stream

      var personStreaming = Array.prototype.slice.call(document.querySelectorAll('li.streamer'), 0);
      personStreaming.forEach(function (person) {
        person.addEventListener('click', getStream);
      });
    } else {
      var errorTemplate = "<div class=\"error\">Pedimos desculpa mas n\xE3o existem resultados para a pesquisa \"".concat(inputValue, "\".</div>");
      document.querySelector('.searchResults').insertAdjacentHTML('afterbegin', errorTemplate);
    }
  }

  function handleInput() {
    //Esta função serve para a API da twitch não ser chamada a cada input do utilizador na pesquisa,
    //conseguimos assim limitar esta chamada a ser feita 0.4s após o utilizador ter acabado de escrever.
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      search();
    }, 400);
  }

  function getStream(el) {
    var streamerLink = el.currentTarget.dataset.link;
    location.href = "stream.html?" + streamerLink;
  }

  function cleanDOM() {
    //Apagar as mensagens de erro
    if (document.querySelector('.error')) {
      document.querySelector('.error').parentNode.removeChild(document.querySelector('.error'));
    } //Apagar todos os streamers do DOM para a seguir repopular com a nova info do serviço.


    var streamer = Array.prototype.slice.call(document.querySelectorAll('.streamer'), 0);
    streamer.forEach(function (person) {
      person.parentNode.removeChild(person);
    }); //Apagar os botões de paginação da página

    var paginationButtons = Array.prototype.slice.call(document.querySelectorAll('.pagination'), 0);
    paginationButtons.forEach(function (btn) {
      btn.parentNode.removeChild(btn);
    });
  }

  function seeOthers(el) {
    var paging = el.currentTarget.dataset.page;
    $.ajax({
      //Aqui o resultado da procura vai depender do que o utilizador tenha escrito no input e do que tenha selecionado nos radiobuttons.
      url: paging,
      type: 'GET',
      //A Twitch API necessita que envie no Request um client id que foi gerado no momento de criação do projeto.
      beforeSend: function beforeSend(xhr) {
        xhr.setRequestHeader('Client-ID', '3y2vfbblxxd7njgs723mfvu9rp42nj');
        cleanDOM();
        document.querySelector('.loading').style.display = "block";
      },
      complete: function complete() {
        document.querySelector('.loading').style.display = "none";
      },
      success: function success(response) {
        populatePage(response);
      },
      error: function error(xhr, _error, responseType) {
        var errorTemplate = "<div class=\"error\">Pedimos desculpa mas houve um problema com o servidor\".</div>";
        document.querySelector('.searchResults').insertAdjacentHTML('afterbegin', errorTemplate);
      }
    });
  }
};