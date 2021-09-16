import { ethers } from "ethers";
import momentAbi from "../contracts/IPLMoments.json";
import tokenAbi from "../contracts/IPLToken.json";
import { contractIds } from "../utils/constans.json";

import {
  fetchAccountDetails,
  fetchAccountDetailsSuccess,
  fetchAccountDetailsFailed,
  setContracts,
  setProvider,
} from "./App.slice";
import { put, takeLatest } from "redux-saga/effects";
import { get } from "lodash/get";

function* fetchcontracts({ payload: accounts }) {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const IPLM = new ethers.Contract(
      contractIds.IPLMoments,
      momentAbi,
      provider.getSigner(accounts[0])
    );
    const IPLT = new ethers.Contract(
      contractIds.IPLToken,
      tokenAbi,
      provider.getSigner(accounts[0])
    );
    yield put(setProvider(provider));
    yield put(setContracts({ IPLM, IPLT }));
    yield put(fetchAccountDetailsSuccess(accounts));
  } catch (e) {
    yield put(fetchAccountDetailsFailed(get(e, "message")));
  }
}

function* appSaga() {
  yield takeLatest(fetchAccountDetails.type, fetchcontracts);
}

export default appSaga;
