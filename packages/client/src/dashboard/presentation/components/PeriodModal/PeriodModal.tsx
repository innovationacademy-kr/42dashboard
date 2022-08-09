import Box from '@mui/material/Box';
import styled from '@emotion/styled';
import Modal from '@mui/material/Modal';
import DatePicker from './DatePicker';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import GradePicker from './GradePicker';
import { PeriodFilterType } from '../../../domain/sectionDatas/sectionData.type';
import { useState } from 'react';
import { ReactComponent as IconFilter } from '../../../../assets/icons/filter-solid.svg';

const Button = styled.button`
  background-color: none;
  border: 0;
  outline: 0;
  cursor: pointer;
  background-color: transparent;
  &:hover {
    background-color: lightgrey;
  }
`;

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  justifyContent: 'center',
  boxShadow: 24,
  p: 4,
};

interface PeriodProps {
  setStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setEndDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setGrade: React.Dispatch<React.SetStateAction<string | undefined>>;
  periodFilter: PeriodFilterType;
}

export default function PeriodModal(props: PeriodProps) {
  const {
    periodFilter: { startDate, endDate, grade },
    setStartDate,
    setEndDate,
    setGrade,
  } = props;

  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>('Period');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        style={{ position: 'absolute', right: '2rem' }}
      >
        <IconFilter style={{ width: '1rem' }} />
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <FormControl>
            <FormLabel id="demo-controlled-radio-buttons-group">
              기간 필터
            </FormLabel>
            <RadioGroup value={value} onChange={handleChange} row>
              <FormControlLabel
                value="Period"
                control={<Radio />}
                label="날짜"
              />
              <FormControlLabel
                value="Grade"
                control={<Radio />}
                label="기수"
              />
            </RadioGroup>
          </FormControl>
          {value === 'Period' && (
            <>
              <DatePicker
                startDate={startDate ? new Date(startDate) : new Date()}
                setStartDate={setStartDate}
                endDate={endDate ? new Date(endDate) : new Date()}
                setEndDate={setEndDate}
              />
              <Button
                onClick={() => {
                  setGrade(undefined);
                  handleClose();
                  console.log(`startDate: `, startDate, `endDate: `, endDate);
                }}
              >
                Save
              </Button>
            </>
          )}
          {value === 'Grade' && (
            <>
              <GradePicker grade={grade} setGrade={setGrade} />
              <Button
                onClick={() => {
                  setStartDate(undefined);
                  setEndDate(undefined);
                  handleClose();
                }}
              >
                Save
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}
