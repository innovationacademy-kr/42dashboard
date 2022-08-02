import { gql } from '@apollo/client';

export default function createModificationDataQuery(entityName: string) {
  return gql`
    query {
      getDataToModifyFromDB(sheetName: "${entityName}")
    }
  `;
}
