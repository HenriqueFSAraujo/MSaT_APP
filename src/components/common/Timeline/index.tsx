// Timeline.tsx
import React from 'react';
import styled from 'styled-components';

// Container principal da timeline
const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  padding-left: 30px; /* Espaço para a linha e a bola */
`;

// Linha vertical cinza
const VerticalLine = styled.div<{ isLast?: boolean }>`
  position: absolute;
  top: 0;
  left: 15px; /* Centralizado na área de padding */
  width: 2px;
  height: ${(props) => (props.isLast ? '50%' : '100%')};
  background-color: #ccc;
`;

// Bola colorida
const ColoredBall = styled.div<{ type: 'sucesso' | 'falha' }>`
  position: absolute;
  left: 15px; /* Alinhado com a linha */
  width: 10px;
  height: 10px;
  background-color: ${(props) => (props.type === 'sucesso' ? '#10823F' : '#811811')};
  border-radius: 50%;
  top: 50%;
  transform: translateX(-40%) translateY(-50%);
`;

// Card da timeline
const TimelineCard = styled.div<{ type: 'sucesso' | 'falha' }>`
  background-color: ${(props) => (props.type === 'sucesso' ? '#CDE4D6' : '#ecdcdb')};
  padding: 10px 15px;
  border-radius: 5px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

// Props para o componente Timeline
interface TimelineProps {
  children: React.ReactNode;
  type: 'sucesso' | 'falha';
  isLast?: boolean;
}

const Timeline: React.FC<TimelineProps> = ({ children, type, isLast = false }) => {
  return (
    <TimelineContainer>
      <VerticalLine isLast={isLast} />
      <React.Fragment>
        <ColoredBall type={type} style={{ top: `50%` }} />
        <TimelineCard type={type} style={{ marginTop: '10px' }}>
          {children}
        </TimelineCard>
      </React.Fragment>
    </TimelineContainer>
  );
};

export default Timeline;
