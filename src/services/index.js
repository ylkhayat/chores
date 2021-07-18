import { gql } from "@apollo/client";

export const FETCH_CHORES = gql`
  query GetChores($offset: Int!, $limit: Int!, $orderBy: ChoreOrderByInput!) {
    chores(orderBy: $orderBy, skip: $offset, first: $limit) {
      completed
      content
      createdAt
      id
    }
    choresConnection {
      aggregate {
        count
      }
    }
  }
`;

export const UPDATE_CHORE = gql`
  mutation UpdateChore($content: String, $completed: Boolean!, $id: ID!) {
    __typename
    updateChore(
      data: { completed: $completed, content: $content }
      where: { id: $id }
    ) {
      completed
      content
      createdAt
      id
    }
  }
`;
