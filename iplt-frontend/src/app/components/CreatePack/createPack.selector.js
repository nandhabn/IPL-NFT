import { createSelector } from "@reduxjs/toolkit";
import get from "lodash/get";
import { pack, initialState } from "./createPack.slice";

const stateValue = (state) => get(state, pack) || initialState;

export const selectPackDetails = createSelector([stateValue], (state) => get(state, "packDetails"));
