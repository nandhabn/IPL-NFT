import { Col, Row } from "antd";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectContracts } from "../../app.selector";
import { notification } from "antd";
import { BuyMoment } from "../TransferToken/BuyMoment";

export const MomentForSale = () => {
  const contract = useSelector(selectContracts);

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
            price: Number(sale[1]._hex),
            tokenId: Number(sale[2]._hex),
            saleId: Number(sale[3]._hex),
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
        <Col key={sale.saleId}>
          <img src={sale.tokenUrl} alt="" />
          <table>
            <tbody>
              <tr>
                <td>Token Id</td>
                <td> {sale.tokenId}</td>
              </tr>
              <tr>
                <td>Sale Id</td>
                <td>{sale.tokenId}</td>
              </tr>
              <tr>
                <td>Price</td>
                <td>{sale.price}</td>
              </tr>
              <tr>
                <td>Sale</td>
                <td>{sale.saleDone ? "Done" : "Availabe"}</td>
              </tr>
              {!sale.saleDone && (
                <tr>
                  <BuyMoment saleId={sale.saleId} />
                </tr>
              )}
            </tbody>
          </table>
        </Col>
      ))}
    </Row>
  );
};
