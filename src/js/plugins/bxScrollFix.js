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
}
