import styled from 'styled-components';

export const ContainerComponet = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 2rem;
  margin-right: 2rem;
  align-items: center;

  @media (max-width: 900px) {
    margin-left: 1rem;
    margin-right: 1rem;
  }
`;
