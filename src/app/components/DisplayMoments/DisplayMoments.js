import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAccounts, selectContracts } from "../../app.selector";
import { Col, Row } from "antd";
import { CreateMomentSale } from "../TransferToken/createSale";

export const DisplayMoments = () => {
  const contract = useSelector(selectContracts);
  const accounts = useSelector(selectAccounts);

  const [tokens, setTokens] = useState([]);

  const getAllTokens = async () => {
    const balance = await contract.IPLM.balanceOf(accounts.data[0]);
    const tokens = Array.apply(null, Array(Number(balance._hex))).map(
      async (_, index) => {
        const tokenId = await contract.IPLM.getMomentsOfOwnerByIndex(
          accounts.data[0],
          index
        );
        const metaData = await contract.IPLM.getMomentById(tokenId);
        return { tokenId: Number(tokenId._hex), metaData: metaData[1] };
      }
    );
    return tokens;
  };

  const updateTokens = async () => {
    const tokens = await Promise.all(await getAllTokens());
    setTokens(tokens);
  };

  useEffect(() => {
    updateTokens();
  });
  return (
    <Row gutter={[8, 48]}>
      {tokens.map((token) => (
        <Col dir="vertical" span={6} key={token.tokenId}>
          <CreateMomentSale imgSrc={token.metaData} tokenId={token.tokenId} />
        </Col>
      ))}
    </Row>
  );
};
