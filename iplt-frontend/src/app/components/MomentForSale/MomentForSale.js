import { Button, Card, Row } from "antd";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAccounts, selectContracts } from "../../app.selector";
import { notification } from "antd";
import { BuyMomentOrEndSale } from "../TransferToken/BuyMoment";
import { Link } from "react-router-dom";
import { gateways, rarity, rarityToCount } from "../../../utils/constants.json";
import { fetchFromIpfs } from "../../../utils/api";
import { useMetamask } from "use-metamask";
import { Image } from "../Image/Image";

export const MomentForSale = () => {
  const contract = useSelector(selectContracts);

  const {
    metaState: { account },
  } = useMetamask();

  const [saleData, setSaleData] = useState([]);
  const [isSalesLoading, setSaleLoading] = useState(true);

  const getSaleMoments = async () => {
    try {
      setSaleLoading(true);
      if (!isEmpty(contract?.IPLM)) {
        const totalSales = await contract.IPLM.totalSales();
        const sales = [];
        for (let i = 0; i < totalSales; i++) {
          const sale = await contract.IPLM.getSaleById(i);
          if (!sale[4]) {
            const moment = await contract.IPLM.getMomentById(Number(sale[2]._hex));
            const play = await contract.IPLM.getPlayBy(moment[0]);
            const cid = play[0].slice(7);
            const data = await fetchFromIpfs(cid);
            sales.push({
              seller: sale["seller"],
              price: Number(sale[1]._hex),
              metaData: data,
              saleId: Number(sale["saleId"]._hex),
              rarity: rarityToCount[rarity[play["tokenType"]]],
              SN: Number(moment["serialNumber"]._hex),
            });
          }
        }
        setSaleData(sales);
      }
    } catch (e) {
      openNotification(e.message);
    } finally {
      setSaleLoading(false);
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
    <div className="h-100">
      {isSalesLoading ? (
        <div className="w-100 h-100 d-flex justify-content-center">Loading</div>
      ) : isEmpty(saleData) ? (
        <div className="w-100 d-flex align-items-center justify-content-center h-100 fs-4 flex-column">
          <p>No moments in sale</p>
          <Link to="/home">
            <Button type="primary">Buy a pack</Button>
          </Link>
        </div>
      ) : (
        <Row>
          {saleData.map((sale) => (
            <Card
              key={sale.saleId}
              className="m-1 p-3 h-50"
              cover={
                <div className="d-flex align-items-center justify-content-center">
                  <Image
                    alt={sale.metaData.name}
                    src={`${gateways[0]}/ipfs/${sale.metaData.image.slice(7)}`}
                    style={{ width: 120 }}
                  />
                </div>
              }
            >
              <table className="align-items-center d-flex">
                <tbody>
                  <tr>
                    <td>Name</td>
                    <td>{sale.metaData.name}</td>
                  </tr>
                  <tr>
                    <td>Serial Number: </td>
                    <td>
                      {sale.SN + 1}/{sale.rarity}
                    </td>
                  </tr>
                  <tr>
                    <td>Price</td>
                    <td>{sale.price} IPLT</td>
                  </tr>
                  {!sale.saleDone && (
                    <tr>
                      <BuyMomentOrEndSale
                        saleId={sale.saleId}
                        buyToken={Number(account[0]) !== Number(sale.seller)}
                      />
                    </tr>
                  )}
                </tbody>
              </table>
            </Card>
          ))}
        </Row>
      )}
    </div>
  );
};
