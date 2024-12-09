import React, { memo, useState, useEffect } from 'react';
import { Container } from './styles';
import Section from '@/components/common/section/Section';
import Filter, { SearchForm } from '@/pages/Consulta/components/filter/Filter';
import CustomTable from '@/pages/Consulta/components/table/ConstomTable';
import { vehicleService, GetVehiclesParams, VehicleResponse } from '@/services/consulta';
import dayjs from 'dayjs';

const today = dayjs(); // Data atual
const minDate = dayjs('2024-01-07');

const Consulta: React.FC = () => {
  const [vehiclesData, setVehiclesData] = useState<VehicleResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [recharge, setRecharge] = useState(false);
  const [filters, setFilters] = useState<SearchForm>({
    dateFrom: minDate,
    dateTo: today,
    creditor: '',
    contractNumber: '',
    uf: '',
    model: '',
    plate: '',
    currentStage: '',
    seizureStatus: '',
    totalPerPage: 10,
  });

  const fetchVehicles = () => {
    setIsLoading(true);
    setError(null);

    const params: GetVehiclesParams = {
      page,
      size: filters.totalPerPage,
    };

    if (filters.dateFrom) params.startDate = filters.dateFrom.format('YYYY-MM-DD');
    if (filters.dateTo) params.endDate = filters.dateTo.format('YYYY-MM-DD');
    if (filters.creditor) params.creditor = filters.creditor;
    if (filters.contractNumber) params.contractNumber = filters.contractNumber;
    if (filters.uf) params.uf = filters.uf;
    if (filters.model) params.model = filters.model;
    if (filters.plate) params.plate = filters.plate;
    if (filters.currentStage) params.stage = filters.currentStage;
    if (filters.seizureStatus) params.status = filters.seizureStatus;

    vehicleService
      .getVehicles(params)
      .then((response) => {
        setVehiclesData(response);
      })
      .catch((err) => {
        setError('Erro ao carregar os veículos. Por favor, tente novamente.');
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    fetchVehicles();
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
        <CustomTable
          setRecharge={setRecharge}
          recharge={recharge}
          vehiclesData={vehiclesData}
          isLoading={isLoading}
          error={error}
          page={page}
          totalPerPage={filters.totalPerPage}
          onPageChange={handlePageChange}
          filters={{
            creditor: filters.creditor || '',
            contractNumber: filters.contractNumber || '',
            uf: filters.uf || '',
            model: filters.model || '',
            plate: filters.plate || '',
            currentStage: filters.currentStage || '',
            seizureStatus: filters.seizureStatus || '',
          }}
        />
      </Section>
    </Container>
  );
};

export default memo(Consulta);
