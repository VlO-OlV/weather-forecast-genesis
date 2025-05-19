## Getting started

### .env

Example of .env file (must be created in the project root):

```
WEATHER_API_KEY=<your api key>
DATABASE_URL="postgresql://admin:qwerty12345@db:5432/weather-db?schema=public"
PORT=3030
SMTP_USER=weather.forecast.genesis@gmail.com
SMTP_PASSWORD=tfhfojqofluvvonp
SMTP_HOST=smtp.gmail.com
```

### Running locally
> Warning! When running locally you should change the DATABASE_URL in .env file

1) Install dependencies
```bash
$ yarn install
```
2) Apply migrations
```bash
$ npx prisma migrate dev
```
3) Generate prisma client
```bash
$ npx prisma generate
```
4) Start the app
```bash
$ yarn start:dev
```
### Running in Docker
```bash
$ docker-compose up --build
```
## What was done?
All main logic specified in the task was implemented
