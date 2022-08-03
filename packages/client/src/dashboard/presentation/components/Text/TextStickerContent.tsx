import React, { useState } from 'react';
import styled from '@emotion/styled';
import useMode from '../../../application/services/useMode';

export interface TextProps {
  content?: string;
}

const TextContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0.5rem;
`;

const TextEdit = styled.input`
  width: 100%;
  height: 100%;
`;

const TextStickerContent = (props: TextProps) => {
  const { content } = props;
  const [text, setText] = useState(content);
  const { getControlMode } = useMode();

  const handleTextEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  return (
    <TextContent>
      {getControlMode() === 'edit' ? (
        <TextEdit onChange={handleTextEdit} value={text} />
      ) : (
        <span>{text || 'EMPTY'}</span>
      )}
    </TextContent>
  );
};

export default TextStickerContent;
