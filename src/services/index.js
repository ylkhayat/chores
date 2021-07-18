import { gql } from "@apollo/client";

export const FETCH_CHORES = gql`
  query GetChores($offset: Int!, $limit: Int!, $orderBy: ChoreOrderByInput!) {
    chores(orderBy: $orderBy, skip: $offset, first: $limit) {
      completed
      content
      createdAt
      updatedAt
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
    updateChore(
      data: { completed: $completed, content: $content }
      where: { id: $id }
    ) {
      id
      completed
      content
      createdAt
      updatedAt
    }
    publishChore(where: { id: $id }, to: PUBLISHED) {
      completed
      content
      createdAt
      updatedAt
      id
    }
  }
`;

export const CREATE_CHORE = gql`
  mutation CreateChore($content: String!, $completed: Boolean!) {
    createChore(data: { completed: $completed, content: $content }) {
      id
      completed
      content
      createdAt
      updatedAt
    }
  }
`;

export const PUBLISH_CHORE = gql`
  mutation PublishChore($id: ID!) {
    publishChore(where: { id: $id }, to: PUBLISHED) {
      completed
      content
      createdAt
      id
      updatedAt
    }
  }
`;
