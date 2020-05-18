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
import dotenv from 'dotenv'

const config = dotenv.config().parsed

const app = express();
app.use(cors());

const eraseDatabaseOnSync = true;

const getMe = async req => {
  const token = req.headers['x-token'];

  if (token) {
    try {
     return await jwt.verify(token, config.SECRET);
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
        secret: config.SECRET,
        loaders: {
          user: new DataLoader(keys => loaders.user.batchUsers(keys, models)),
        },
      };
    }
  }
});

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const isProduction = !!(process.env.NODE_ENV == "production");
const port = config.PORT || 3000;

sequelize.sync({ force: isProduction }).then(async () => {
  httpServer.listen({ port }, () => {
    console.log(`Apollo Server on http://localhost:${port}/graphql`);
  });
});
