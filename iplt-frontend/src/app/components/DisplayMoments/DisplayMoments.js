import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectContracts } from "../../app.selector";
import { Row } from "antd";
import { CreateMomentSale } from "../TransferToken/createSale";
import { isEmpty } from "lodash";
import { useMetamask } from "use-metamask";

export const DisplayMoments = () => {
  const contract = useSelector(selectContracts);
  const { metaState } = useMetamask();

  const [tokens, setTokens] = useState([]);

  const getAllTokens = async () => {
    const balance = await contract.IPLM.balanceOf(metaState.account[0]);
    const tokens = Array.apply(null, Array(Number(balance._hex))).map(
      async (_, index) => {
        const tokenId = await contract.IPLM.getMomentsOfOwnerByIndex(
          metaState.account[0],
          index
        );
        const metaData = await contract.IPLM.getMomentById(tokenId);
        return {
          tokenId: Number(tokenId._hex),
          metaData: metaData[1],
          playerName: metaData["playerName"],
        };
      }
    );
    return tokens;
  };

  const updateTokens = async () => {
    try {
      const tokens = await Promise.all(await getAllTokens());
      setTokens(tokens.filter((v) => v[0] !== metaState.account[0]));
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    if (!isEmpty(metaState.account)) {
      updateTokens();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metaState.account]);

  return (
    <Row gutter={[8, 48]}>
      {tokens.map((token) => (
        <CreateMomentSale
          imgSrc={token.metaData}
          tokenId={token.tokenId}
          playerName={token.playerName}
          key={token.tokenId}
        />
      ))}
    </Row>
  );
};
