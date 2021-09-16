import { get, isEmpty } from "lodash";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectAccounts, selectContracts } from "../../app.selector";

export const MintMoments = () => {
  const contract = useSelector(selectContracts);
  const accounts = useSelector(selectAccounts);

  const [momentUrl, setMomentUrl] = useState([]);

  const mintMoment = async () => {
    if (
      isEmpty(contract.IPLM) ||
      isEmpty(get(accounts, "data")) ||
      isEmpty(momentUrl)
    ) {
      return;
    }
    await contract.IPLM.createMoment(momentUrl);
  };

  const onMomentUrlChange = (e) => {
    setMomentUrl(e.target.value);
  };

  return (
    <div className="col-lg-3">
      <input
        className="m-3"
        onChange={onMomentUrlChange}
        value={momentUrl}
        placeholder="Moment url"
      />
      <button onClick={mintMoment}>Mint moment</button>
    </div>
  );
};
