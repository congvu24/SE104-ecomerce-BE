## 🛍️ E-Shopping backend

- 🖥  Javascript
- 💼  NodeJs, ExpressJS
- 💾  MySql
- 🌐  Restful Api
- 📦  Docker, Pm2

## Install and Deploy

First, init the database by docker. Create .env file contain after variables, replace {placeholder} with your config.

```js
DB_HOST=0.0.0.0 #you can replace with other server ip here.
DB_DATABASE={database name}
DB_USERNAME={database username}
DB_PASSWORD={database password}

EMAIL={shop email}
EMAIL_PASS={shop password}

JWT_SECRET={jwt secret key}
```

Next, make sure your server has docker and docker-compose installed and ready to run.

```sh
# start docker container
docker-compose up -d 
```

For development environments...

```sh
npm install --development
NODE_ENV=development node app
```
For production environments...

```sh
npm install --production
NODE_ENV=production
sudo pm2 start npm -- start
```
