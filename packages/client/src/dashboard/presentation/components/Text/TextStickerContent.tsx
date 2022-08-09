import styled from '@emotion/styled';

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

const TextStickerContent = (props: TextProps) => {
  const { content } = props;

  return (
    <TextContent>
      <span>{content || '새로운 텍스트'}</span>
    </TextContent>
  );
};

export default TextStickerContent;
