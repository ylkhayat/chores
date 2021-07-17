import { gql } from "@apollo/client";

export const FETCH_CHORES = gql`
  query GetChores($offset: String, $limit: Int!) {
    choresConnection(after: $offset, first: $limit) {
      edges {
        cursor
        node {
          completed
          content
          createdAt
          id
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
