import './style/app.scss'
// import './js/app'
// Uncomment for use vue
// import './js/vue-init'
// Uncomment for use sprite
// import './js/svg-include'

if (PRODUCTION) {
  window.onerror = (a, b, c, d, e) => {
    if (window.JSON) {
      for (let f = 44739652, g = {}, h = g, i = ['JSE ' + location.host, a, e && e.stack || b + ':' + c + ':' + d], j = 0; j < i.length - 1; j++) {
        let k = i[j]
        h[k] = {}, h = h[k]
      }
      h[i[j]] = 1, (new Image).src = 'https://mc.yandex.ru/watch/' + f + '/?site-info=' + encodeURIComponent(JSON.stringify(g)) + '&rn=' + Math.random()
    }
  }
} else {
  window.onerror = function (a, b, c, d, e) {
    console.log(a, b, c, d, e)
  }

  document.addEventListener('DOMContentLoaded', function () {
    const devDisable = document.createElement('div')
    devDisable.innerHTML = '&times;'
    devDisable.style = 'width:20px;' +
      'height: 39px;' +
      'background: rgba(255,235,50,0.5);' +
      'position:absolute;' +
      'z-index: 55555;' +
      'top:0;' +
      'text-align:center;' +
      'line-height:39px;' +
      'font-size:20px;' +
      'color:red;' +
      'right:0;' +
      'cursor:pointer;'
    devDisable.addEventListener('click', _ => location.href = '?dev=0')
    document.getElementsByTagName('body')[0].appendChild(devDisable)
  })
}

