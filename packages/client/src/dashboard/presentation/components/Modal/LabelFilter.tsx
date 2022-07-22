import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import styled from '@emotion/styled';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { QueryFilterType } from './Modal';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { EntityColumn, Operator } from 'common';

type EntityColumnType = typeof EntityColumn;

const Section = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface LabelFilterProps {
  setLabels: React.Dispatch<React.SetStateAction<string[]>>;
  setFilters: React.Dispatch<React.SetStateAction<QueryFilterType[]>>;
}

function LabelFilter(props: LabelFilterProps) {
  const { setLabels, setFilters } = props;

  const [value, setValue] = React.useState('');
  const [entityName, setEntityName] = React.useState('');
  const [column, setColumn] = React.useState('');
  const [operator, setOperator] = React.useState('');
  const [givenValue, setGivenValue] = React.useState('');
  const [latest, setLatest] = React.useState(true);

  const addFilter = () => {
    const filter = { entityName, column, operator, givenValue, latest };
    setLabels((labels) => [...labels, value]);
    setFilters((filters) => [...filters, filter]);
  };

  const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  const handleEntityChange = (event: any) => {
    setEntityName(event.target.value);
  };

  const handleColumnChange = (event: any) => {
    setColumn(event.target.value);
  };

  const handleOperatorChange = (event: any) => {
    setOperator(event.target.value);
  };

  const handleGivenValueChange = (event: any) => {
    setGivenValue(event.target.value);
  };

  const handleLatestChange = (event: any) => {
    setLatest((latest) => !latest);
  };

  return (
    <Section>
      <TextField
        required
        label="라벨 이름"
        variant="standard"
        value={value}
        onChange={handleLabelChange}
      />
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="EntityName">Entity</InputLabel>
        <Select
          labelId="EntityName"
          id="EntityName"
          value={entityName}
          onChange={handleEntityChange}
          label="EntityName"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {Object.keys(EntityColumn).map((entity) => (
            <MenuItem key={entity} value={entity}>
              {entity}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="Column">Column</InputLabel>
        <Select
          labelId="Column"
          id="Column"
          value={column}
          onChange={handleColumnChange}
          label="Column"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {entityName &&
            EntityColumn[entityName as keyof EntityColumnType].map(
              (column: { spName: string; dbName: string }) => {
                console.log(column);
                return (
                  <MenuItem key={column.dbName} value={column.dbName}>
                    {column.spName}
                  </MenuItem>
                );
              },
            )}
        </Select>
      </FormControl>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="Operator">Operator</InputLabel>
        <Select
          labelId="Operator"
          id="Operator"
          value={operator}
          onChange={handleOperatorChange}
          label="Entity"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {Object.values(Operator).map((operator) => (
            <MenuItem key={operator} value={operator}>
              {operator}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="GivenValue">GivenValue</InputLabel>
        <Select
          labelId="GivenValue"
          id="GivenValue"
          value={givenValue}
          onChange={handleGivenValueChange}
          label="GivenValue"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
        </Select>
      </FormControl>
      {/* <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="Latest">Latest</InputLabel>
        <Select
          labelId="Latest"
          id="Latest"
          value={latest}
          onChange={handleLatestChange}
          label="Latest"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="true">true</MenuItem>
          <MenuItem value="false">false</MenuItem>
        </Select>
      </FormControl> */}
      <FormControlLabel
        control={<Checkbox />}
        label="Latest"
        labelPlacement="top"
        checked={latest}
        onChange={handleLatestChange}
      />
      <CheckCircleOutlineIcon
        onClick={addFilter}
        color="primary"
        fontSize="large"
      />
    </Section>
  );
}

export default LabelFilter;
