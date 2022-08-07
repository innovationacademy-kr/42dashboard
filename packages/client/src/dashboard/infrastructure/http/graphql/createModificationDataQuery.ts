import { gql } from '@apollo/client';
import { tableName } from 'common/src';

export default function createModificationDataQuery(
  entityName: keyof typeof tableName,
  withDeleted: 'Y' | 'N',
) {
  return gql`
    query {
      getDataToModifyFromDB(sheetName: "${entityName}", withDeleted: "${withDeleted}")
    }
  `;
}
