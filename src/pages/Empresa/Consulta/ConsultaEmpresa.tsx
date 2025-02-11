import Section from '@/components/common/section/Section';
import React, { memo, useEffect, useState } from 'react';
import { Container } from './styles';

import { GetVehiclesParams } from '@/services/consulta';
import { CompanyResponse, companyService } from '@/services/mandatoryAssociationService';
import Filter, { SearchForm } from './components/filter/Filter';
import CustomTableCompany from './components/table/CustomTableCompany';

const ConsultaEmpresa: React.FC = () => {
  const [companyData, setCompanyData] = useState<CompanyResponse | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [recharge, setRecharge] = useState(false);
  const [filters, setFilters] = useState<SearchForm>({
    currentStage: '',
    seizureStatus: '',
    totalPerPage: 10,
    typeCompany: '',
    situation: '',
    municipality: '',
    cpfCnpj: '',
    nameCompany: '',
  });

  const fetchCompany = () => {
    setIsLoading(true);
    setError(null);

    const params: GetVehiclesParams = {
      page,
      size: filters.totalPerPage,
    };

    if (filters.currentStage) params.stage = filters.currentStage;
    if (filters.seizureStatus) params.status = filters.seizureStatus;

    companyService
      .getCompanies()
      .then((details) => {
        setCompanyData(details);
        console.log(details, 'detailsResponse');
      })
      .catch((err) => {
        console.error('Erro ao carregar detalhes do veículo:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    fetchCompany();
  }, [page, filters, recharge]);

  const handleFilterChange = (newFilters: SearchForm) => {
    setFilters(newFilters);
    setPage(0);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <Container>
      <Filter onFilterChange={handleFilterChange} />
      <Section header={<div></div>}>
        <CustomTableCompany
          setRecharge={setRecharge}
          recharge={recharge}
          companyData={companyData!}
          isLoading={isLoading}
          error={error}
          page={page}
          totalPerPage={filters.totalPerPage}
          onPageChange={handlePageChange}
          filters={{
            currentStage: filters.currentStage || '',
            seizureStatus: filters.seizureStatus || '',
            typeCompany: filters.typeCompany || '',
            situation: filters.situation || '',
            municipality: filters.municipality || '',
            cpfCnpj: filters.cpfCnpj || '',
            nameCompany: filters.nameCompany || '',
          }}
        />
      </Section>
    </Container>
  );
};

export default memo(ConsultaEmpresa);
