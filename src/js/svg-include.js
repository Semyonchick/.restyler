export async function mountSprite() {
  if (document.querySelector('[data-restyler-sprite]')) return;

  const response = await fetch(`${DIR}spritemap.svg`);
  if (!response.ok) throw new Error(`Unable to load SVG sprite: ${response.status}`);

  const container = document.createElement('div');
  container.dataset.restylerSprite = '';
  container.hidden = true;
  container.innerHTML = await response.text();
  document.body.prepend(container);
}
