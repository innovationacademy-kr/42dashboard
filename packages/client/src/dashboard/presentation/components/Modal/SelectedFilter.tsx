import { SelectedLabelFilters } from './InputLabels';

interface PropType {
  idx: number;
  data: SelectedLabelFilters;
  deleteButton?: () => void;
}

export default function SelectedFilter(props: PropType) {
  console.log('call selected filter');

  const {
    idx,
    data: { label, latest, entityName, column, givenValue, operator },
  } = props;
  return (
    <span
      key={idx}
    >{`label: ${label}, entityName: ${entityName}, column: ${column}, operator: ${operator}, givenValue: ${givenValue}, latest: ${latest})}`}</span>
  );
}
