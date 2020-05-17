import { gql } from 'apollo-server-express';

export default gql`
    extend type Query {
        donates(cursor: String, limit: Int): DonateConnection!
        donate(id: ID!): Donate!
    }

    extend type Mutation {
        createDonate(text: String!, donation: Int!, donateTo: Int!): Donate!
        deleteDonate(id: ID!): Boolean!
    }
    
    type DonateConnection {
        edges: [Donate!]
        pageInfo: PageInfo!
    }
    
    type PageInfo {
        hasNextPage: Boolean!
        endCursor: String!
    }

    type Donate {
        id: ID!
        text: String!
        donation: Int!
        donate_to: User!
        user: User!
        createdAt: Date!
    }
    extend type Subscription {
        donateCreated: DonateCreated!
    }
    
    type DonateCreated {
        donate: Donate!
    }
`;
