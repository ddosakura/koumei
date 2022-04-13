/* eslint-disable no-param-reassign */

import axios from 'axios';
// axios.interceptors.request.use((config) => {
//   if (import.meta.env.DEV) {
//     if (!config.headers) config.headers = {};
//     config.headers.Authorization = `Basic ${window.btoa('test:123456')}`;
//   }
//   return config;
// });
export { axios };
export * from 'react-query';
export { ReactQueryDevtools } from 'react-query/devtools';
