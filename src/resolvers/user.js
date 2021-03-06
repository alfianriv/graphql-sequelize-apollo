import jwt from 'jsonwebtoken';
import { combineResolvers } from 'graphql-resolvers';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { isAdmin } from './authorization';
import { queryHelper } from '../helper/query-helper';

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username, role } = user;
  return await jwt.sign({ id, email, username, role }, secret, {
    expiresIn,
  });
};

export default {
  Query: {
    users: async (parent, {options}, { models }) => {
      const query = queryHelper(options)

      return await models.User.findAll(query);
    },
    user: async (parent, { id }, { models }) => {
      return await models.User.findById(id);
    },
    me: async (parent, args, { models, me }) => {
      if (!me) {
        return null;
      }
      return await models.User.findByPk(me.id);
    },
  },
  Mutation: {
    signUp: async (parent, { username, email, password  }, { models, secret }) => {
      const user = await models.User.create({
        username,
        email,
        password,
      });
      return { token: createToken(user, secret, '30d') };
    },
    signIn: async (
      parent,
      { login, password },
      { models, secret },
    ) => {
      const user = await models.User.findByLogin(login);

      if (!user) {
        throw new UserInputError(
          'No user found with this login credentials.',
        );
      }

      const isValid = await validatePassword(password, user.password);

      if (!isValid) {
        throw new AuthenticationError('Invalid password.');
      }
      return { token: createToken(user, secret, '30d') };
    },
    deleteUser: combineResolvers(
      isAdmin,
      async (parent, { id }, { models }) => {
        return await models.User.destroy({
          where: { id },
        })
      }
    )
  },
  User: {
    donations: async (user, args, { models }) => {
      return await models.Donate.findAll({
        where: {
          userId: user.id
        }
      });
    },
    donator: async (user, args, {models}) => {
      return await models.Donate.findAll({
        where: {
          donateTo: user.id
        }
      })
    }
  },
}

const validatePassword = async function(password, passwordHashed) {
  return await bcrypt.compare(password, passwordHashed);
};
