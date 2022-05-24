import { GraphQLClient } from 'graphql-request'

const endpoint = 'http://localhost:3333/graphql';
const gqlRequest = new GraphQLClient(endpoint);

export default gqlRequest;
