import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import styled from '@emotion/styled';
import Modal from '@mui/material/Modal';
import DatePicker from './DatePicker';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import GradePicker from './GradePicker';

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
  startDate: Date;
  setStartDate: React.Dispatch<React.SetStateAction<Date>>;
  endDate: Date;
  setEndDate: React.Dispatch<React.SetStateAction<Date>>;
  setIsChecked: React.Dispatch<React.SetStateAction<string>>;
  grade?: string;
  setGrade?: React.Dispatch<React.SetStateAction<string>>;
}

export default function PeriodModal(props: PeriodProps) {
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    setIsChecked,
    grade,
    setGrade,
  } = props;
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('Period');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  return (
    <div>
      <Button onClick={handleOpen}>Set Period</Button>
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
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
              />
              <Button
                onClick={() => {
                  setIsChecked('Date');
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
                  setIsChecked('Grade');
                  handleClose();
                }}
              >
                Save
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
}
