import cors from 'cors';
import express from 'express';
import http from 'http';
import jwt from 'jsonwebtoken';
import uuidv4 from 'uuid/v4';
import { ApolloServer, gql, AuthenticationError } from 'apollo-server-express';
import DataLoader from 'dataloader';
import models, { sequelize } from './models';
import resolvers from './resolvers';
import schema from './schema';
import loaders from './loaders';
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
  introspection: true,
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
  context: async({ req, connection }) => {
    if (connection) {
      return {
        models,
        loaders: {
          user: new DataLoader(keys =>
            loaders.user.batchUsers(keys, models),
          ),
        },
      };
    }
    if (req) {
      const me = await getMe(req);
      return {
        models,
        me,
        secret: process.env.SECRET,
        loaders: {
          user: new DataLoader(keys => loaders.user.batchUsers(keys, models)),
        },
      };
    }
  }
});

server.applyMiddleware({ app, path: '/graphql' });

// what we wrapped our app in to set up the Apollo Server Subscription.
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const isProduction = !!process.env.DATABASE_URL;
const port = process.env.PORT || 8000;

sequelize.sync({ force: isProduction }).then(async () => {
  if (isProduction) {
    createUsersWithMessages(new Date());
  }
  httpServer.listen({ port }, () => {
    console.log(`Apollo Server on http://localhost:${port}/graphql`);
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
