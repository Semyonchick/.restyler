for (let el of document.querySelectorAll('[data-toggle]')) {
  el.addEventListener('click', () => {
    const activeClass = 'is-active';

    const container = document.getElementById(el.dataset.toggle);
    if (container) {
      if (container.classList.contains(activeClass)) {
        container.classList.remove(activeClass);
        el.classList.remove(activeClass);
      } else {
        container.classList.add(activeClass);
        el.classList.add(activeClass);
      }
    }
  });
}