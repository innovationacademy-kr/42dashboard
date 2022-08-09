import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import * as axios from './../../../infrastructure/http/axios/axios.custom';
import useMode from '../../../application/services/useMode';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import RefreshIcon from '@mui/icons-material/Refresh';
import IosShareIcon from '@mui/icons-material/IosShare';
import usePreset from '../../../application/services/usePreset';
import useBoard from '../../../application/services/useBoard';

const RoundButton = styled.button`
  display: inline-block;
  justify-content: center;
  align-item: center;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  border: 0px;
  margin: 0.5rem;
  padding: 0;
  background-color: #1976d2;
  color: white;
  cursor: pointer;
  box-shadow: 0px 3px 5px -1px rgb(0 0 0 / 20%),
    0px 6px 10px 0px rgb(0 0 0 / 14%), 0px 1px 18px 0px rgb(0 0 0 / 12%);
  &:hover {
    background-color: #1565c0;
  }
  font-size: 0.7rem;
`;

const rotation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const RotateRefreshIcon = styled(RefreshIcon)`
  &.loading {
    animation: ${rotation} 1s linear infinite;
    transform-origin: 50% 50%;
  }
`;

const FooterArea = styled.footer`
  position: fixed;
  width: calc(100% - 240px);
  bottom: 0;
  background-color: #1976d2;
`;

const ButtonArea = styled.div`
  position: relative;
  float: right;
`;

function Footer() {
  const { setControlMode, getControlMode } = useMode();
  const [refetchState, setRefetchState] = React.useState('data');
  const { handleSavePreset } = useBoard();

  console.log('Footer: ');
  const mode = getControlMode();

  return (
    <FooterArea>
      {mode === 'edit' && (
        <ButtonArea>
          <RoundButton
            onClick={async () => {
              await handleSavePreset();
              setControlMode('view');
            }}
          >
            VIEW
          </RoundButton>
        </ButtonArea>
      )}
      {mode !== 'edit' && (
        <ButtonArea>
          <RoundButton
            onClick={async () => {
              setRefetchState('loading');
              await axios
                .axiosUpdateData()
                .then((data) => {
                  setRefetchState('data');
                })
                .catch((error) => {
                  setRefetchState('error');
                });
              await axios
                .axiosGetError()
                .then((data) => console.log('SUCCESS'))
                .catch((error) => {
                  // let alertMsg = '';
                  // const errorMessages = error.response.data.data;
                  // for (let i = 0; i < errorMessages.length; i += 1) {
                  //   alertMsg += `${errorMessages[i].sheet} sheet 내 ${errorMessages[i].index} 인덱스의 값이 ${errorMessages[i].value} 입니다\n${errorMessages[i].msg}\n\n`;
                  // }
                  // alert(alertMsg);
                });
            }}
          >
            <RotateRefreshIcon className={refetchState} />
          </RoundButton>
          <RoundButton onClick={() => setControlMode('fullscreen')}>
            <FullscreenIcon />
          </RoundButton>
          <RoundButton onClick={() => setControlMode('export')}>
            <IosShareIcon />
          </RoundButton>
          <RoundButton title="edit" onClick={() => setControlMode('edit')}>
            <ModeEditIcon />
          </RoundButton>
        </ButtonArea>
      )}
    </FooterArea>
  );
}

export default Footer;
