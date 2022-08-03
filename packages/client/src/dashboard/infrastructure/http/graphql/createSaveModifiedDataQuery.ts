import { gql } from '@apollo/client';

export default function createSaveModifiedDataQuery(entityName: string) {
  return gql`
    query {
      saveModifiedDataFromSheet(sheetName: "${entityName}")
    }
  `;
}
