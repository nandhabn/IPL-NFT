import { Button, Input, Row } from "antd";
import { get, isEmpty } from "lodash";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectAccounts, selectContracts } from "../../app.selector";

export const MintMoments = () => {
  const contract = useSelector(selectContracts);
  const accounts = useSelector(selectAccounts);

  const [momentUrl, setMomentUrl] = useState("");
  const [playerName, setPlayerName] = useState("");

  const mintMoment = async () => {
    if (
      isEmpty(contract.IPLM) ||
      isEmpty(get(accounts, "data")) ||
      isEmpty(momentUrl) ||
      isEmpty(playerName)
    ) {
      return;
    }
    await contract.IPLM.createMoment(momentUrl, playerName);
  };

  const onMomentUrlChange = (e) => {
    setMomentUrl(e.target.value);
  };

  const handlePlayerNameChange = (e) => {
    setPlayerName(e.target.value);
  };

  return (
    <Row className="col-6 align-content-center">
      <Row className="col-6 align-content-center">
        <Input
          className="col me-2"
          onChange={handlePlayerNameChange}
          value={playerName}
          placeholder="Player name"
        />
        <Input
          className="col"
          onChange={onMomentUrlChange}
          value={momentUrl}
          placeholder="Moment url"
        />
      </Row>
      <Button className="ms-2" onClick={mintMoment}>
        Mint moment
      </Button>
    </Row>
  );
};
