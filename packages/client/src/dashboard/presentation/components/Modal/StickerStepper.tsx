import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import TypeBox from './TypeBox';
import { SelectedLabelFilters } from './InputLabels';
import { StickerContentType } from '../Sticker/StickerContent.type';
import InputLabels from './InputLabels';
import InputDatasets from './InputDatasets';
import { FilterConfigType } from '../Sticker/Filter.type';
import { useMemo } from 'react';
import StepButtons from './stepper/StepButtons';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

interface ModalDatasType {
  type: StickerContentType;
  setType: React.Dispatch<React.SetStateAction<StickerContentType>>;
  chartProps: {
    labels: string[];
    setLabels: React.Dispatch<React.SetStateAction<string[]>>;
    filters: FilterConfigType[];
    setFilters: React.Dispatch<React.SetStateAction<FilterConfigType[]>>;
    datasets: FilterConfigType[][];
    setDatasets: React.Dispatch<React.SetStateAction<FilterConfigType[][]>>;
    datasetNames: string[];
    setDatasetNames: React.Dispatch<React.SetStateAction<string[]>>;
  };
  applyFiltersModal: () => void;
  reset: boolean;
  setReset: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function StickerStepper(props: ModalDatasType) {
  const { type, setType, chartProps, applyFiltersModal, reset, setReset } =
    props;
  const {
    labels,
    setLabels,
    filters,
    setFilters,
    datasets,
    setDatasets,
    datasetNames,
    setDatasetNames,
  } = chartProps;

  const [steps, setSteps] = React.useState<string[]>(['Type 정하기!']);
  const [activeStep, setActiveStep] = React.useState(0);
  const [selectedLabels, setSelectedLabels] = React.useState<
    SelectedLabelFilters[]
  >([]);
  const [datasetFocus, setDatasetFocus] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
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
        case 'bachelor':
        default:
          return ['Type 정하기!'];
      }
    });
  }, [type]);

  function returnStep() {
    if (activeStep === 0 || reset === true) {
      setReset(false);
      return <TypeBox handleType={setType} />;
    } else if (activeStep === 1) {
      return (
        <InputLabels
          setLabelAndFilter={setLabelAndFilter}
          selectedLabels={selectedLabels}
          setSelectedLabels={setSelectedLabels}
          chartProps={chartProps}
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
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => {
          const stepProps: { completed?: boolean } = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
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
