import { createSelector } from "@reduxjs/toolkit";
import get from "lodash/get";
import { packs, initialState } from "./Pack.slice";

const stateValue = (state) => get(state, packs) || initialState;

export const selectPacks = createSelector([stateValue], (state) => get(state, "packs"));
export const selectBuyPack = createSelector([stateValue], (state) => get(state, "buyPackApi"));
