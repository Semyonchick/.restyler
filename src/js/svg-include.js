function mountSprite () {
  const request = new XMLHttpRequest();

  request.open('GET', DIR + 'spritemap.svg', true);
  request.onreadystatechange = () => {
    if (request.readyState !== 4 || (request.status !== 0 && (request.status < 200 || request.status >= 300))) {
      return;
    }

    const container = document.createElement('div');
    container.setAttribute('aria-hidden', 'true');
    container.style.display = 'none';
    container.innerHTML = request.responseText;
    document.body.insertBefore(container, document.body.firstChild);
  };
  request.send();
}

if (document.body) mountSprite();
else document.addEventListener('DOMContentLoaded', mountSprite);
