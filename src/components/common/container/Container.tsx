import { memo } from 'react';
import { ContainerComponet } from './styles';

interface ContainerProps {
  children: React.ReactNode;
}

const AppContainer: React.FC<ContainerProps> = ({ children }) => {
  return <ContainerComponet>{children}</ContainerComponet>;
};

export default memo(AppContainer);
