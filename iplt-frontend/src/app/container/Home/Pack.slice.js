import { createSlice } from "@reduxjs/toolkit";

export const initialState = { packs: [] };

export const packs = "packs";

const packsSlice = createSlice({
  name: "packs",
  initialState,
  reducers: {
    getPacks: (state, action) => {
      state.packs = {};
    },
    getPacksSuccess: (state, action) => {
      state.packs.data = action.payload;
    },
    getPacksFailed: (state, action) => {
      state.packs.err = action.payload;
    },
    buyPack: (state, action) => {
      state.buyPackApi = {};
    },
    buyPackSuccess: (state, action) => {
      state.buyPackApi.data = action.payload;
    },
    buyPackFailed: (state, action) => {
      state.buyPackApi.err = action.payload;
    },
  },
});

const { actions, reducer } = packsSlice;

export const { getPacks, getPacksFailed, getPacksSuccess, buyPack, buyPackFailed, buyPackSuccess } =
  actions;

export const packsReducer = reducer;
