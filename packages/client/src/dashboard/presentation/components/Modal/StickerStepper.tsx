import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step, { StepProps } from '@mui/material/Step';
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
import { useMemo } from 'react';
import { TextField } from '@mui/material';

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
    applyFiltersModal,
  } = props;

  const [steps, setSteps] = React.useState<string[]>([]);
  const [activeStep, setActiveStep] = React.useState(-1);
  const [selectedLabels, setSelectedLabels] = React.useState<
    SelectedLabelFilters[]
  >([]);
  const [datasetFocus, setDatasetFocus] = React.useState(0);

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

  const chartComponents = () => {
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
          focus={datasetFocus}
          changeFocusOn={changeDatasetFocus}
        />
      );
    } else {
      return null;
    }
  };
  const textComponents = () => {
    if (activeStep === 0) {
      return <TypeBox handleType={setType} />;
    } else if (activeStep === 1) {
      return <TextField placeholder="input Text" />;
    } else {
      return null;
    }
  };

  const tableComponents = () => {
    if (activeStep === 0) {
      return <TypeBox handleType={setType} />;
    } else if (activeStep === 1) {
      return <TextField placeholder="input tables" />;
    } else {
      return null;
    }
  };
  const PageComponent = () =>
    useMemo(() => {
      switch (type) {
        case 'pieChart':
        case 'lineChart':
        case 'barChart':
          return chartComponents();
        case 'text':
          return textComponents();
        case 'table':
          return tableComponents();
        default:
          return null;
      }
    }, []);

  function LastStep() {
    return (
      <>
        <Typography sx={{ mt: 2, mb: 1 }}>
          "All steps completed - you're finished"
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button onClick={applyFiltersModal}>APPLY</Button>
        </Box>
      </>
    );
  }

  useMemo(() => {
    setSteps((prev) => {
      switch (type) {
        case 'pieChart':
        case 'lineChart':
        case 'barChart':
          setActiveStep(1);
          return ['Type 정하기!', 'label 정하기!', 'dataset 정하기!'];
        case 'text':
          setActiveStep(1);
          return ['Type 정하기!', 'text 정하기!'];
        case 'table':
          setActiveStep(1);
          return ['Type 정하기!', 'filter 정하기!'];
        default:
          return [];
      }
    });
  }, [type]);
  console.log(steps);

  function returnStep() {
    if (activeStep === -1) return <TypeBox handleType={setType} />;
    return (
      <>
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
      </>
    );
  }

  function returnStepHeader() {
    if (activeStep === -1)
      return (
        <Step>
          <StepLabel>Type 정하기</StepLabel>
        </Step>
      );
    else
      return steps.map((label, index) => {
        const stepProps: StepProps = {};
        return (
          <Step key={label} {...stepProps}>
            <StepLabel>{label}</StepLabel>
          </Step>
        );
      });
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>{returnStepHeader()}</Stepper>
      {activeStep === steps.length ? <LastStep /> : returnStep()}
    </Box>
  );
}
