// "axios" package needs to be installed
import { AxiosInstance } from 'axios';
// "stringify" function is re-exported from "query-string" package by "@pankod/refine-simple-rest"
import { stringify } from '@pankod/refine-simple-rest';
import { DataProvider } from '@pankod/refine-core';
import { axiosInstance, generateSort, generateFilter } from './utils';

export const dataProvider = (apiUrl: string, httpClient: AxiosInstance = axiosInstance): Required<DataProvider> => ({
  getList: async ({ resource, hasPagination = true, pagination = { current: 1, pageSize: 10 }, filters, sort }) => {
    const url = `${apiUrl}/${resource}`;

    const { current = 1, pageSize = 10 } = pagination ?? {};

    const queryFilters = generateFilter(filters);

    const query: {
      _start?: number;
      _end?: number;
      _sort?: string;
      _order?: string;
    } = hasPagination
      ? {
          _start: (current - 1) * pageSize,
          _end: current * pageSize
        }
      : {};

    const generatedSort = generateSort(sort);
    if (generatedSort) {
      const { _sort, _order } = generatedSort;
      query._sort = _sort.join(',');
      query._order = _order.join(',');
    }

    const { data, headers } = await httpClient.get(`${url}?${stringify(query)}&${stringify(queryFilters)}`);

    const total = +headers['x-total-count'];

    return {
      data,
      total
    };
  },

  getMany: async ({ resource, ids }) => {
    const { data } = await httpClient.get(`${apiUrl}/${resource}?${stringify({ id: ids })}`);

    return {
      data
    };
  },

  create: async ({ resource, variables }) => {
    const url = `${apiUrl}/${resource}`;

    const { data } = await httpClient.post(url, variables);

    return {
      data
    };
  },

  createMany: async ({ resource, variables }) => {
    const url = `${apiUrl}/${resource}/bulk`;
    const { data } = await axiosInstance.post(url, { values: variables });

    return {
      data
    };
  },

  update: async ({ resource, id, variables }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    const { data } = await httpClient.patch(url, variables);

    return {
      data
    };
  },

  updateMany: async ({ resource, ids, variables }) => {
    const url = `${apiUrl}/${resource}/bulk`;
    const { data } = await axiosInstance.patch(url, { ids, variables });

    return {
      data
    };
  },

  getOne: async ({ resource, id }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    const { data } = await httpClient.get(url);

    return {
      data
    };
  },

  deleteOne: async ({ resource, id, variables }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    const { data } = await httpClient.delete(url, {
      data: variables
    });

    return {
      data
    };
  },

  deleteMany: async ({ resource, ids }) => {
    const url = `${apiUrl}/${resource}/bulk?ids=${ids.join(',')}`;
    const { data } = await axiosInstance.delete(url);

    return {
      data
    };
  },

  getApiUrl: () => apiUrl,

  custom: async ({ url, method, filters, sort, payload, query, headers }) => {
    let requestUrl = `${url}?`;

    if (sort) {
      const generatedSort = generateSort(sort);
      if (generatedSort) {
        const { _sort, _order } = generatedSort;
        const sortQuery = {
          _sort: _sort.join(','),
          _order: _order.join(',')
        };
        requestUrl = `${requestUrl}&${stringify(sortQuery)}`;
      }
    }

    if (filters) {
      const filterQuery = generateFilter(filters);
      requestUrl = `${requestUrl}&${stringify(filterQuery)}`;
    }

    if (query) {
      requestUrl = `${requestUrl}&${stringify(query)}`;
    }

    if (headers) {
      httpClient.defaults.headers = {
        ...httpClient.defaults.headers,
        // ...headers
      };
    }

    let axiosResponse;
    switch (method) {
      case 'put':
      case 'post':
      case 'patch':
        axiosResponse = await httpClient[method](url, payload);
        break;
      case 'delete':
        axiosResponse = await httpClient.delete(url, {
          data: payload
        });
        break;
      default:
        axiosResponse = await httpClient.get(requestUrl);
        break;
    }

    const { data } = axiosResponse;

    return Promise.resolve({ data });
  }
});
