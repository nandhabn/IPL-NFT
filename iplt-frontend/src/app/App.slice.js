import { createSlice } from "@reduxjs/toolkit";

export const initialState = {};

export const App = "app";

const dealDetailsSlice = createSlice({
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
    setPackDetails: (state, action) => {
      state.packDetails = action.payload;
    }
  },
});

const { actions, reducer } = dealDetailsSlice;

export const {
  fetchAccountDetails,
  fetchAccountDetailsSuccess,
  fetchAccountDetailsFailed,
  setContracts,
  setProvider,
  setTokenDetails,
  setFile,
  fetchSigner,
  setPackDetails,
} = actions;

export const appReducer = reducer;
