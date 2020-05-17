import { gql } from 'apollo-server-express';

export default gql`
    extend type Query {
        donates(options: OptionQuery): [Donate]!
        donate(id: ID!): Donate!
    }

    extend type Mutation {
        createDonate(text: String!, donation: Int!, donateTo: Int!): Donate!
        deleteDonate(id: ID!): Boolean!
    }

    type Donate {
        id: ID!
        text: String!
        donation: Int!
        donate_to: LimitUser!
        donator: LimitUser!
        createdAt: Date!
    }
    extend type Subscription {
        donateCreated(id: Int): Donate
    }
`;
