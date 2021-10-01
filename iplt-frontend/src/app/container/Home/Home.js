import { get, isEmpty } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useInjectReducer, useInjectSaga } from "redux-injectors";
import { PackCard } from "../../components/PackCard/PackCard";
import { buyPack, getPacks, packsReducer } from "./Pack.slice";
import { packsSaga } from "./Packs.saga";
import { selectBuyPack, selectPacks } from "./Packs.selector";
import { selectContracts } from "../../app.selector";
import { useMetamask } from "use-metamask";
import { DisplayMoments } from "../../components/DisplayMoments/DisplayMoments";

export const Home = () => {
  useInjectReducer({ key: "packs", reducer: packsReducer });
  useInjectSaga({ key: "packs", saga: packsSaga });

  const { metaState } = useMetamask();
  const [packError, setPackError] = useState("");
  const [packList, setPackList] = useState([]);

  const packs = useSelector(selectPacks);
  const buyPackRes = useSelector(selectBuyPack);
  const contracts = useSelector(selectContracts);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPacks());
  }, [dispatch]);

  useEffect(() => {
    if (get(packs, "err")) {
      setPackError("Failed to fetch packs");
    }
    if (get(packs, "data")) {
      setPackList(get(packs, "data.packs"));
    }
  }, [packs]);

  const redeemPack = useCallback(
    async (cost) => {
      const tx = await contracts.IPLM.redeemPack({ value: cost });
      contracts.IPLM.provider.once(tx.hash, () => {
        console.log("Done");
      });
    },
    [contracts?.IPLM]
  );

  const redeemPackUseEffect = useCallback(async () => {
    if (!isEmpty(get(buyPackRes, "data"))) {
      const redeemCost = await contracts.IPLM.getRedeemCost(metaState.account[0]);
      redeemPack(redeemCost);
    }
  }, [buyPackRes, contracts?.IPLM, metaState.account, redeemPack]);

  useEffect(() => {
    redeemPackUseEffect();
  }, [buyPackRes, redeemPackUseEffect, metaState.account]);

  const buyPacks = useCallback(
    async (packId) => {
      if (!isEmpty(metaState.account)) {
        const redeemCost = await contracts.IPLM.getRedeemCost(metaState.account[0]);
        console.log(redeemCost);
        if (Number(redeemCost._hex) === 0) {
          return dispatch(buyPack({ packId, account: metaState.account[0] }));
        } else {
          redeemPack(redeemCost);
        }
      }
    },
    [metaState.account, contracts?.IPLM, dispatch, redeemPack]
  );

  return (
    <div className="d-flex flex-column">
      <DisplayMoments />
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
