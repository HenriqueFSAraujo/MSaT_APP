import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://10.0.20.82:8081/api',  // depois só trocar pro backend real
    headers: {
        'Content-Type': 'application/json',
    },
});
