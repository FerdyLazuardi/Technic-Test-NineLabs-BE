# Mock-Tes-BE
This is the REST API backend for Technical Test at Nine Fox Lab. Feel free to check the API documentation in the following link.

[API documentation](https://documenter.getpostman.com/view/26536997/2s9Y5SW5hz#9802dd06-d14f-4fde-b3f4-f5e71412d6b8)


## Authors
- [Ferdy Fadhil Lazuardi](https://github.com/FerdyLazuardi)

## Tech Stacks
Node JS, Express Js, Sequelize, PostgreSQL, Axios

## Run Locally
> [!IMPORTANT]
> You must install Node.js before running this project.

Clone the project
```
https://github.com/FerdyLazuardi/Mock-Test-BE.git
```
Go to the project directory
```
cd Mock-Test-BE
```
Install dependencies
```
npm i
```
Setup Sequelize
```
npx sequelize db:create
npx sequelize db:migrate
npx sequelize db:seed:all
```
Start The Server
```
npm run dev
```
## Environment Variables
To run this project, you will need to add the following environment variables to your .env file

`DB_USERNAME` `DB_PASSWORD` `DB_NAME` `DB_PORT` `PORT` 


