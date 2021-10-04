import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectContracts } from "../../app.selector";
import { Row, Card, Button } from "antd";
import { isEmpty } from "lodash";
import { useMetamask } from "use-metamask";
import { PlayModal } from "../PlayModal/PlayModal";
import { fetchFromIpfs } from "../../../utils/api";
import { gateways, rarity, rarityToCount } from "../../../utils/constants.json";
import { Link } from "react-router-dom";
const { Meta } = Card;

export const DisplayMoments = () => {
  const contract = useSelector(selectContracts);
  const { metaState } = useMetamask();

  const [tokens, setTokens] = useState([]);
  const [playData, setPlayData] = useState();
  const [showPlayModal, setShowPlayModal] = useState(false);
  const getAllTokens = async () => {
    const balance = await contract.IPLM.balanceOf(metaState.account[0]);
    console.log(balance.toString());
    const tokens = Array.apply(null, Array(Number(balance._hex))).map(async (_, index) => {
      const tokenId = await contract.IPLM.getMomentsOfOwnerByIndex(metaState.account[0], index);
      const moment = await contract.IPLM.getMomentById(tokenId);
      const play = await contract.IPLM.getPlayBy(moment[0]);
      const cid = play[0].slice(7);
      const data = await fetchFromIpfs(cid);
      return {
        tokenId: Number(tokenId._hex),
        metaData: data,
        playId: Number(moment[0]._hex),
        rarity: rarityToCount[rarity[play["tokenType"]]],
        SN: Number(moment["serialNumber"]._hex),
      };
    });
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

  return isEmpty(tokens) ? (
    <div className="h-100 d-100 d-flex justify-content-center align-items-center flex-column fs-4">
      <p>Your collection is Empty.</p>
      <Link to="/home">
        <Button type="primary">Buy a pack</Button>
      </Link>
    </div>
  ) : (
    <Row gutter={[8, 48]} className="pt-3">
      {tokens.map((token, index) => (
        <Card
          key={index}
          hoverable
          id={index}
          onClick={() => {
            setShowPlayModal(true);
            setPlayData({ metaData: token.metaData, tokenId: token.tokenId });
          }}
          className="me-3"
          style={{ width: 240 }}
          cover={
            <img
              alt={token.metaData.name}
              src={`${gateways[0]}/ipfs/${token.metaData.image.slice(7)}`}
            />
          }
        >
          <Meta title={token.metaData.name} description={token.metaData.description} />
          <p className="fs-5 pt-2">
            <span className="fs-6"> Serial Number: </span>
            {token.SN + 1}/{token.rarity}
          </p>
        </Card>
      ))}
      {showPlayModal && (
        <PlayModal
          visible={showPlayModal}
          playData={playData}
          setShowPlayModal={setShowPlayModal}
        />
      )}
    </Row>
  );
};
