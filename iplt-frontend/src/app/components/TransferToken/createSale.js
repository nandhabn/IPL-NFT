import { Button, Card, Input, notification } from "antd";
import { isEmpty, isNumber } from "lodash";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectContracts } from "../../app.selector";

export const CreateMomentSale = ({ tokenId }) => {
  const contract = useSelector(selectContracts);
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
      if (isEmpty(contract.IPLM.signer)) {
        openNotification("This action needs account. Please connect your wallet.");
      }
      if (!isNumber(price)) {
        return;
      }
      const tx = await contract.IPLM.createSale(tokenId, price);
      contract.IPLM.on(tx.hash, () => {
        openNotification("The moment is added to the sale");
      });
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
    <div className="col justify-content-end d-flex align-content-end">
      {isSaleViewOpen ? (
        <div className="col">
          <div>
            <Input onChange={validateInput} type="number" placeholder="Price" min={0} />
          </div>
          <div className="justify-content-end d-flex mt-1 col">
            <Button onClick={createSale} className="me-2">
              Confirm
            </Button>
            <Button onClick={() => openCloseSaleView(false)} danger>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="d-flex justify-content-end col w-100">
          <Button onClick={() => openCloseSaleView(true)}>Add to sale</Button>
        </div>
      )}
    </div>
  );
};
