import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  account: {},
  provider: {},
  contract: {},
  tokenDetails: {},
  file: {},
  packDetails: {},
};

export const App = "app";

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchAccountDetails: (state, actions) => {
      state.account = {};
    },
    fetchAccountDetailsSuccess: (state, actions) => {
      state.account.data = actions.payload;
    },
    fetchAccountDetailsFailed: (state, actions) => {
      state.account.err = actions.payload;
    },
    setProvider: (state, action) => {
      state.provider = action.payload;
    },
    setContracts: (state, action) => {
      state.contracts = { ...state.contracts, ...action.payload };
    },
    setTokenDetails: (state, action) => {
      state.tokenDetails = action.payload;
    },
    setFile: (state, action) => {
      state.file = action.payload;
    },
    fetchSigner: (state, action) => {},
  },
});

const { actions, reducer } = appSlice;

export const {
  fetchAccountDetails,
  fetchAccountDetailsSuccess,
  fetchAccountDetailsFailed,
  setContracts,
  setProvider,
  setTokenDetails,
  setFile,
  fetchSigner,
} = actions;

export const appReducer = reducer;
