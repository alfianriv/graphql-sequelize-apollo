import { gql } from 'apollo-server-express';

export default gql`
    input OptionQuery {
        limit: Int
        order: [OrderQuery]
        offset: Int
        where: [WhereQuery]
    }

    input WhereQuery {
        field: String!
        value: String!
    }

    input OrderQuery {
        sort: String!
        order: String!
    }
`;
