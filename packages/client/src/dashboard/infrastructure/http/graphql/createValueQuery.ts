import { gql } from '@apollo/client';

export default function createValueQuery(entityName: string, column: string) {
  return gql`
    query{
      get${entityName}(duplicated: "N", column: "${column}") {
      ${column}
    }
  }
  `;
}
