import { call, put, takeLatest } from "@redux-saga/core/effects";
import { getCall, putCall } from "../../../utils/api";
import { apiEndPoints } from "../../../utils/constants.json";
import {
  getPacks,
  getPacksFailed,
  getPacksSuccess,
  buyPack,
  buyPackFailed,
  buyPackSuccess,
} from "./Pack.slice";

function* createPack() {
  try {
    const res = yield call(getCall, apiEndPoints.getPacks);
    yield put(getPacksSuccess(res.data));
  } catch (err) {
    console.log(err);
    yield put(getPacksFailed(err?.data?.message ?? err.message));
  }
}

function* buyPacksaga({ payload: { packId, account } }) {
  try {
    const res = yield call(putCall, apiEndPoints.buyPack, { packId, account });
    yield put(buyPackSuccess(res.data));
  } catch (err) {
    yield put(buyPackFailed(err.message));
  }
}

export function* packsSaga() {
  yield takeLatest(getPacks.type, createPack);
  yield takeLatest(buyPack.type, buyPacksaga);
}
