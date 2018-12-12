import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';
import uuidv4 from 'uuid/v4';
import { ApolloServer, gql, AuthenticationError } from 'apollo-server-express';
import models, { sequelize } from './models';
import resolvers from './resolvers';
import schema from './schema';
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());

const eraseDatabaseOnSync = true;


// authentication on a server level.
const getMe = async req => {
  const token = req.headers['x-token'];

  if (token) {
    try {
     return await jwt.verify(token, process.env.SECRET);
    } catch(e) {
      throw new AuthenticationError(
        'Your session expired, sign in again'
      );
    }
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  formatError: error => {
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '');

    return {
      ...error,
      message,
    };
  },
  context: async({ req }) => {
    const me = await getMe(req);
    return {
      models,
      me,
      secret: process.env.SECRET,
    }
  }
});

server.applyMiddleware({ app, path: '/graphql' });

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUsersWithMessages(new Date());
  }
  app.listen( {port: 8000 }, () => {
    console.log('Apollo Server on http://localhost:8000/graphql');
  });
});

const createUsersWithMessages = async date => {
  await models.User.create(
    {
      username: 'terry',
      email: 'terry@mail.com',
      password: 'password',
      role: 'ADMIN',
      messages: [
        {
          text: 'Published the School of Hard Knocks',
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
      ],
    },
    {
      include: [models.Message],
    },
  );

  await models.User.create(
    {
      username: 'jerome',
      email: 'jerome@mail.com',
      password: 'testing',
      messages: [
        {
          text: 'Happy to release ...',
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
        {
          text: 'Published a complete ...',
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
      ],
    },
    {
      include: [models.Message],
    },
  );
};
