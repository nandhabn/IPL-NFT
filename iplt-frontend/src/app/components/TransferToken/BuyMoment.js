import { Button, notification, Row } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import {
  selectAccounts,
  selectContracts,
  selectProvider,
} from "../../app.selector";
import { contractIds } from "../../../utils/constants.json";
import { isNumber } from "lodash";

export const BuyMomentOrEndSale = ({ saleId, buyToken }) => {
  const contract = useSelector(selectContracts);
  const provider = useSelector(selectProvider);
  const accounts = useSelector(selectAccounts);

  const buyMomentToken = async () => {
    try {
      if (!isNumber(saleId)) {
        return;
      }
      const tokenBalance = await contract.IPLT.balanceOf(accounts.data[0]);
      const sale = await contract.IPLM.getSaleById(saleId);
      const price = Number(sale[1]._hex);
      if (price > tokenBalance) {
        console.log(tokenBalance, sale, price);
        openNotification("Insufficiant tokens in your account");
        return;
      }

      let allowance = await contract.IPLT.allowance(
        accounts.data[0],
        contractIds.IPLMoments
      );
      allowance = Number(allowance._hex);

      if (allowance < price) {
        const txHash = await contract.IPLT.approve(contractIds.IPLMoments, 100);
        provider.once(txHash.hash, async () => {
          await buy(saleId);
        });
      } else {
        await buy(saleId);
      }
    } catch (e) {
      console.log(e);
      openNotification(e.message);
    }
  };

  const buy = async (saleId) => {
    const tx = await contract.IPLM.buyMoment(saleId);
    provider.once(tx.hash, async () => {
      openNotification("You owned the moment");
    });
  };

  const endSale = async () => {
    const tx = await contract.IPLM.endSale(saleId);
    provider.once(tx.hash, async () => {
      openNotification("Sale has been ended");
    });
  };

  const openNotification = (message) => {
    notification.open({
      message,
    });
  };

  return (
    <Row className="mt-2 align-items-center">
      <Button onClick={buyToken ? buyMomentToken : endSale} danger={!buyToken}>
        {buyToken ? "Buy Moment" : "End sale"}
      </Button>
    </Row>
  );
};
