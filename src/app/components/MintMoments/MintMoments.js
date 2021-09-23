import {
  Button,
  Input,
  Upload,
  message,
  Row,
  Modal,
  Col,
  Space,
  Card,
  Steps,
} from "antd";
import { get, isEmpty } from "lodash";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectAccounts, selectContracts } from "../../app.selector";
import { NFTStorage, File } from "nft.storage";
import { NFTStorage_APIKEY } from "../../../utils/config";
import { UploadOutlined } from '@ant-design/icons';
import TokenDetails from "../Pages/First/TokenDetails";
import FileUpload from "../Pages/FileUpload/FileUpload";

const { Step } = Steps;
const { Dragger } = Upload;

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
    content: 'Last-content',
  },
];

export const MintMoments = () => {

  const [current, setCurrent] = React.useState(0);

  const [metaData, setMetaData] = useState({});

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const mintToken = () => {

  };

  return (
    <div>
      <Card
      actions={[
        <div className="steps-action">
            {current < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                Next
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" onClick={mintToken}>
                Mint Token
              </Button>
            )}
            {current > 0 && (
              <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                Previous
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
      {/* <Card title="Card title" bordered={false} style={{ width: 1300 }}>
        <Row>
          <Space direction="vertical">

            <Input
              className="col me-2"
              onChange={handlePlayerNameChange}
              value={playerName}
              placeholder="Player name"
            />
            <Input
              className="col"
              value={momentUrl}
              placeholder="Moment url"
            />
            <Input
              className="col me-2"
              onChange={handlePlayerNameChange}
              value={playerName}
              placeholder="Player name"
            />
            <Input
              className="col"
              value={momentUrl}
              placeholder="Moment url"
            />
            <Input
              className="col me-2"
              onChange={handlePlayerNameChange}
              value={playerName}
              placeholder="Player name"
            />
            <Input
              className="col"
              value={momentUrl}
              placeholder="Moment url"
            />

            <Upload >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
            <Button onClick={mintMoment}>
              Mint moment
            </Button>
          </Space>
        </Row>
      </Card> */}

    </div>
  );
};
