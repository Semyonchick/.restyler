# .restyler
Ситема компиляции проекта с лайв релоад, БЕЗ статичских файлов.
Может подключаться к любому ПХП проекту.


## build.config.js
рекомендуем исключить этот файл из git

### подключение стилей для Bitrix
```php
if (isset($_GET['dev'])) {
    $_SESSION['DEV'] = $_GET['dev'] && is_numeric($_GET['dev']) ? 'http://localhost:' . $_GET['dev'] : false;
}
if ($USER->IsAdmin() && ($dev = $_SESSION['DEV'])) {
    \Bitrix\Main\Page\Asset::getInstance()->addCss($dev . '/app.css');
    \Bitrix\Main\Page\Asset::getInstance()->addJs($dev . '/app.js');
} else {
    \Bitrix\Main\Page\Asset::getInstance()->addCss(SITE_TEMPLATE_PATH . '/assets/app.css');
    \Bitrix\Main\Page\Asset::getInstance()->addJs(SITE_TEMPLATE_PATH . '/assets/app.js');
}
```