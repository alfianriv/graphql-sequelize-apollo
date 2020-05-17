import { ForbiddenError } from 'apollo-server';
import { combineResolvers, skip } from 'graphql-resolvers';

export const isAuthenticated = (parent, args, { me }) =>
  me ? skip : new ForbiddenError('Not authenticated as a User');

export const isAdmin = combineResolvers(
  isAuthenticated,
  (parent, args, { me: { role }}) =>
    role === 'ADMIN'
      ? skip
      : new ForbiddenError('Not Authorized as Admin')
);

export const isDonateOwner = async (
  parent,
  { id },
  { models, me },
) => {
  const donate = await models.Donate.findById(id, { raw: true });

  if(!donate){
    throw new ForbiddenError('Donate not found');
  }

  if (donate.userId !== me.id) {
    throw new ForbiddenError('Not Authenticated as owner');
  }
  return skip;
};
