import { Button } from '@mui/material';
import styled from 'styled-components';

export const Container = styled.div`
  display: inline-flex;
  align-items: stretch;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
  height: 31px;
`;

export const ButtonCustom = styled(Button)`
  && {
    background-color: ${({ theme }) => theme.palette.primary.main};
    color: ${({ theme }) => theme.palette.bodyColorWhite};
    border: none;
    border-radius: 0;
    padding: 8px 16px;
    font-size: 14px;
    text-transform: none;

    &:hover {
      background-color: #e1e8ee;
      color: #333;
    }
  }
`;

export const ButtonArrow = styled(Button)`
  && {
    background-color: ${({ theme }) => theme.palette.primary.main};
    color: ${({ theme }) => theme.palette.bodyColorWhite};
    border: none;
    border-radius: 0;
    padding: 0 8px;
    min-width: auto;

    &:hover {
      background-color: #e1e8ee;
      color: #333;
    }

    svg {
      font-size: 20px;
    }
  }
`;
