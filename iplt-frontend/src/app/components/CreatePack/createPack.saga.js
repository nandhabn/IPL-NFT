import { call, put, takeLatest } from "@redux-saga/core/effects";
import { postCall } from "../../../utils/api";
import { setcreatePackDetails, setCreatePackErr, setCreatePackRes } from "./createPack.slice";
import { apiEndPoints } from "../../../utils/constants.json";

function* createPack({ payload }) {
  try {
    const res = yield call(postCall, apiEndPoints.createPack, payload);
    yield put(setCreatePackRes(res.data));
  } catch (err) {
    console.log(err);
    yield put(setCreatePackErr(err?.data?.message ?? err.message));
  }
}

export function* PacksSaga() {
  yield takeLatest(setcreatePackDetails.type, createPack);
}
