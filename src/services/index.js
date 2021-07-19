import { gql } from "@apollo/client";

export const FETCH_CHORES = gql`
  query GetChores(
    $offset: Int!
    $limit: Int!
    $orderBy: ChoreOrderByInput!
    $where: ChoreWhereInput!
  ) {
    chores(orderBy: $orderBy, skip: $offset, first: $limit, where: $where) {
      completed
      title
      description
      dueDate
      createdAt
      updatedAt
      id
    }
    choresConnection(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const UPDATE_CHORE = gql`
  mutation UpdateChore($data: ChoreUpdateInput!, $id: ID!) {
    updateChore(data: $data, where: { id: $id }) {
      id
      completed
      title
      description
      dueDate
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_CHORE = gql`
  mutation CreateChore($data: ChoreCreateInput!) {
    createChore(data: $data) {
      id
      completed
      title
      description
      dueDate
      createdAt
      updatedAt
    }
  }
`;

export const PUBLISH_CHORE = gql`
  mutation PublishChore($id: ID!) {
    publishChore(where: { id: $id }, to: PUBLISHED) {
      completed
      title
      description
      dueDate
      createdAt
      id
      updatedAt
    }
  }
`;

export const DELETE_CHORE = gql`
  mutation DeleteChore($id: ID!) {
    deleteChore(where: { id: $id }) {
      completed
      title
      description
      dueDate
      createdAt
      id
      updatedAt
    }
  }
`;
