window.onload = function() {
  const input = document.querySelector('.search');
  const datalist = document.querySelector('datalist#searchStreams');
  //A variavel de baixo tem de ser transformada num Array visto o IE não conseguir ler o forEach para NodeLists
  const radioBtn = Array.prototype.slice.call(document.querySelectorAll('.chooseView input'), 0);
  let timeout;
  //Clean value on back
  input.value = "";

  const valueSaved = localStorage.getItem('valuePerPage');

  //Verificar se existe algum valor na localStorage, se sim seleciona o valor que tem lá para fazer a pesquisa
  //Se não retorna para o valor default que é 12
  if (valueSaved != null) {
    document.querySelector(`input[value="${valueSaved}"]`).checked = "true"
  } else {
    document.querySelector('input[value="12"]').checked = "true"
    let inputCheckedValue = document.querySelector('input:checked').value;
    localStorage.setItem('valuePerPage', inputCheckedValue);
  }

  radioBtn.forEach(function(radioInput) {
    radioInput.addEventListener('click', search);
    //radioInput.addEventListener('click', setLocalStorage);
  });
  input.addEventListener('keyup', handleInput);

  //Search incremental
  function search() {
    const inputValue = input.value;
    const inputChecked = document.querySelector(':checked').value;
    //setLocalStorage
    localStorage.setItem('valuePerPage', inputChecked);

    if (inputValue != '') {
      document.querySelector('nav').classList.add('searching');
      document.querySelector('.searchResults').style.display = "flex";
      $.ajax({
        //Aqui o resultado da procura vai depender do que o utilizador tenha escrito no input e do que tenha selecionado nos radiobuttons.
        url: `https://api.twitch.tv/kraken/search/streams?q=${inputValue}&limit=${inputChecked}`,
        type: 'GET',
        //A Twitch API necessita que envie no Request Header um client id que foi gerado no momento de criação do projeto.
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Client-ID', '3y2vfbblxxd7njgs723mfvu9rp42nj');
        },
        success: function(response) {
          cleanDOM();
          populatePage(response);
        }
      });
    } else {
      cleanDOM();
      document.querySelector('.searchResults').style.display = "none"
    }

  }

  function populatePage(response) {
    const inputValue = input.value;
    const streams = response.streams;
    if (streams.length > 0) {
      streams.forEach(function(stream) {
        const streamPreview = stream.preview.medium,
          streamGame = stream.game,
          streamName = stream.channel.name,
          link = stream._links.self,
          logo = stream.channel.logo,
          status = stream.channel.status;

        //Templating para popular a página com cada streamer que venha no serviço
        const template = `<li class="streamer" data-link="${streamName}">
                          <img src="${streamPreview}">
                          <div class="bottom">
                          <img src="${logo}">
                          <div class="text">
                          <p>${status}</p>
                          <p>${streamName}</p>
                          </div>
                          </div>

                        </li>`;
        document.querySelector('.searchResults').insertAdjacentHTML('beforeend', template);

      });
      //Criar o "Ver mais"
      const nextPage = response._links.next,
        prevPage = response._links.prev;

      const nextTemplate = `<button data-page="${nextPage}" class="pagination">Next</button>`;
      const prevTemplate = `<button data-page="${prevPage}" class="pagination">Prev</button>`;
      if (nextPage && response._total > 12 /*&& streams.length == 12*/) {
        document.querySelector('.seeMore').insertAdjacentHTML('beforeend', nextTemplate);
      }
      if (prevPage) {
        document.querySelector('.seeMore').insertAdjacentHTML('afterbegin', prevTemplate);

      }
      //Event listener para depois de serem criadas os botões da paginação
      const paginationButtons = Array.prototype.slice.call(document.querySelectorAll('.pagination'), 0);
      paginationButtons.forEach(function(button) {
        button.addEventListener('click', seeOthers);
      });

      //Event listener para depois de serem criadas as <li> com os streamers e abrir numa nova página a stream
      const personStreaming = Array.prototype.slice.call(document.querySelectorAll('li.streamer'), 0);
      personStreaming.forEach(function(person) {
        person.addEventListener('click', getStream);
      });
    } else {
      const errorTemplate = `<div class="error">Pedimos desculpa mas não existem resultados para a pesquisa "${inputValue}".</div>`;
      document.querySelector('.searchResults').insertAdjacentHTML('afterbegin', errorTemplate);

    }
  }

  function handleInput() {
    //Esta função serve para a API da twitch não ser chamada a cada input do utilizador na pesquisa,
    //conseguimos assim limitar esta chamada a ser feita 0.4s após o utilizador ter acabado de escrever.
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      search();
    }, 400);

  }

  function getStream(el) {
    const streamerLink = el.currentTarget.dataset.link;
    location.href = "stream.html?" + streamerLink;
  }

  function cleanDOM() {
    //Apagar as mensagens de erro
    if (document.querySelector('.error')) {
      document.querySelector('.error').parentNode.removeChild(document.querySelector('.error'));
    }
    //Apagar todos os streamers do DOM para a seguir repopular com a nova info do serviço.
    const streamer = Array.prototype.slice.call(document.querySelectorAll('.streamer'), 0);
    streamer.forEach(function(person) {
      person.parentNode.removeChild(person);
    });
    //Apagar os botões de paginação da página
    const paginationButtons = Array.prototype.slice.call(document.querySelectorAll('.pagination'), 0);
    paginationButtons.forEach(function(btn) {
      btn.parentNode.removeChild(btn);
    })


  }

  function seeOthers(el) {
    const paging = el.currentTarget.dataset.page;
    $.ajax({
      //Aqui o resultado da procura vai depender do que o utilizador tenha escrito no input e do que tenha selecionado nos radiobuttons.
      url: paging,
      type: 'GET',
      //A Twitch API necessita que envie no Request um client id que foi gerado no momento de criação do projeto.
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Client-ID', '3y2vfbblxxd7njgs723mfvu9rp42nj');
      },
      success: function(response) {
        cleanDOM();
        populatePage(response);
      },
      error: function(xhr, error, responseType) {
        console.log(xhr, error, responseType);
      }
    });
  }

}
