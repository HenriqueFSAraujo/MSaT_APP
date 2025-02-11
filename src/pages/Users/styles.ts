import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  width: 100%;
  padding-top: 50px;
  flex-direction: column;
  gap: 40px;
`;
export const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 18px;

  h2 {
    font-size: 22px;
    font-weight: 600;
    line-height: 27.65px;
    letter-spacing: 0.01em;
    text-align: left;

    @media (max-width: 768px) {
      font-size: 20px;
    }
  }
`;
