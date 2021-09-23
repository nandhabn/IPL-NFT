import {
  Button,
  Card,
  Steps,
} from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectFile, selectTokenDetails } from "../../app.selector";
import { NFTStorage } from "nft.storage";
import { NFTStorage_APIKEY } from "../../../utils/config";
import TokenDetails from "../Steps/TokenDetails/TokenDetails";
import FileUpload from "../Steps/FileUpload/FileUpload";
import PreviewAndMint from "../Steps/PreviewMint/PreviewAndMint";

const { Step } = Steps;

const steps = [
  {
    title: 'Token Details',
    content: <TokenDetails />,
  },
  {
    title: 'Upload File',
    content: <FileUpload />,
  },
  {
    title: 'Preview and Mint',
    content: <PreviewAndMint />,
  },
];

export const MintMoments = () => {

  const [current, setCurrent] = useState(0);
  const tokenDetails = useSelector(selectTokenDetails);
  const file = useSelector(selectFile);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const mintToken = async () => {
    const nftStorageClient = new NFTStorage({ token: NFTStorage_APIKEY });
    const metaData = await nftStorageClient.store({
      name: tokenDetails["Play Name"],
      description: tokenDetails["Description"],
      image: file,
      properties: tokenDetails
    })
    console.log(metaData);
  };

  return (
    <div>
      <Card
        actions={[
          <div className="steps-action">
            {current > 0 && (
              <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                Previous
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                Next
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" onClick={mintToken}>
                Upload and Mint
              </Button>
            )}
          </div>
        ]}>
        <Steps current={current}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <Card>
          <div className="steps-content">{steps[current].content}</div>
        </Card>
      </Card>

    </div>
  );
};
