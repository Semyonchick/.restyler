# ReStyler

ReStyler — переносимая система сборки фронтенда для PHP- и Bitrix-проектов. Репозиторий обычно размещается в каталоге `.restyler` внутри корня проекта, а готовые CSS, JavaScript, изображения и шрифты выводятся в каталог проекта, заданный в `build.config.js`.

## Требуемое окружение

Текущая ветка использует устаревший Webpack 4 и `node-sass` 4, поэтому для воспроизводимой сборки требуется именно legacy-окружение:

- Node.js `14.21.x`;
- npm `6.14.x`;
- рекомендуемая связка: Node.js `14.21.3` + npm `6.14.18`.

Версии зафиксированы в `package.json` и `.nvmrc`. Современный Node.js без отдельной миграции использовать нельзя: `node-sass` 4 и часть старых webpack-плагинов с ним несовместимы.

## Установка

```bash
nvm use
npm ci
```

Если lock-файл был намеренно обновлён:

```bash
npm install
```

## Команды

```bash
npm run watch   # HTTPS dev-server с live reload
npm run dev     # разовая development-сборка
npm run build   # production-сборка
npm run audit   # проверка известных уязвимостей npm
```

`npm start` является алиасом для `npm run watch`.

## Как работает сборка

1. Webpack запускается из каталога `.restyler`.
2. Точкой входа служит `src/index.js`.
3. Дополнительным entry подключается `babel-polyfill`.
4. Vue-компоненты обрабатываются через `vue-loader`.
5. SCSS проходит через `sass-loader`, `resolve-url-loader`, PostCSS, Autoprefixer и CSSNano; результат записывается в `app.css`.
6. JavaScript компилируется Babel и записывается в `app.js`; динамические чанки получают имя с хешем.
7. Файлы из `static/` копируются в корень каталога сборки.
8. Растровые изображения выводятся в `img/`, шрифты — в `fonts/`.
9. SVG из каталогов `icons` собираются через `svg-sprite-loader`.
10. Pug-шаблоны из `src/templates/page` используются для development-страниц.
11. После production-сборки выходной каталог очищается, а созданные файлы автоматически добавляются в Git родительского проекта через `simple-git`.

## Настройка проекта

Путь вывода задаётся в `build.config.js` относительно родительского каталога `.restyler`:

```js
module.exports = {
  dir: '/local/templates/example/assets'
};
```

При такой структуре:

```text
project/
├── .restyler/
│   ├── src/
│   ├── static/
│   ├── build.config.js
│   └── webpack.config.js
└── local/templates/example/assets/
```

production-сборка попадёт в:

```text
project/local/templates/example/assets/
```

`build.config.js` содержит локальный путь конкретного проекта. Его рекомендуется не переносить между проектами без проверки и не хранить в общем шаблоне с чужими параметрами.

## Development-режим

`npm run watch` поднимает HTTPS webpack-dev-server на первом свободном порту начиная с `8080`. В development-режиме Webpack отдаёт ассеты из памяти по адресу вида:

```text
https://localhost:8080/app.css
https://localhost:8080/app.js
```

Фактический порт выводится в консоль при запуске.

## Подключение к Bitrix

Пример переключения между dev-server и production-ассетами:

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

Для включения dev-режима администратор открывает сайт с параметром, соответствующим порту webpack-dev-server, например `?dev=8080`. Для отключения используется `?dev=0`.

## Production-сборка

```bash
npm ci
npm run build
```

Особенность проекта: production-сборка пишет файлы за пределы каталога `.restyler`, после чего выполняет `git add` для каталога ассетов родительского проекта. Перед запуском нужно проверить `dir` в `build.config.js`, чтобы не очистить и не изменить неверный каталог.

## Анализ bundle

Конфигурация поддерживает `BundleAnalyzerPlugin` через аргумент `test=analyze`:

```bash
npx webpack --mode production --test analyze
```

## Безопасность и технический долг

Проект основан на стеке 2019 года. Точечные обновления lock-файла закрывают отдельные advisory, но не делают весь стек современным. Полное устранение накопленных уязвимостей требует отдельной миграции как минимум на:

- актуальную LTS-версию Node.js;
- npm 10 или новее;
- Webpack 5;
- Dart Sass вместо `node-sass`;
- актуальные webpack loaders/plugins;
- Vue 3 либо поддерживаемый режим Vue 2.7, если миграция приложения пока невозможна.

До завершения такой миграции ReStyler следует считать legacy-инструментом и запускать только для доверенных исходников и зависимостей.