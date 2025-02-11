import { api } from '../api';

// Interfaces
export interface Address {
  id?: string;
  postalCode: string;
  street: string;
  number: string;
  neighborhood: string;
  complement: string;
  state: string;
  city: string;
  note: string;
}

export interface ProbableAddress {
  id?: string;
  vehicleId: string;
  address: Address;
}

interface CreateProbableAddressParams {
  vehicleId: string;
  address: Address;
}

interface UpdateProbableAddressParams {
  addressId: string;
  vehicleId: string;
  address: Address;
}

// Get probable addresses for a vehicle
const getProbableAddresses = (vehicleId: string): Promise<ProbableAddress[]> => {
  return new Promise((resolve, reject) => {
    api
      .get(`/api/v1/probable-address/${vehicleId}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Create new probable address
const createProbableAddress = (params: CreateProbableAddressParams): Promise<void> => {
  return new Promise((resolve, reject) => {
    api
      .post('/api/v1/probable-address', params)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Update probable address
const updateProbableAddress = (params: UpdateProbableAddressParams): Promise<void> => {
  return new Promise((resolve, reject) => {
    api
      .put(`/api/v1/probable-address/${params.addressId}`, {
        vehicleId: params.vehicleId,
        address: params.address,
      })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Delete probable address
const deleteProbableAddress = (addressId: string, vehicleId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    api
      .delete(`/api/v1/probable-address/${addressId}/${vehicleId}`)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Export service
export const probableAddressService = {
  getProbableAddresses,
  createProbableAddress,
  updateProbableAddress,
  deleteProbableAddress,
};
