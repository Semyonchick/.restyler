if (window.BX && window.BX.adminMenu) {
  let style = document.createElement('style');
  style.innerText += '.bx-context-toolbar-empty-area { min-width: 12px;}';
  style.innerText += '.bx-context-toolbar-empty-area:before { content: "";}';
  style.innerText += '#panel { position: fixed; bottom: 0; left: 0; right: 0; z-index: 10; }';
  document.body.appendChild(style);
}
