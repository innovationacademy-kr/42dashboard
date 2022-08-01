import { Button } from '@mui/material';
import { Box } from '@mui/system';

export interface StepButtonProps {
  isLastPage: boolean;
  activeStep: number;
  handleBack: () => void;
  handleNext: () => void;
  applyFiltersModal: () => void;
}
export default function StepButtons(props: StepButtonProps) {
  const { isLastPage, activeStep, handleBack, handleNext, applyFiltersModal } =
    props;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
      <Button
        color="inherit"
        disabled={activeStep === 0}
        onClick={handleBack}
        sx={{ mr: 1 }}
      >
        Back
      </Button>
      <Box sx={{ flex: '1 1 auto' }} />
      <Button onClick={isLastPage ? applyFiltersModal : handleNext}>
        {isLastPage ? 'Finish' : 'Next'}
      </Button>
    </Box>
  );
}
