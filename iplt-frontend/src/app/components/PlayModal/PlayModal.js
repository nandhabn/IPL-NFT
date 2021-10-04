import React from "react";
import { Modal } from "antd";
import { gateways } from "../../../utils/constants.json";
import { CreateMomentSale } from "../TransferToken/createSale";

export const PlayModal = ({
  visible,
  playData: { metaData: playData, tokenId },
  setShowPlayModal,
}) => {
  console.log(playData, "playdata");

  return (
    <Modal visible={visible} onCancel={() => setShowPlayModal(false)} footer={null}>
      <div className="d-flex flex-row justify-content-between align-items-between">
        <div className="row w-100">
          <div className="col-6">
            <img
              height="300px"
              width="200px"
              src={`${gateways[0]}/ipfs/${playData?.image?.slice(7)}`}
              alt=""
            ></img>
          </div>
          <div className="col-6 d-flex flex-column justify-content-between">
            <div className="flex-column">
              {playData?.properties && (
                <>
                  <h4>{playData.properties.playName}</h4>
                  <h6>{playData.properties.description}</h6>
                  <p>Star player {playData.properties.playerName}</p>
                  <p>
                    {playData.properties.teamName} vs {playData.properties.opponentTeamName}
                  </p>
                  {/* <p>Match played on {playData.matchDate}</p> */}
                </>
              )}
            </div>
            <div className="justify-content-end d-flex">
              <CreateMomentSale tokenId={tokenId} />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
