# .restyler
Ситема компиляции проекта с лайв релоад, БЕЗ статичских файлов.
Может подключаться к любому ПХП проекту.


## build.config.js
рекомендуем исключить этот файл из git

### подключение стилей для Bitrix
```php
if (isset($_GET['dev'])) $_SESSION['DEV'] = $_GET['dev'] && is_numeric($_GET['dev']) ? 'http://localhost:' . $_GET['dev'] : false;
$path = $USER->IsAdmin() && $_SESSION['DEV'] ? $_SESSION['DEV'] : SITE_TEMPLATE_PATH . '/assets';

\Bitrix\Main\Page\Asset::getInstance()->addCss($path . '/app.css');
\Bitrix\Main\Page\Asset::getInstance()->addJs($path . '/app.js');
```