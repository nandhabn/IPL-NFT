import { Button, Card, Input, notification } from "antd";
import { get, isEmpty, isNumber } from "lodash";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAccounts, selectContracts } from "../../app.selector";

export const CreateMomentSale = ({ imgSrc, tokenId, playerName }) => {
  const contract = useSelector(selectContracts);
  const accounts = useSelector(selectAccounts);
  const [newSaleId, setSaleId] = useState();
  const [isLoading, setLoading] = useState(false);
  const [isSaleViewOpen, setSaleView] = useState(false);

  const [price, setPrice] = useState(null);

  useEffect(() => {
    if (isNumber(newSaleId)) {
      setTimeout(() => setSaleId(null), 3000);
    }
    return () => {
      setSaleId(null);
    };
  });

  const createSale = async () => {
    try {
      setLoading(true);
      if (
        isEmpty(contract.IPLM) ||
        isEmpty(contract.IPLT) ||
        isEmpty(get(accounts, "data")) ||
        !isNumber(price)
      ) {
        return;
      }
      const newSaleId = await contract.IPLM.createSale(tokenId, price);
      setSaleId(newSaleId);
    } catch (e) {
      openNotification(e.data?.message.split("revert")[1] ?? e.message);
      console.log(e.message);
    } finally {
      setLoading(false);
    }
  };

  const openNotification = (message) => {
    notification.open({
      message,
    });
  };

  const openCloseSaleView = (open) => {
    setSaleView(open);
    if (!open) {
      setPrice(null);
    }
  };

  const validateInput = (e) => {
    setPrice(Number(e.target.value));
  };

  if (isLoading) {
    return <Card>Creating sale</Card>;
  }

  return (
    <Card
      cover={<img src={imgSrc} alt="" />}
      className="p-3 m-2"
      style={{ width: 300 }}
    >
      <div className="my-2">Player name: {playerName}</div>
      {isSaleViewOpen ? (
        <div className="col">
          <div className="col">
            <Input
              onChange={validateInput}
              type="number"
              placeholder="Price"
              min={0}
            />
          </div>
          <Button onClick={createSale}>Confirm</Button>
          <Button onClick={() => openCloseSaleView(false)} danger>
            Cancel
          </Button>
        </div>
      ) : (
        <Button onClick={() => openCloseSaleView(true)}>Add to sale</Button>
      )}
    </Card>
  );
};
