import './scss/app.scss'
import './js/app'

let svgs = require.context('./icons', false, /\.svg$/)
console.log(svgs)

if (!PRODUCTION) {
  const liveReload = document.createElement('script')
  liveReload.setAttribute('type', 'text/javascript')
  liveReload.setAttribute('src', 'http://localhost:35729/livereload.js')
  document.getElementsByTagName('head')[0].appendChild(liveReload)
}
