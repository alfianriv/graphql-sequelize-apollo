import { combineResolvers } from 'graphql-resolvers';
import Sequelize from 'sequelize';
import pubsub from '../subscription';
import {
  isAuthenticated,
  isDonateOwner,
} from './authorization';
import { queryHelper } from '../helper/query-helper';
import { withFilter } from 'apollo-server';

export default {
  Query: {
    donates: async (parent, { options}, { models }) => {
      const query = queryHelper(options)

      return await models.Donate.findAll(query);
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

        const res = await models.Donate.findById(donate.id)

        pubsub.publish("DONATE_CREATE", {donateCreated: res});

        return res;
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
    donator: async (donate, args, { loaders }) => {
      return await loaders.user.load(donate.userId);
    },
    donate_to: async (donate, args, { loaders }) => {
      return await loaders.user.load(donate.donateTo);
    },
  },
  Subscription: {
    donateCreated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("DONATE_CREATE"),
        (payload, variables) => {
          if(payload.donateCreated.donateTo === variables.id){
            return true
          }
          return true
        }
      ),
    },
  },
};
