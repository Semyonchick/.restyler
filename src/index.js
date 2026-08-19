import './style/app.scss';
import {mountSprite} from './js/svg-include.js';
import {initLazyModules} from './js/lazy-modules.js';

async function start() {
  await mountSprite();
  initLazyModules();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start, {once: true});
} else {
  start();
}
