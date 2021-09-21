import { Card, Row } from "antd";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAccounts, selectContracts } from "../../app.selector";
import { notification } from "antd";
import { BuyMomentOrEndSale } from "../TransferToken/BuyMoment";

export const MomentForSale = () => {
  const contract = useSelector(selectContracts);
  const accounts = useSelector(selectAccounts);

  const [saleData, setSaleData] = useState([]);

  const getSaleMoments = async () => {
    try {
      if (!isEmpty(contract.IPLM)) {
        const totalSales = await contract.IPLM.totalSales();
        const sales = [];
        for (let i = 0; i < totalSales; i++) {
          const sale = await contract.IPLM.getSaleById(i);
          const token = await contract.IPLM.getMomentById(sale[2]);
          sales.push({
            seller: sale["seller"],
            price: Number(sale[1]._hex),
            tokenId: Number(sale[2]._hex),
            saleId: Number(sale["saleId"]._hex),
            tokenUrl: token[1],
            saleDone: sale[4],
          });
        }
        setSaleData(sales);
      }
    } catch (e) {
      openNotification(e.message);
    }
  };
  useEffect(() => {
    getSaleMoments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract]);

  const openNotification = (message) => {
    notification.open({
      message,
    });
  };
  return (
    <Row>
      {saleData.map((sale) => (
        <Card
          key={sale.saleId}
          cover={<img src={sale.tokenUrl} alt="" />}
          className="m-1 p-3"
          style={{ width: "300px" }}
        >
          <table className="align-items-center">
            <tbody>
              <tr>
                <th colSpan="2">Token Id </th>
                <td colSpan="1">#{sale.tokenId}</td>
              </tr>
              <tr>
                <td colSpan="2">Sale Id</td>
                <td colSpan="1">{sale.saleId}</td>
              </tr>
              <tr>
                <td colSpan="2">Price</td>
                <td colSpan="1">{sale.price}</td>
              </tr>
              <tr>
                <td colSpan="2">Sale</td>
                <td colSpan="1">{sale.saleDone ? "Done" : "Availabe"}</td>
              </tr>
              {!sale.saleDone && (
                <tr>
                  <BuyMomentOrEndSale
                    saleId={sale.saleId}
                    buyToken={Number(accounts.data[0]) !== Number(sale.seller)}
                  />
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      ))}
    </Row>
  );
};
