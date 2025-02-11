import React from 'react';

import { ButtonContainer, CancelButton, SaveButton } from './styles';

const ExclusionModal: React.FC = () => {
  return (
    <ButtonContainer>
      <CancelButton
        variant="contained"
        color="secondary"
        onClick={() => {
          // Implemente a lógica de cancelamento aqui
          console.log('Cancelado');
        }}
      >
        Cancelar
      </CancelButton>
      <SaveButton type="submit" variant="contained" color="primary">
        Salvar
      </SaveButton>
    </ButtonContainer>
  );
};

export default ExclusionModal;
