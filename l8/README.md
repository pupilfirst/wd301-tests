# Automated test for L6

## Run the tests

### Preparing the API service

First we have to clone the API service repo to our local system.

```sh
git clone git@github.com:pupilfirst/wd301-api.git
```

Then inside the project folder, we have to install all npm modules

```sh
npm install
```

Once that is done, next will create our database and then we will migrate our tables

```sh
npx sequelize-cli db:create
npx sequelize-cli db:migrate
```

Next, we've to create a `.env` file in project folder to define the port number there

```sh
echo PORT=3001 > .env
```

Now we are all set to start our server

```sh
npm run start
```

### Preparing the React app

First we have to clone the React app from student's repo and then install the npm modules

```sh
npm install
```

Next, we have to create a `.env` file in project folder to define the API service URL

```sh
echo VITE_API_ENDPOINT="http://localhost:3001" > .env
```

### Launch the react app

```sh
npm start -- --port 3000
```

### Run the test suite

Next, we will run the Cypress test suite

```sh
npx cypress run --env STUDENT_SUBMISSION_URL="http://localhost:3000/"
```
