import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TypeBox from './TypeBox';
import { SelectedLabelFilters } from './InputLabels';
import styled from '@emotion/styled';
import { StickerContentType } from '../Sticker/StickerContent.type';
import InputLabels from './InputLabels';
import InputDatasets from './InputDatasets';
import { FilterConfigType } from '../Sticker/Filter.type';

const steps = ['Type 정하기!', 'label 정하기!', 'dataset 정하기!'];

const StyledDiv = styled.div`
  height: 550px;
  overflow: scroll;
`;

interface ModalDatasType {
  dataSets: FilterConfigType[][];
  setType: React.Dispatch<React.SetStateAction<StickerContentType>>;
  setLabels: React.Dispatch<React.SetStateAction<string[]>>;
  setFilters: React.Dispatch<React.SetStateAction<FilterConfigType[]>>;
  setDataSets: React.Dispatch<React.SetStateAction<FilterConfigType[][]>>;
  applyFiltersModal: () => void;
}

export default function StickerStepper(props: ModalDatasType) {
  const {
    setType,
    setLabels,
    setFilters,
    dataSets,
    setDataSets,
    applyFiltersModal,
  } = props;
  const [activeStep, setActiveStep] = React.useState(0);
  const [selectedLabels, setSelectedLabels] = React.useState<
    SelectedLabelFilters[]
  >([]);
  const [datasetExpand, setDatasetExpand] = React.useState(0);

  const handleNext = () => {
    if (activeStep === steps.length) {
      setActiveStep(0);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const changeDatasetFocus = (i: number) => {
    return () => {
      setDatasetExpand((prev) => {
        if (prev === i) return -1;
        else return i;
      });
    };
  };

  const setLabelAndFilter = (label: string, filter: FilterConfigType) => {
    setLabels((labels: string[]) => [...labels, label]);
    setFilters((filters: FilterConfigType[]) => [...filters, filter]);
  };

  function PageComponent() {
    if (activeStep === 0) {
      return <TypeBox handleType={setType} />;
    } else if (activeStep === 1) {
      return (
        <InputLabels
          setLabelAndFilter={setLabelAndFilter}
          selectedLabels={selectedLabels}
          setSelectedLabels={setSelectedLabels}
        />
      );
    } else {
      return (
        <InputDatasets
          dataSets={dataSets}
          setDataSets={setDataSets}
          focus={datasetExpand}
          onChange={changeDatasetFocus}
        />
      );
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          return (
            <Step key={label} {...stepProps}>
              {/* <StepLabel {...labelProps}>{label}</StepLabel> */}
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={applyFiltersModal}>APPLY</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <StyledDiv>
            <PageComponent />
          </StyledDiv>
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
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}
