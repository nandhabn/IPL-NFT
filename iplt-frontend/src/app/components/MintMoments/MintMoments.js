import { Button, Card, Steps } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectContracts,
  selectFile,
  selectTokenDetails,
} from "../../app.selector";
import { NFTStorage } from "nft.storage";
import { NFTStorage_APIKEY } from "../../../utils/config";
import TokenDetails from "../Steps/TokenDetails/TokenDetails";
import FileUpload from "../Steps/FileUpload/FileUpload";
import PreviewAndMint from "../Steps/PreviewMint/PreviewAndMint";
import { rarityToIndex } from "../../../utils/constants.json";
import { useMetamask } from "use-metamask";
import { fetchSigner } from "../../App.slice";

const { Step } = Steps;

export const MintMoments = () => {
  const [current, setCurrent] = useState(0);
  const tokenDetails = useSelector(selectTokenDetails);
  const file = useSelector(selectFile);
  const contract = useSelector(selectContracts);
  const { metaState } = useMetamask();
  const dispatch = useDispatch();

  const checkContract = async () => {
    if (!metaState.isConnected) {
      dispatch(fetchSigner());
    }
  };

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const steps = [
    {
      title: "Token Details",
      content: <TokenDetails />,
    },
    {
      title: "Upload File",
      content: <FileUpload />,
    },
    {
      title: "Preview and Mint",
      content: <PreviewAndMint />,
    },
  ];

  const storeNFTData = async () => {
    await checkContract();
    const nftStorageClient = new NFTStorage({ token: NFTStorage_APIKEY });
    const metaData = await nftStorageClient.store({
      name: tokenDetails["playName"],
      description: tokenDetails["description"],
      image: file,
      properties: tokenDetails,
    });
    mintToken(metaData);
  };

  const mintToken = async (metaData) => {
    const url = metaData.url;
    const rarity = rarityToIndex[tokenDetails["rarity"]];
    const tx = await contract.IPLM.createPlay(url, rarity);
    console.log(tx);
  };

  return (
    <div>
      <Card
        actions={[
          <div className="steps-action">
            {current > 0 && (
              <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
                Previous
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                Next
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" onClick={storeNFTData}>
                Upload and Mint
              </Button>
            )}
          </div>,
        ]}
      >
        <Steps current={current}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div style={{ marginTop: "24px" }} className="steps-content">
          {steps[current].content}
        </div>
      </Card>
    </div>
  );
};
