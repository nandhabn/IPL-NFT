import { baseURL } from "./config";
const axios = require("axios").default;

export const getCall = async (endPoint, params, responseType = "application/json") => {
  return axios.get(`${baseURL}${endPoint}`, { params, responseType });
};

export const postCall = (endpoint, payload, config = {}) =>
  axios.post(`${baseURL}${endpoint}`, payload, { headers: { ...config } });

export const putCall = (endpoint, payload, config = {}) =>
  axios.put(`${baseURL}${endpoint}`, payload, {
    headers: { ...config },
    params: payload,
  });

export const deleteCall = (endpoint, params = {}) =>
  axios.delete(`${baseURL}${endpoint}`, { data: params });
