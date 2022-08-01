import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import TypeBox from './TypeBox';
import { SelectedLabelFilters } from './InputLabels';
import styled from '@emotion/styled';
import { StickerContentType } from '../Sticker/StickerContent.type';
import InputLabels from './InputLabels';
import InputDatasets from './InputDatasets';
import { FilterConfigType } from '../Sticker/Filter.type';
import { useMemo } from 'react';
import StepButtons from './stepper/StepButtons';
import StepHeader from './stepper/StepHeader';

const StyledDiv = styled.div`
  height: 550px;
  overflow: scroll;
`;

interface ModalDatasType {
  type: StickerContentType;
  datasets: FilterConfigType[][];
  setType: React.Dispatch<React.SetStateAction<StickerContentType>>;
  setLabels: React.Dispatch<React.SetStateAction<string[]>>;
  setFilters: React.Dispatch<React.SetStateAction<FilterConfigType[]>>;
  datasetNames: string[];
  setDatasetNames: React.Dispatch<React.SetStateAction<string[]>>;
  setDatasets: React.Dispatch<React.SetStateAction<FilterConfigType[][]>>;
  applyFiltersModal: () => void;
}

export default function StickerStepper(props: ModalDatasType) {
  const {
    type,
    setType,
    setLabels,
    setFilters,
    datasets,
    setDatasets,
    datasetNames,
    setDatasetNames,
    applyFiltersModal,
  } = props;

  const [steps, setSteps] = React.useState<string[]>(['Type 정하기!']);
  const [activeStep, setActiveStep] = React.useState(0);
  const [selectedLabels, setSelectedLabels] = React.useState<
    SelectedLabelFilters[]
  >([]);
  const [datasetFocus, setDatasetFocus] = React.useState(0);

  const handleNext = () => {
    console.log('handlenext');
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    console.log('handleback');
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const changeDatasetFocus = (i: number) => {
    return () => {
      setDatasetFocus((prev) => {
        if (prev === i) return -1;
        else return i;
      });
    };
  };

  const setLabelAndFilter = (label: string, filter: FilterConfigType) => {
    setLabels((labels: string[]) => [...labels, label]);
    setFilters((filters: FilterConfigType[]) => [...filters, filter]);
  };

  function LastStepPage() {
    return (
      <Typography sx={{ mt: 2, mb: 1 }}>
        "All steps completed - you're finished"
      </Typography>
    );
  }

  useMemo(() => {
    setSteps(() => {
      switch (type) {
        case 'pieChart':
        case 'lineChart':
        case 'barChart':
          return ['Type 정하기!', 'label 정하기!', 'dataset 정하기!'];
        case 'none':
        case 'text':
        case 'table':
        default:
          return ['Type 정하기!'];
      }
    });
  }, [type]);

  function returnStep() {
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
    } else if (activeStep === 2) {
      return (
        <InputDatasets
          datasets={datasets}
          setDatasets={setDatasets}
          datasetNames={datasetNames}
          setDatasetNames={setDatasetNames}
          focus={datasetFocus}
          changeFocusOn={changeDatasetFocus}
        />
      );
    } else {
      return null;
    }
  }
  console.log('steps: ', steps);
  console.log('activeStep: ', activeStep);
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        <StepHeader activeStep={activeStep} steps={steps} />
      </Stepper>
      {activeStep === steps.length ? <LastStepPage /> : returnStep()}
      <StepButtons
        isLastPage={activeStep === steps.length}
        activeStep={activeStep}
        handleBack={handleBack}
        handleNext={handleNext}
        applyFiltersModal={applyFiltersModal}
      />
    </Box>
  );
}
