import { isEmpty } from "lodash";
import React from "react";
import { useMetamask } from "use-metamask";
import { DisplayMoments } from "../../components/DisplayMoments/DisplayMoments";

export const MyCollections = () => {
  const { metaState } = useMetamask();
  return isEmpty(metaState.account) ? (
    <div className="h-100 d-100 d-flex justify-content-center align-items-center">
      Oops!!.. Cannot get your collection, please connect your wallet.
    </div>
  ) : (
    <DisplayMoments />
  );
};
