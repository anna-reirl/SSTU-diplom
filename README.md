## Интерактивная школа физики

### Требования
- Node.js
- MongoDB

### Настройка проекта

#### Устанавливаем зависимости

1. Перейти в папку **backend**, выполнить <code>npm i</code>
2. Перейти в папку **frontend**, выполнить <code>npm i</code> 

#### Проверка работоспособности

В папке **backend** выполнить <code> npm run test </code>.
Если тесты пройдены, значит все будет работать.

#### Развертывание проекта

Выполнить <code> node backend/tools/deployment/deployment.js </code>

- Будет создана учетная запись админа с логином **school_admin** и паролем **school_admin**

- Будет инициализирован учебный план

### Запуск проекта

#### Демонстрационная версия [demo]

1. Запустить API сервер:
<code>node backend/server.js</code>

2. Запустить фронтенд:
- перейти в папку **frontend**
- выполнить <code>npm run serve</code>

#### Версия для разработки [development]

1. Запустить API сервер 

**Linux, MacOS**
<code>TOKEN_KEY=123 node backend/server.js</code>

**Windows**
1. <code>set TOKEN_KEY=123</code>
2. <code>node backend/server.js</code>


<i>TOKEN_KEY=123 задает постоянный секретный ключ для JWT, в итоге после перезагрузки сервера не генерируется новый секретный ключ и пользователя не выбрасывает из учетной записи на фронтенде.</i>

2. Запустить фронтенд
- перейти в папку **frontend**
- выполнить <code>npm run serve</code>

#### Версия для развертывания в интернете [production]

1. Заполнить необходимые параметры в <code>backend/config/constants.js</code> в production_config

2. Заполнить необходимые параметры в <code>frontend/src/assets/config/constants.js</code> в production_config

3. Создать production сборку фронтенда:
- перейти в папку **frontend**
- выполнить <code>npm run build</code>

4. Запустить API сервер

**Linux, MacOS**
<code>NODE_ENV=production node backend/server.js</code> 

**Windows**
1. <code>set NODE_ENV=production</code> 
2. <code>node backend/server.js</code> 