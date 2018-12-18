window.addEventListener('DOMContentLoaded', () => {
  if (window.BX && window.BX.adminMenu) {
    let scrollParams = sessionStorage.getItem('scrollAfterReload');
    if (scrollParams && !window.scrollY) {
      scrollParams = JSON.parse(scrollParams);
      if (location.pathname === scrollParams.page) {
        window.scrollTo(0, scrollParams.scroll);
      }
    }
    sessionStorage.removeItem('scrollAfterReload');

    window.addEventListener('scroll', () => {
      sessionStorage.setItem('scrollAfterReload', JSON.stringify({
        page: location.pathname,
        scroll: window.scrollY
      }));
    });

    let style = document.createElement('style');
    style.innerText += '.bx-context-toolbar-empty-area { min-width: 12px;}';
    style.innerText += '.bx-context-toolbar-empty-area:before { content: "";}';
    style.innerText += '#panel { position: fixed; bottom: 0; left: 0; right: 0; z-index: 10; }';
    document.body.appendChild(style);
  }
});
