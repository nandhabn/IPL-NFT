import { get, isEmpty } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useInjectReducer, useInjectSaga } from "redux-injectors";
import { PackCard } from "../../components/PackCard/PackCard";
import { buyPack, clearBuyPackData, getPacks, packsReducer } from "./Pack.slice";
import { packsSaga } from "./Packs.saga";
import { selectBuyPack, selectPacks } from "./Packs.selector";
import { selectContracts } from "../../app.selector";
import { useMetamask } from "use-metamask";
import { useHistory } from "react-router";
import { contractIds } from "../../../utils/constants.json";
import { notification } from "antd";

export const Home = () => {
  useInjectReducer({ key: "packs", reducer: packsReducer });
  useInjectSaga({ key: "packs", saga: packsSaga });

  const { metaState } = useMetamask();
  const [packError] = useState("");
  const [packList, setPackList] = useState([]);

  const packs = useSelector(selectPacks);
  const buyPackRes = useSelector(selectBuyPack);
  const contracts = useSelector(selectContracts);
  const history = useHistory();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPacks());
  }, [dispatch]);

  useEffect(
    () => () => {
      dispatch(clearBuyPackData());
    },
    [dispatch]
  );

  useEffect(() => {
    if (get(packs, "err")) {
      openNotification("Failed to fetch packs");
    }
    if (get(packs, "data")) {
      setPackList(get(packs, "data.packs"));
    }
  }, [packs]);

  const redeemPack = useCallback(
    async (cost) => {
      const allowance = await contracts.IPLT.allowance(
        metaState.account[0],
        contractIds.IPLMoments
      );
      if (allowance < cost["packCost"]) {
        await contracts.IPLT.approve(contractIds.IPLMoments, cost["packCost"]);
      }
      const tx = await contracts.IPLM.redeemPack({ value: cost["gasCost"] });
      contracts.IPLM.provider.once(tx.hash, () => {
        history.push("/my-collection");
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [contracts?.IPLM]
  );

  const redeemPackUseEffect = useCallback(async () => {
    if (!isEmpty(get(buyPackRes, "data"))) {
      const redeemCost = await contracts.IPLM.getRedeemCost(metaState.account[0]);
      redeemPack(redeemCost);
    }
  }, [buyPackRes, contracts?.IPLM, metaState.account, redeemPack]);

  useEffect(() => {
    if (!isEmpty(buyPackRes)) {
      redeemPackUseEffect();
    }
  }, [buyPackRes, redeemPackUseEffect, metaState.account]);

  const buyPacks = useCallback(
    async (packId, price) => {
      try {
        if (!isEmpty(metaState.account)) {
          const redeemCost = await contracts.IPLM.getRedeemCost(metaState.account[0]);
          const IPLTBal = await contracts.IPLT.balanceOf(metaState.account[0]);
          console.log(redeemCost, IPLTBal);
          if (IPLTBal < price) {
            openNotification("Insufficient IPLT tokens");
            return;
          }

          if (Number(redeemCost["gasCost"]._hex) === 0) {
            return dispatch(buyPack({ packId, account: metaState.account[0], IPLTBal }));
          } else {
            redeemPack(redeemCost);
          }
        }
      } catch (e) {
        openNotification(e?.data.message.split("revert")[1] ?? e.message);
      }
    },
    [metaState.account, contracts?.IPLM, contracts?.IPLT, dispatch, redeemPack]
  );

  const openNotification = (message) => {
    notification.open({
      message,
    });
  };

  return (
    <div className="d-flex flex-column">
      <div
        style={{ height: "auto" }}
        className="d-flex justify-content-around align-content-center flex-wrap overflow-auto row"
      >
        {packList &&
          packList.map((pack, i) => {
            return <PackCard pack={pack} key={i} buyPack={buyPacks} />;
          })}
        {packError && (
          <div className="d-flex justify-content-center align-content-center">
            Fetching pack details failed
          </div>
        )}
      </div>
    </div>
  );
};
