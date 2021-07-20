import { ApolloClient, InMemoryCache } from "@apollo/client";

const apolloClient = new ApolloClient({
  uri: "https://api-eu-central-1.graphcms.com/v2/ckr6nzcgj0qkk01xjfghf44wb/master",
  cache: new InMemoryCache({
    typePolicies: {
      Chore: {
        keyFields: ["id"],
      },
    },
  }),
});

export default apolloClient;
