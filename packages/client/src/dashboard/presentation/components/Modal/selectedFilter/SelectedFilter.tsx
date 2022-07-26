import { SelectedLabelFilters } from '../Filters';

interface PropType {
  data: SelectedLabelFilters;
  deleteButton?: () => void;
}

export default function SelectedFilter(props: PropType) {
  console.log('call selected filter');
  const { label, latest, entityName, column, givenValue, operator } =
    props?.data;
  return (
    <span>{`label: ${label}, entityName: ${entityName}, column: ${column}, operator: ${operator}, givenValue: ${givenValue}, latest: ${latest})}`}</span>
  );
}
