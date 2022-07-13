import { gql } from '@apollo/client';

export default function createQuery(
  filterNames: string[],
  labels: string[],
  filterSets: string[][],
) {
  return gql`
    query GetDatasets(
      ${filterNames.map((filterName) => `$${filterName}: Filter!`).join('\n')}
    ) {
     ${filterSets
       .map((filterSet, index) => {
         const alias = `${labels[index % labels.length]}${Math.floor(
           index / labels.length,
         )}`;
         const queryName = `getNumOfPeopleByFilter`;
         const filters = `filters: [${filterSet
           .map((filterName) => `$${filterName}`)
           .join(', ')}]`;
         return `${alias}: ${queryName}(${filters})`;
       })
       .join('\n')}
      }`;
}
