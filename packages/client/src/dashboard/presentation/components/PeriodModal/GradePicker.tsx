import { useState } from 'react';
import { useQuery } from '@apollo/client';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import createValueQuery from '../../../infrastructure/http/graphql/createValueQuery';

interface GradePickerProps {
  grade?: string;
  setGrade?: React.Dispatch<React.SetStateAction<string>>;
}

export default function GradePicker(props: GradePickerProps) {
  const { grade, setGrade } = props;
  const { data, loading, error } = useQuery(createValueQuery('User', 'grade'));

  if (loading) return <p>Loading...</p>;
  console.log(data.getUser);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (setGrade) setGrade((event.target as HTMLInputElement).value);
  };

  return (
    <FormControl>
      <RadioGroup value={grade} onChange={handleChange} row>
        {data.getUser.map((grade: any) => {
          return (
            <FormControlLabel
              value={grade.grade}
              control={<Radio />}
              label={grade.grade}
            />
          );
        })}
      </RadioGroup>
    </FormControl>
  );
}
