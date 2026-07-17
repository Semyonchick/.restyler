# Доверенный HTTPS для localhost

ReStyler работает в development-режиме только по HTTPS. Временный сертификат webpack-dev-server не используется: сервер запускается с постоянным сертификатом из `.cert/`.

## Windows

```powershell
choco install mkcert
npm run cert
npm run watch
```

Альтернатива Chocolatey:

```powershell
scoop install mkcert
npm run cert
npm run watch
```

`npm run cert` выполняет `mkcert -install` и создаёт:

- `.cert/localhost.pem`;
- `.cert/localhost-key.pem`.

Сертификат действителен для `localhost`, `127.0.0.1` и `::1`. Каталог `.cert/` исключён из Git.

Не копируйте локальный закрытый ключ и корневой ключ mkcert на другие машины. На каждой рабочей машине сертификат создаётся отдельно.
