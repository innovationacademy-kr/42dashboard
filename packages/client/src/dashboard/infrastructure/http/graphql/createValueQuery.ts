import { gql } from '@apollo/client';

export default function createValueQuery(entityName: string, column: string) {
  const query = `
    query{
      get${entityName}(duplicated: "N", column: "${column}") {
      ${column}
    }
  }
  `;
  return gql(query);
}
