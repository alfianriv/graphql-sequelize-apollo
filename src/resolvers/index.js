import { GraphQLDateTime } from 'graphql-iso-date';
import userResolvers from './user';
import donateResolvers from './donate';

const customScalarResolver = {
  Date: GraphQLDateTime
};

export default [
  customScalarResolver,
  userResolvers,
  donateResolvers
];
