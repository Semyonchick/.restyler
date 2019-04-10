window.addEventListener('DOMContentLoaded', () => {
    Object.values(document.querySelectorAll('[data-toggle]')).forEach(el => {
        el.addEventListener('click', () => {
            let menu = document.querySelectorAll(el.dataset.toggle);
            if (menu) Object.values(menu).forEach(container => {
                if (container.classList.contains('is-active')) {
                    container.classList.remove('is-active');
                    // container.classList.add('is-hidden');
                    el.classList.remove('is-active');
                } else {
                    // container.classList.remove('is-hidden');
                    container.classList.add('is-active');
                    el.classList.add('is-active');
                }
            });
        });
    });
});