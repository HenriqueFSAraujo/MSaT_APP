// src/pages/Users/index.tsx
import React, { memo, useState } from 'react';
import { Container, Title } from './styles';
import Section from '@/components/common/section/Section';
import Filter from './components/filter/Filter';
import CustomTable from './components/table/ConstomTable';
import { UserFilters } from '@/services/userService';

const Users: React.FC = () => {
  const [filters, setFilters] = useState<UserFilters>({});

  const handleFilterApply = (newFilters: UserFilters) => {
    setFilters(newFilters);
  };

  return (
    <Container>
      <Filter onFilterApply={handleFilterApply} />
      <Section
        header={
          <Title>
            <h2>Cadastro / Usuário</h2>
          </Title>
        }
      >
        <CustomTable filters={filters} />
      </Section>
    </Container>
  );
};

export default memo(Users);
