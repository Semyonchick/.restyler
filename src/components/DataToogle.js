window.addEventListener('DOMContentLoaded', () => {
  Object.values(document.querySelectorAll('[data-toggle]')).forEach(el => {
    el.addEventListener('click', () => {
      let container = document.getElementById(el.dataset.toggle);
      if (container) {
        if (container.classList.contains('is-active')) {
          container.classList.remove('is-active');
          el.classList.remove('is-active');
        } else {
          container.classList.add('is-active');
          el.classList.add('is-active');
        }
      }
    });
  });
});
