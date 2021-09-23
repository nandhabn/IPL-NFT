import { createSelector } from "@reduxjs/toolkit";
import get from "lodash/get";
import { App, initialState } from "./App.slice";

const stateValue = (state) => get(state, App) || initialState;

export const selectAccounts = createSelector([stateValue], (state) => get(state, "account"));
export const selectProvider = createSelector([stateValue], (state) => get(state, "provider"));
export const selectContracts = createSelector([stateValue], (state) => get(state, "contracts"));
export const selectTokenDetails = createSelector([stateValue], (state) => get(state, "tokenDetails"));
export const selectFile = createSelector([stateValue], (state) => get(state, "file"));
