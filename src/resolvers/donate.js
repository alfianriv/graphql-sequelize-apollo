import { combineResolvers } from 'graphql-resolvers';
import Sequelize from 'sequelize';
import pubsub, { EVENTS } from '../subscription';
import {
  isAuthenticated,
  isDonateOwner,
} from './authorization';

const toCursorHash = string => Buffer.from(string).toString('base64');
const fromCursorHash = string =>
  Buffer.from(string, 'base64').toString('ascii');


export default {
  Query: {
    donates: async (parent, { cursor, limit = 100 }, { models }) => {
      const cursorOptions = cursor
        ? {
          where: {
            createdAt: {
              [Sequelize.Op.lt]: fromCursorHash(cursor),
            },
          },
        }
        : {};
      const donates = await models.Donate.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit + 1,
        ...cursorOptions,
      });
      // will check if there is a next page or not.
      const hasNextPage = donates.length > limit;

      const edges = hasNextPage ? donates.slice(0, -1) : donates;

      // pageInfo now has the cursor of th last message in the list.
      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor: toCursorHash(
            edges[edges.length - 1].createdAt.toString()
          ),
        },
      }
    },
  },
  Mutation: {
    createDonate: combineResolvers(
      isAuthenticated,
      async (parent, { text, donation, donateTo }, { models, me }) => {
        const donate = await models.Donate.create({
          text,
          donation:donation,
          donateTo: donateTo,
          userId: me.id,
        });

        pubsub.publish(EVENTS.DONATE.CREATED, {
          donateCreated: { donate },
        });

        return donate;
      },
    ),

    deleteDonate: combineResolvers(
      isAuthenticated,
      isDonateOwner,
      async (parent, { id }, { models }) => {
        return await models.Donate.destroy({ where: { id } });
      },
    ),
  },

  Donate: {
    user: async (donate, args, { loaders }) => {
      return await loaders.user.load(donate.userId);
    },
    donate_to: async (donate, args, { loaders }) => {
      return await loaders.user.load(donate.donateTo);
    },
  },
  Subscription: {
    donateCreated: {
      subscribe: () => pubsub.asyncIterator(EVENTS.DONATE.CREATED),
    },
  },
};
