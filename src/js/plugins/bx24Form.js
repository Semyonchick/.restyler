

function addForm (id, sec, type, params = {}) {
  const script = document.createElement('script');

  script.innerHTML = `
       (function(w,d,u,b){w['Bitrix24FormObject']=b;w[b] = w[b] || function(){arguments[0].ref=u;
               (w[b].forms=w[b].forms||[]).push(arguments[0])};
               if(w[b]['forms']) return;
               var s=d.createElement('script');s.async=1;s.src=u+'?'+(1*new Date());
               var h=d.getElementsByTagName('script')[0];h.parentNode.insertBefore(s,h);
       })(window,document,'https://revitech.bitrix24.ru/bitrix/js/crm/form_loader.js','b24form');`;
  script.setAttribute('id', `bx24_form_${id}_${sec}_${type}`);
  script.setAttribute('data-skip-moving', 'true');
  document.body.appendChild(script);

  Bitrix24FormLoader.unload(params);
  Bitrix24FormLoader.showPopup(params);

  return params;
}

export default addForm;