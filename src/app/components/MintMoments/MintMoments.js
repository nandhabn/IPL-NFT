import { Button, Input, Row } from "antd";
import { get, isEmpty } from "lodash";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  selectAccounts,
  selectContracts,
  selectProvider,
} from "../../app.selector";
import { contractIds } from "../../../utils/constans.json";
import { ethers } from "ethers";

export const MintMoments = () => {
  const contract = useSelector(selectContracts);
  const accounts = useSelector(selectAccounts);
  const provider = useSelector(selectProvider);

  const [momentUrl, setMomentUrl] = useState([]);

  const mintMoment = async () => {
    if (
      isEmpty(contract.IPLM) ||
      isEmpty(get(accounts, "data")) ||
      isEmpty(momentUrl)
    ) {
      return;
    }
    const recoveredAddress = ethers.utils.verifyMessage(
      ethers.utils.arrayify("0x1201392a93CD488380A753A3BF4616a2F3860FFC"),
      "0xf0489b72daad0772a42d241dd241dc46422cfd83c60436315c0656c1b4382c8e784dd643554e9d79be79dfd86d59591066c4e7de631bc5ac0e4fe6559fa964651b"
    );
    console.log(recoveredAddress);

    // const domain = {
    //       version: "1",
    //       chainId: 1337,
    //       verifyingContract: contractIds.IPLMoments,
    //     };

    //     // The named list of all type definitions
    //     const types = {
    //       Moment: [
    //         { name: "seriesId", type: "uint256" },
    //         { name: "momentId", type: "uint256" },
    //         { name: "tokenType", type: "uint8" },
    //         { name: "url", type: "string" },
    //       ],
    //     };

    //     // The data to sign
    //     const value = {
    //       seriesId: 0,
    //       momentId: 3,
    //       tokenType: 2,
    //       url: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
    //     };

    //     const signer = await provider.getSigner(accounts[0]);
    //     const signature = await signer._signTypedData(domain, types, value);
    //     console.log(signature);
    // await contract.IPLM.createMoment(momentUrl);
  };

  const onMomentUrlChange = (e) => {
    setMomentUrl(e.target.value);
  };

  return (
    <Row className="col-6 align-content-center">
      <Row className="col-6 align-content-center">
        <Input
          className="col"
          onChange={onMomentUrlChange}
          value={momentUrl}
          placeholder="Moment url"
        />
      </Row>
      <Button className="m-4" onClick={mintMoment}>
        Mint moment
      </Button>
    </Row>
  );
};
