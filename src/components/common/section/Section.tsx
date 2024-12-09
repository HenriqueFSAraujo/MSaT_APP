import { memo, ReactNode } from 'react';
import { BodySection, HeaderSection, Section } from './styles';

interface SectionConponet {
  children: ReactNode;
  header: ReactNode;
}

const SectionComponet: React.FC<SectionConponet> = ({ children, header }) => {
  return (
    <Section>
      <HeaderSection>{header}</HeaderSection>
      <BodySection>{children}</BodySection>
    </Section>
  );
};

export default memo(SectionComponet);
