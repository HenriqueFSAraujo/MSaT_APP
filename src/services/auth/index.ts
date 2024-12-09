import { api } from '../api';

interface LoginProps {
  username: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  token: string;
}

const login = (props: LoginProps): Promise<LoginResponse> => {
  return new Promise((resolve, reject) => {
    api
      .post('/api/v1/auth/login', props)
      .then((response) => {
        resolve(response.data as LoginResponse);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const cadastroPassword = (props: LoginProps): Promise<void> => {
  console.log(props, 'props');
  return new Promise((resolve, reject) => {
    api
      .post('/api/v1/auth/user', props)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const authService = {
  login,
  cadastroPassword,
};

export { authService };
