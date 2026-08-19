const loaders = import.meta.glob('./modules/*.js');

async function load(element) {
  if (element.dataset.moduleLoaded !== undefined) return;

  const key = `./modules/${element.dataset.module}.js`;
  const loader = loaders[key];
  if (!loader) throw new Error(`Unknown lazy module: ${element.dataset.module}`);

  element.dataset.moduleLoaded = '';
  const module = await loader();
  await module.default?.(element);
}

export function initLazyModules(root = document) {
  const elements = [...root.querySelectorAll('[data-module]')];
  const immediate = elements.filter(element => !element.hasAttribute('data-module-lazy'));
  immediate.forEach(element => load(element));

  const deferred = elements.filter(element => element.hasAttribute('data-module-lazy'));
  if (!deferred.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.filter(entry => entry.isIntersecting).forEach(entry => {
      observer.unobserve(entry.target);
      load(entry.target);
    });
  }, {rootMargin: '200px'});
  deferred.forEach(element => observer.observe(element));
}
