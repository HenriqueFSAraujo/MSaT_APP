import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  width: 100%;
  padding: 0px 16px 20px;
  flex-direction: column;
  gap: 40px;

  @media (max-width: 768px) {
    padding: 30px 12px;
    gap: 25px;
  }
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 18px;

  h2 {
    font-size: clamp(18px, 4vw, 22px);
    font-weight: 600;
    line-height: 1.25;
    letter-spacing: 0.01em;
    text-align: left;
  }

  @media (max-width: 768px) {
    padding-left: 12px;
  }
`;

export const CardContainerRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 15px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

export const ContainerField = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-top: 12px;

  @media (max-width: 768px) {
    margin-top: 8px;
  }
`;

export const TitleField = styled.span`
  display: flex;
  width: 100%;
  flex-direction: column;
  font-size: 14px;
  margin-bottom: 4px;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

export const CardContainerGroup = styled.div`
  display: flex;
  width: 100%;
  gap: 15px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

export const ContainerValueField = styled.div`
  border: 1px solid #e0e0e0;
  background-color: #e9ecef;
  border-radius: 4px;
  padding: 7px 8px 4px;
  min-height: 30.6px;
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: 0.01em;
  color: #000000;
  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    font-size: 14px;
    word-break: break-word;

    @media (max-width: 768px) {
      font-size: 13px;
    }
  }

  @media (max-width: 768px) {
    padding: 6px 8px;
    min-height: 28px;
  }
`;
