import './DataToggle'
// import 'swiper/dist/css/swiper.min.css';
// import Swiper from 'swiper';

function mainShow() {
    document.querySelectorAll('main').forEach(row => {
        row.style.display = row.id == location.hash.replace('#', '') ? 'block' : 'none'
    })
    window.scrollTo(0, 0);
}

