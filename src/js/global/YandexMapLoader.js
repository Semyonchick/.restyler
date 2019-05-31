export default function (callback) {
  let script = document.createElement('script');
  script.setAttribute('src', 'https://api-maps.yandex.ru/2.1/?lang=ru_RU');
  script.async = true;
  script.defer = true;
  script.onreadystatechange = script.onload = callback;
  document.getElementsByTagName('head')[0].appendChild(script);
};