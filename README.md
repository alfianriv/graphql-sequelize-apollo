
# graphql-sequelize-apollo

Made with Nodejs, Sequelize, Apollo Server

## Install

    yarn install
or 

    npm install

## Run
Before run, create config.json in {directory}/config/config.json and edit 
like this

    {
		"development": {
		"db": {
		    "username": "alfianriv",
		    "password": "acp3000",
		    "database": "sawerin_db",
		    "host": "127.0.0.1",
		    "operatorsAliases": false,
		    "port": 3306,
		    "dialect": "mysql"
		},
	    "secret": "acp3000",
	    "port": 3000
    },
    "test": {
	    "db": {
		    "username": "alfianriv",
		    "password": "acp3000",
		    "database": "sawerin_db",
		    "host": "127.0.0.1",
		    "port": 3306,
		    "dialect": "mysql"
		},
		"secret": "acp3000",
		"port": 3000
    },
    "production": {
	    "db": {
		    "username": "alfianriv",
		    "password": "acp3000",
		    "database": "sawerin_db",
		    "host": "127.0.0.1",
		    "port": 3306,
		    "dialect": "mysql"
	    },
	    "secret": "acp3000",
	    "port": 3000
	}
	
Then run this:

    yarn run dev
or

    npm run dev
    

## Usage

Open your browser than to localhost:3000/graphql
