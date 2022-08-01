import { Step, StepLabel } from '@mui/material';

export interface StickerHeaderProps {
  steps: string[];
  activeStep: number;
}

export default function StepHeader({ steps }: StickerHeaderProps): JSX.Element {
  return (
    <>
      {steps.map((label) => {
        return (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        );
      })}
    </>
  );
}
