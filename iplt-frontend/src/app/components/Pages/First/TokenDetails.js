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
    Form,
    Radio
} from "antd";
import { get, isEmpty } from "lodash";
import React, { useState } from "react";
import { useSelector } from "react-redux";

import { selectAccounts, selectContracts } from "../../../app.selector";
import { UploadOutlined } from '@ant-design/icons';

const formData = ["play name", "play type", "player name", "rarity", "team name", "opponent team", "season", "date"]

const TokenDetails = () => {


    const contract = useSelector(selectContracts);
    const accounts = useSelector(selectAccounts);

    const handlePlayerNameChange = (e) => {
        setPlayerName(e.target.value);
    };

    const [momentUrl, setMomentUrl] = useState("");
    const [playerName, setPlayerName] = useState("");

    const mintMoment = async () => {
        if (
            isEmpty(contract.IPLM) ||
            isEmpty(get(accounts, "data")) ||
            isEmpty(momentUrl) ||
            isEmpty(playerName)
        ) {
            return;
        }
        await contract.IPLM.createMoment(momentUrl, playerName);
    };

    return (
        <Row>
            <Space direction="vertical">

                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                    layout="vertical"
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                    >
                        <Input.Password />
                    </Form.Item>
                </Form>

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
                <Form.Item name="radio-group" label="Choose Rarity">
                    <Radio.Group>
                        <Radio value="a">Common</Radio>
                        <Radio value="b">Rare</Radio>
                        <Radio value="c">Epic</Radio>
                        <Radio value="d">Legendary</Radio>
                    </Radio.Group>
                </Form.Item>
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
            </Space>
        </Row>
    );
}

export default TokenDetails;