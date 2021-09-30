import React from "react";
import { Layout, Modal, Descriptions } from "antd";
import { playFormProperties } from "../../../utils/constants.json";

export const PlayModal = ({ visible, playData, setShowPlayModal }) => {
  console.log(playData);

  return (
    <Modal visible={visible} onCancel={() => setShowPlayModal(false)}>
      <div className="d-flex flex-row">
        <div className="row">
          <div className="col-5">
            <img src="https://ipfs.io/ipfs/bafybeiadyqwxvvlz4vizeizntyz6oz5zkmnyxrcwkdp3e2kvk36rlzr3ce/dhoni_card.jpg"></img>
          </div>
          <div className="col-6">
            {/* {
              playData && Object.entries(playData).map(([key, value]) => {
                return (
                  <p
                    key={key}
                    label={playFormProperties[key]}>
                    {value}
                  </p>
                )
              })
            } */}
            {
              playData &&
              <>
                <h4>{playData.playName}</h4>
                <h6>{playData.description}</h6>
                <p>Star player {playData.playerName}</p>
                <p>{playData.teamName} vs {playData.opponentTeamName}</p>
                <p>Match played on {playData.matchDate}</p>
              </>
            }
          </div>
        </div>
      </div>
    </Modal>
  );
};
