

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
			    "username": "root",
			    "password": "",
			    "database": "db_name",
			    "host": "127.0.0.1",
			    "operatorsAliases": false,
			    "port": 3306,
			    "dialect": "mysql"
			},
		    "secret": "secret",
		    "port": 3000
	    },
	    "test": {
		    "db": {
			    "username": "root",
			    "password": "",
			    "database": "db_name",
			    "host": "127.0.0.1",
			    "port": 3306,
			    "dialect": "mysql"
			},
			"secret": "secret",
			"port": 3000
	    },
	    "production": {
		    "db": {
			    "username": "root",
			    "password": "",
			    "database": "db_name",
			    "host": "127.0.0.1",
			    "port": 3306,
			    "dialect": "mysql"
		    },
		    "secret": "secret",
		    "port": 3000
		}
	}
	
Then run this:

    yarn run dev
or

    npm run dev
    

## Usage

Open your browser than to [localhost:3000/graphql](http://localhost:3000/graphql)
