document.addEventListener("DOMContentLoaded", function () {
  const transformButton = document.getElementById("btn");
  const inputText = document.getElementById("texto");
  const caixa = document.getElementById("text");
  const buttoncontainer = document.getElementById("caixaBtn");

  criarButons();

  async function criarButons() {
    try {

      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs.length > 0) {
        const activeTab = tabs[0];
        const tabInfo = {
          id: activeTab.id,
          url: activeTab.url,
        };

        const listona = await chrome.scripting.executeScript({
          target: { tabId: tabInfo.id },
          function: function () {
            const listButton = JSON.parse(localStorage.getItem('nome'));
            return listButton;

          },
        });

        if (Array.isArray(listona)) {
          listona.forEach(element => {
            if (element.result) {
              const nomeDoElemento = element.result;

              if (Array.isArray(nomeDoElemento)) {
                nomeDoElemento.forEach(element => {
                  const btnsb = document.createElement('button');
                  const nomeElementoSplit = element.Nome.split('/');
                  const motivoPausa = nomeElementoSplit[0].trim();
                  const subMotivoPausa = nomeElementoSplit[1].trim();
      
                  caixa.value += "Nome do Elemento: " + JSON.stringify(element.Nome) + "\n";
                  btnsb.value = element.Nome;
                  btnsb.textContent = element.Nome;
                  btnsb.classList.add('column-button');
                  btnsb.addEventListener('click', function () {setaPausa(motivoPausa, subMotivoPausa);});
                  buttoncontainer.appendChild(btnsb);
                })
              }
            }
          });

        } else {
          caixa.value += " | A lista não é um array.";
        }

      } else {
        caixa.value += " | Nenhuma guia ativa encontrada.";
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function setaPausa(TipoPausa, nomePausa) {
    try {

      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs.length > 0) {
        const activeTab = tabs[0];
        const tabInfo = {
          id: activeTab.id,
          url: activeTab.url,
        };

        caixa.value += TipoPausa + nomePausa

        chrome.scripting.executeScript({
          target: { tabId: tabInfo.id },
          function: async function () {
           

            //console.log(arguments[0] + arguments[1]);
            const elemnt1 = document.getElementsByClassName('ihs-navbar-item-btn ihs-user-status-view')[0];
            elemnt1.click();

          
            const filaLeft = document.getElementsByClassName('ihs-status-item');
            for (let i = 0; i < filaLeft.length; i++) {
              const valorDoElemento = filaLeft[i].innerText;
              if(arguments[0] == valorDoElemento){
                await new Promise(resolve => setTimeout(resolve, 250));
                console.log(valorDoElemento);
               filaLeft[i].click();
              }
            }
            
            const filaRigth = document.getElementsByClassName('shopee-react-radio ihs-status-sub-item');
            for (let i = 0; i < filaRigth.length; i++) {
              const valorDoElemento = filaRigth[i].innerText;
              if(arguments[1] == valorDoElemento){
                await new Promise(resolve => setTimeout(resolve, 250));
                console.log(valorDoElemento);
                filaRigth[i].click();
              }
            }
            
            const confirmaPausa = document.querySelector('.shopee-react-input__input');
            confirmaPausa.click();

          },

          args: [TipoPausa, nomePausa],
        });

        
      } else {
        caixa.value += " | Nenhuma guia ativa encontrada.";
      }
    } catch (error) {
      console.error(error);
    }
  }


});
