import { gql } from '@apollo/client';
import { tableName } from 'common/src';

export default function createSaveModifiedDataQuery(
  entityName: keyof typeof tableName,
  withDeleted: 'Y' | 'N',
) {
  return gql`
    query {
      saveModifiedDataFromSheet(sheetName: "${entityName}", withDeleted: "${withDeleted}")
    }
  `;
}
