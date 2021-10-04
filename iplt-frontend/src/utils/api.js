import { baseURL } from "./config";
import { gateways } from "./constants.json";
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

export const fetchFromIpfs = async (cid) => {
  return Promise.any(
    gateways.map(async (gateway) => {
      const response = await axios.get(`${gateway}/ipfs/${cid}`, {
        responseType: "application/json",
      });
      return response.data;
    })
  );
};
