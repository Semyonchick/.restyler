# ReStyler

ReStyler — переносимая Webpack-сборка для существующих PHP- и Bitrix-проектов. Каталог `.restyler` хранится внутри проекта, а готовые CSS, JavaScript, изображения и шрифты выводятся в путь, заданный в `build.config.js`.

## Поддерживаемые варианты

### Актуальная ветка

- Node.js 24 LTS;
- npm 11;
- Webpack 4 с сохранением существующего API;
- Vue 2;
- Dart Sass (`sass`) вместо неподдерживаемого `node-sass`.

Vue 3 и Vite в ReStyler не добавляются: это отдельный стек для новых проектов.

### Legacy ReStyler 1.2

Исходный стек сохранён в ветке `legacy/1.2.0-node14`:

- Node.js 14.21.3;
- npm 6.14.18;
- Webpack 4;
- Vue 2.6;
- node-sass 4.

Legacy-ветка нужна только для проектов, которые пока нельзя обновить.

## Совместимость при обновлении

Миграция не должна требовать изменений в:

- `src/index.js` и существующих Vue 2 компонентах;
- `build.config.js`;
- структуре `static`, `src/templates/page`, каталогов изображений, шрифтов и SVG;
- именах выходных файлов `app.js` и `app.css`;
- PHP/Bitrix-коде подключения ассетов.

Перед заменой `.restyler` в рабочем проекте рекомендуется сохранить его текущую копию или зафиксировать commit.

## Установка

```bash
nvm use
npm install --legacy-peer-deps
```

После фиксации обновлённого `package-lock.json` установка должна выполняться через:

```bash
npm ci --legacy-peer-deps
```

## Команды

```bash
npm run watch   # HTTPS dev-server с live reload
npm run dev     # development-сборка
npm run build   # production-сборка
npm run audit   # npm audit
```

## Как работает сборка

1. Webpack запускается из `.restyler`.
2. Основная точка входа — `src/index.js`.
3. Vue 2 компоненты обрабатываются `vue-loader`.
4. SCSS проходит через Dart Sass, `resolve-url-loader`, PostCSS, Autoprefixer и CSSNano.
5. Результат сохраняется как `app.js` и `app.css`.
6. `static/` копируется в корень каталога сборки.
7. Изображения выводятся в `img/`, шрифты — в `fonts/`.
8. SVG из каталогов `icons` собираются в спрайт.
9. Pug-шаблоны из `src/templates/page` используются только для development-страниц.
10. После production-сборки выходные файлы добавляются в Git родительского проекта через `simple-git`.

## build.config.js

Путь задаётся относительно родительского каталога `.restyler`:

```js
module.exports = {
  dir: '/local/templates/example/assets'
};
```

Перед production-сборкой обязательно проверьте `dir`: каталог назначения очищается сборщиком.

## Development-режим

`npm run watch` выбирает первый свободный порт начиная с `8080` и отдаёт файлы по HTTPS:

```text
https://localhost:8080/app.css
https://localhost:8080/app.js
```

Пример подключения в Bitrix:

```php
if (isset($_GET['dev'])) {
    $_SESSION['DEV'] = $_GET['dev'] && is_numeric($_GET['dev'])
        ? 'https://localhost:' . (int) $_GET['dev']
        : false;
}

$assetPath = $USER->IsAdmin() && !empty($_SESSION['DEV'])
    ? $_SESSION['DEV']
    : SITE_TEMPLATE_PATH . '/assets';

\Bitrix\Main\Page\Asset::getInstance()->addCss($assetPath . '/app.css');
\Bitrix\Main\Page\Asset::getInstance()->addJs($assetPath . '/app.js');
```

## Порядок миграции старого проекта

1. Зафиксировать старый `.restyler` в Git.
2. Сравнить локальный `build.config.js` и не перезаписывать его чужим конфигом.
3. Обновить файлы ReStyler, сохранив проектные `src` и `static`.
4. Выполнить `npm install --legacy-peer-deps`.
5. Проверить `npm run build`.
6. Сравнить набор и имена выходных файлов.
7. Проверить `npm run watch` и подключение через `?dev=PORT`.
8. Только после проверки зафиксировать новый lock-файл.

Переход на Node.js 24 является обновлением среды сборки, но не миграцией приложения на Vue 3/Vite.
