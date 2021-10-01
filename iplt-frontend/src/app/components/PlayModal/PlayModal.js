import React from "react";
import { Modal } from "antd";
import { gateways } from "../../../utils/constants.json";

export const PlayModal = ({ visible, playData, setShowPlayModal }) => {
  console.log(playData, "playdata");

  return (
    <Modal visible={visible} onCancel={() => setShowPlayModal(false)}>
      <div className="d-flex flex-row">
        <div className="row">
          <div className="col-6">
            <img
              height="300px"
              width="200px"
              src={`${gateways[0]}/ipfs/${playData?.image?.slice(7)}`}
              alt=""
            ></img>
          </div>
          <div className="col-3 ms-5">
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
            {playData.properties && (
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
        </div>
      </div>
    </Modal>
  );
};
