import { ApolloClient, InMemoryCache } from "@apollo/client";

const apolloClient = new ApolloClient({
  uri: "https://api-eu-central-1.graphcms.com/v2/ckr6nzcgj0qkk01xjfghf44wb/master",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          chores: {
            keyArgs: false,
            merge(existing, incoming, { args: { offset = 0 } }) {
              let merged = [];
              if (!offset || offset === 0) {
                merged = incoming ?? [];
              } else {
                merged = existing ? existing.slice(offset) : [];
                merged.pushAll(incoming);
              }
              return merged;
            },
          },
        },
      },
    },
  }),
});

export default apolloClient;
