Function Signature of Resolvers
- 1st argument is known as the parent or root argument and always returns the previously resolved field.
- 2nd argument is the incoming arguments of a query.
- 3rd argument is known as context. This is used to inject dependencies from the outside to the resolver function.
- 4th argument is known as the info argument. This is used to get internal info about the graphQL request.

Type Relationships

Schema Stitching
Read documentation and what Link Schema does


GraphQL Authorization on a Resolver Level
We use combine resolvers / resolver middleware which comes from the package graphql-resolvers.

Let's create one in our resolver file under authorization.js

You can see we can apply this file to our message mutations by using combineResolvers.



const resolvers = {
  Query: {
    me: (parent, args, { me }) => {
      return me;
    },
    message: (parent, { id }) => {
      return messages[id];
    },
    messages: () => {
      return Object.values(messages)
    },
    user: (parent, { id }) => {
     return users[id];
    },
    users: () => {
      return Object.values(users);
    },
  },
  Mutation: {
    createMessage: (parent, { text }, { me }) => {
      const id = uuidv4();
      const message = {
        id,
        text,
        userId: me.id
      };
      messages[id] = message;
      users[me.id].messageIds.push(id);
      return message;
    },
    deleteMEssage: (parent, { id }) => {
      const { [id]: message, ...otherMessages } = messages;

      if (!message) {
        return false;
      }

      messages = otherMessages;

      return true;
    }
  },
  Message: {
    user: message => {
      return users[message.userId];
    }
  },
  User: {
    messages: user => {
      return Object.values(messages).filter(
        message => message.userId === user.id
      )
    },
  },
};
