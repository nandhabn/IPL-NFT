import { notification, Row } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import {
  selectAccounts,
  selectContracts,
  selectProvider,
} from "../../app.selector";
import { contractIds } from "../../../utils/constans.json";
import { isNumber } from "lodash";

export const BuyMoment = ({ saleId }) => {
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
        openNotification("Insufficiant tokens in your account");
        return;
      }

      let allowance = await contract.IPLT.allowance(
        accounts.data[0],
        contractIds.IPLMoments
      );
      allowance = Number(allowance._hex);

      console.log(
        tokenBalance,
        sale,
        contractIds.IPLMoments,
        Number(sale[1]._hex),
        allowance
      );
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

  const openNotification = (message) => {
    notification.open({
      message,
    });
  };

  return (
    <Row>
      <button onClick={buyMomentToken}>Buy Moment</button>
    </Row>
  );
};
