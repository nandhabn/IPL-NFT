import { createSlice } from "@reduxjs/toolkit";

export const initialState = {};

export const pack = "pack";

const packSlice = createSlice({
  name: "pack",
  initialState,
  reducers: {
    setcreatePackDetails: (state, action) => {
      state.packDetails = {};
    },
    setCreatePackRes: (state, action) => {
      state.packDetails.data = action.payload;
    },
    setCreatePackErr: (state, action) => {
      state.packDetails.err = action.payload;
    },
    clearCreatePackDetails: (state, action) => {
      state.packDetails = {};
    },
  },
});

const { actions, reducer } = packSlice;

export const { setcreatePackDetails, setCreatePackRes, setCreatePackErr } = actions;

export const packReducer = reducer;
