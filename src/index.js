import './scss/app.scss'
import './js/app'

// Uncomment for use sprite
// require.context('./icons', false, /\.svg$/)
// let ajax = new XMLHttpRequest();
// ajax.open("GET", 'DIR/sprite.svg', true);
// ajax.send();
// ajax.onload = function (e) {
//   let div = document.createElement("div");
//   div.innerHTML = ajax.responseText;
//   div.classList.add('spriteContainer');
//   div.style.display = 'none';
//   document.body.insertBefore(div, document.body.childNodes[0]);
// }

if (!PRODUCTION) {
  const liveReload = document.createElement('script')
  liveReload.setAttribute('type', 'text/javascript')
  liveReload.setAttribute('src', 'http://localhost:35729/livereload.js')
  document.getElementsByTagName('head')[0].appendChild(liveReload)
}
