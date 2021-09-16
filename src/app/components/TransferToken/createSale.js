import { notification } from "antd";
import { get, isEmpty, isNumber } from "lodash";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAccounts, selectContracts } from "../../app.selector";
import { CloseCircleOutlined } from "@ant-design/icons";

export const CreateMomentSale = ({ imgSrc, tokenId }) => {
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
      console.log(newSaleId);
    } catch (e) {
      openNotification(e.message);
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

  if (isLoading) {
    return <>Creating sale</>;
  }

  return (
    <>
      <img src={imgSrc} alt="" />
      {isSaleViewOpen ? (
        <div>
          <input
            onChange={(e) => setPrice(Number(e.target.value))}
            type="number"
            placeholder="Price"
            min={0}
          />
          <button onClick={createSale}>Confirm</button>
          <CloseCircleOutlined onClick={() => openCloseSaleView(false)} />
        </div>
      ) : (
        <button onClick={() => openCloseSaleView(true)}>Add to sale</button>
      )}
    </>
  );
};
