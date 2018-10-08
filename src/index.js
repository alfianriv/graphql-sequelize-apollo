import cors from 'cors';
import express from 'express';
import uuidv4 from 'uuid/v4';
import { ApolloServer, gql } from 'apollo-server-express';
import models, { sequelize } from './models';
import resolvers from './resolvers';
import schema from './schema';

const app = express();
app.use(cors());

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    models,
    me: models.users[1],
  }
});

server.applyMiddleware({ app, path: '/graphql' });

sequelize.sync().then(async () => {
  app.listen( {port: 8000 }, () => {
    console.log('Apollo Server on http://localhost:8000/graphql');
  });
});