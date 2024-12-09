import { memo, ReactNode } from 'react';
import { Card } from './styles';

interface CardProps {
  children: ReactNode;
  title?: string;
}

const CardComponet: React.FC<CardProps> = ({ children, title }) => {
  return (
    <Card>
      <h3>{title}</h3>
      {children}
    </Card>
  );
};

export default memo(CardComponet);
