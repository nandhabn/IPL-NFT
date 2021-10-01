import React from "react";
import { Button, Card } from "antd";
import { rarity } from "../../../utils/constants.json";

export const PackCard = ({ pack, buyPack }) => {
  return (
    <Card
      className="col-2 m-2 mt-5 d-flex"
      style={{ height: 500 }}
      bodyStyle={{
        width: "100%",
        padding: 0,
        boxShadow: "-1px 1px 10px gray",
      }}
    >
      <div className="d-flex" style={{ backgroundColor: "#ff6732", height: "100%", width: "100%" }}>
        <div
          className="mt-2 d-flex row"
          style={{
            backgroundColor: "white",
            width: "100%",
            height: "100%",
            marginLeft: 0,
            boxShadow: "-1px 1px 10px gray",
          }}
        >
          <div className="py-4 d-flex justify-content-center align-item-center text-capitalize">
            {pack.packName}
          </div>
          <div
            className="py-4 d-flex justify-content-center align-item-center fs-2"
            style={{ backgroundColor: "#ecf0f1" }}
          >
            {pack.price} IPLT
          </div>
          <div>
            <div className="py-2 d-flex justify-content-center align-item-center fs-3">Get</div>
            {pack.cardsPerType.map((card) => (
              <div className="py-1 d-flex justify-content-center align-item-center">
                {card.tokensToMint} {rarity[card.tokenType]}
              </div>
            ))}
          </div>
          <div className="py-4 justify-content-center align-self-end d-flex" style={{ bottom: 0 }}>
            <Button onClick={() => buyPack(pack._id)}>Buy Now</Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
