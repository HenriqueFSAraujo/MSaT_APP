import { Button, IconButton } from '@mui/material';
import styled from 'styled-components';

const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  laptop: '1024px',
};

export const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 15px;

  @media (max-width: ${breakpoints.mobile}) {
    gap: 10px;
  }
`;

export const CardContainerRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 15px;

  @media (max-width: ${breakpoints.tablet}) {
    flex-direction: column;
    gap: 10px;
  }
`;

export const CardContainerGroup = styled.div`
  display: flex;
  width: 100%;
  gap: 15px;

  @media (max-width: ${breakpoints.tablet}) {
    flex-direction: column;
    gap: 10px;
  }
`;

export const ContainerField = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-top: 12px;

  @media (max-width: ${breakpoints.mobile}) {
    margin-top: 8px;
  }
`;

export const TitleField = styled.span`
  display: flex;
  width: 100%;
  flex-direction: column;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 14px;
  }
`;

export const ContainerValueField = styled.div`
  border: 1px solid #e0e0e0;
  background-color: #e9ecef;
  border-radius: 4px;
  padding: 7px 8px 4px 8px;
  min-height: 30.6px;
  font-weight: 600;
  line-height: 17.6px;
  letter-spacing: 0.01em;
  color: #000000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  word-break: break-word;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 12px;
    line-height: 16px;
    padding: 6px;
    height: auto;
  }

  span {
    width: 100%;
    overflow-wrap: break-word;
  }
`;

export const EditButton = styled(IconButton)`
  color: #666;
  padding: 2px !important;
  height: 17px;

  @media (max-width: ${breakpoints.mobile}) {
    padding: 4px !important;
    height: 24px;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
`;

export const ContainerValueFieldWhite = styled.div`
  background-color: transparent;
  border-radius: 4px;
  font-weight: 600;
  line-height: 17.6px;
  letter-spacing: 0.01em;
  color: #000000;
  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    border-bottom: 1px solid #e9ecef;
    padding: 7px 8px 4px 0px;
    width: 100%;
    margin-right: 10px;
    word-break: break-word;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 12px;
    line-height: 16px;

    span {
      padding: 6px 6px 4px 0px;
    }
  }
`;

export const DownloadButton = styled(Button)`
  width: 62px;
  height: 29px;
  min-width: 62px;
  padding: 0;
  box-shadow: none !important;

  .MuiSvgIcon-root {
    font-size: 20px;
  }

  @media (max-width: ${breakpoints.mobile}) {
    width: 48px;
    height: 24px;
    min-width: 48px;

    .MuiSvgIcon-root {
      font-size: 16px;
    }
  }
`;
