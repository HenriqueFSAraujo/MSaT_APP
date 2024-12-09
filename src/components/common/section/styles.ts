import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  width: 100%;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.palette.borderColor};
  border-radius: 6px;
`;

export const HeaderSection = styled.div`
  height: 58px;
  width: 100%;
  background-color: ${({ theme }) => theme.palette.bgColor.header};
  border-radius: 5px 5px 0 0;
`;

export const BodySection = styled.div`
  background-color: ${({ theme }) => theme.palette.bgColor.white};
  border-radius: 0 0 5px 5px;
  width: 100%;
`;
