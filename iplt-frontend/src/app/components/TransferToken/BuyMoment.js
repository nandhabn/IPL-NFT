import { Button, notification } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { selectContracts, selectProvider } from "../../app.selector";
import { contractIds } from "../../../utils/constants.json";
import { isEmpty, isNumber } from "lodash";
import { useMetamask } from "use-metamask";

export const BuyMomentOrEndSale = ({ saleId, buyToken }) => {
  const contract = useSelector(selectContracts);
  const provider = useSelector(selectProvider);
  const {
    metaState: { account },
  } = useMetamask();

  const buyMomentToken = async () => {
    try {
      if (isEmpty(account)) {
        openNotification("Please connect your wallet");
        return;
      }
      if (!isNumber(saleId)) {
        return;
      }
      const tokenBalance = await contract.IPLT.balanceOf(account[0]);
      const sale = await contract.IPLM.getSaleById(saleId);
      const price = Number(sale[1]._hex);
      if (price > tokenBalance) {
        openNotification("Insufficiant tokens in your account");
        return;
      }

      let allowance = await contract.IPLT.allowance(account[0], contractIds.IPLMoments);
      allowance = Number(allowance._hex);
      if (allowance <= price) {
        const txHash = await contract.IPLT.approve(contractIds.IPLMoments, price);
        contract.IPLM.provider.once(txHash.hash, async () => {
          await buy(saleId);
        });
      } else {
        await buy(saleId);
      }
    } catch (e) {
      console.log(e.message);
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
    <div className="pt-3">
      <Button onClick={buyToken ? buyMomentToken : endSale} danger={!buyToken}>
        {buyToken ? "Buy Moment" : "End sale"}
      </Button>
    </div>
  );
};
