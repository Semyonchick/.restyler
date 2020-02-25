import './style/app.scss';
// import 'babel-polyfill';
import 'regenerator-runtime/runtime';

// Uncomment for use sprite
import /* webpackChunkName: "svg" */ './js/svg-include';

// Uncomment for use vue
import vInit from './js/vue-init';

function onPageLoad () {
  // Uncomment for use app
  require('./js/app');

  // Uncomment for use vue
  vInit();

  if (!PRODUCTION) require('./js/plugins/devCloseButton');
  // if (window.BX && BX.CWindow) import(/* webpackChunkName: "bx-scroll-fix" */'./js/plugins/bxScrollFix');
}

if (document.body) onPageLoad();
else document.addEventListener('DOMContentLoaded', onPageLoad);