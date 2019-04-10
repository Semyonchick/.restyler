function mainShow() {
    document.querySelectorAll('main').forEach(row => {
        row.style.display = row.id == location.hash.replace('#', '') ? 'block' : 'none'
    });
    window.scrollTo(0, 0);
}