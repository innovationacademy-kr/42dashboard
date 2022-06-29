import React from 'react';
import styled from 'styled-components';

const Title = styled.div``;

interface HeaderTitleProps {
  title: string;
}

export const HeaderTitle = (props: HeaderTitleProps) => {
  const { title } = props;
  return <Title>{title}</Title>;
};
