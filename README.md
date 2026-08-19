# ReStyler 2

Быстрая переносимая сборка фронтенд-ассетов для PHP- и Bitrix-проектов. В основе — Vite 8, нативные ES-модули, Dart Sass и встроенная генерация оптимизированного SVG-спрайта.

## Требования

- Node.js 24 LTS;
- Yarn 4 через Corepack.

```bash
corepack enable
yarn install --immutable
```

## Команды

```bash
yarn dev          # быстрый dev-server с HMR
yarn build        # production-сборка
yarn build:watch  # инкрементальная production-сборка
yarn preview      # просмотр production-сборки
yarn cert         # локальный HTTPS-сертификат через mkcert
yarn check        # проверочная сборка без очистки каталога назначения
```

Если в `.cert/` уже есть `localhost.pem` и `localhost-key.pem`, dev-server автоматически запускается по HTTPS. Без сертификата используется HTTP.

## Структура

```text
src/
  icons/             SVG для общего spritemap.svg
  js/
    modules/         модули для динамической загрузки
    lazy-modules.js  загрузчик data-module
  style/             SCSS-модули
  index.js           единая точка входа
static/              файлы, копируемые без обработки
build.config.js      путь production-сборки
vite.config.mjs      конфигурация сборщика
```

## JavaScript-модули и lazy load

Обычные модули подключаются стандартным `import`. Для разделения кода создайте файл `src/js/modules/catalog.js` с экспортом функции по умолчанию:

```js
export default function initCatalog(element) {
  // Инициализация блока.
}
```

И добавьте блок в разметку:

```html
<section data-module="catalog" data-module-lazy></section>
```

`data-module-lazy` загружает отдельный JS-чанк при приближении блока к viewport. Без этого атрибута модуль загружается сразу после готовности DOM.

## SCSS

Точка входа — `src/style/app.scss`. Используйте современную модульную систему Sass:

```scss
@use 'variables' as *;
@use 'components/header';
```

## SVG

Все файлы из `src/icons/*.svg` автоматически оптимизируются и объединяются в `spritemap.svg`. Имя файла становится `id` символа:

```html
<svg aria-hidden="true"><use href="#logo"></use></svg>
```

Спрайт загружается один раз и встраивается в начало `body`.

## Bitrix и PHP

Production-файлы сохраняют совместимые имена `app.js` и `app.css`. Каталог задаётся относительно родителя `.restyler`:

```js
module.exports = {
  dir: '/local/templates/example/assets'
};
```

В dev-режиме также доступны `/app.js` и `/app.css`, поэтому существующее подключение ассетов можно сохранить. Vite автоматически добавляет HMR через `/app.js`.

Production-сборка создаёт:

```text
app.js
app.css
spritemap.svg
chunks/*.js
assets/*
```

## Релизы

- `release/1.4` — сохранённая Webpack/Vue 2 версия;
- `release/2.0` — Vite-версия без runtime-фреймворков и полифиллов.
