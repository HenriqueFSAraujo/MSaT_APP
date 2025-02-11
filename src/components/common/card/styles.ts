import styled from 'styled-components';

export const Card = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.palette.bgColor.card};
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.palette.borderColor};

  display: flex;
  flex-direction: column;
  padding: 14px 18px;

  h3 {
    font-size: 18px;
    font-weight: 600;
    line-height: 17.6px;
    letter-spacing: 0.01em;
    text-align: left;
    margin-top: 8px;
    margin-bottom: 8px;
  }
`;
