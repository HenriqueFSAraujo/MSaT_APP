// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { api } from '../api';

// export interface UserResponse {
//   id: string;
//   username: string;
//   fullName: string;
//   email: string;
//   link: string;
//   resetAt: number;
//   roles: [
//     {
//       id: number;
//       name: string;
//     },
//   ];
//   companyId: number;
//   phone: number;
//   cpf: string;
//   enabled: boolean;
//   passwordChangedByUser: boolean;
//   createdByAdmin: boolean;
//   reset: boolean;
// }

// export interface User {
//   companyId: string;
//   cpf: string;
//   email: string;
//   enabled: boolean;
//   fullName: string;
//   password: string;
//   phone: number;
//   reset: boolean;
//   roles: [
//     {
//       id: number;
//       name: string;
//     },
//   ];
//   username: string;
// }

// const getUserByid = (id: string): Promise<UserResponse> => {
//   return new Promise((resolve, reject) => {
//     api
//       .get(`/api/v1/auth/user/${id}`)
//       .then((response) => {
//         resolve(response.data as UserResponse);
//       })
//       .catch((error) => {
//         reject(error);
//       });
//   });
// };

// const updateUser = (id: string, newPassword: string): Promise<any> => {
//   return new Promise((resolve, reject) => {
//     api
//       .patch(`/api/v1/auth/user/${id}/password`, { newPassword })
//       .then((response) => {
//         console.log(response, 'Response');
//         resolve(response.data as any);
//       })
//       .catch((error) => {
//         reject(error);
//       });
//   });
// };

// export const userService = {
//   updateUser,
//   getUserByid,
// };
