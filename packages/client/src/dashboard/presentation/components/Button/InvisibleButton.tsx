import styled from '@emotion/styled';

interface InvisibleButtonProps {
  buttonType: string;
  clickHandler: () => void;
}

const Button = styled.button`
  margin: 0 0.5rem;
`;

export const InvisibleButton = (props: InvisibleButtonProps) => {
  const { buttonType, clickHandler } = props;
  return <Button onClick={clickHandler}>{buttonType}</Button>;
};
