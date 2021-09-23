import {
    Input,
    Row,
    Col,
    Form,
    Select,
    Radio,
    DatePicker,
    InputNumber,
    Button,
} from "antd";
import { setTokenDetails } from "../../../App.slice";
import { useDispatch } from "react-redux";

const { Option } = Select;
const formData = ["Play Name", "Description" , "Player Name", "Team Name", "Opponent Team Name"];
const rarity = ["Common", "Rare", "Epic", "Legendary"];
const playTypes = ["Wickets", "Catch", "Six", "Four", "Run Outs", "Special Moments", "Fielding", "Others"];
// const rules = [
//     {
//         required: true,
//         message: 'Please provide a value',
//     },
// ];

const TokenDetails = () => {

    const dispatch = useDispatch();

    const onFinish = (values) => {
        console.log(setTokenDetails(values));
        dispatch(setTokenDetails(values));
    };

    return (
        <div>
            <Form
                onFinish={onFinish}
                name="basic"
                autoComplete="off"
                layout="vertical"
            >
                <Row>
                    <Col span={11}>
                        {formData.map(formLabel => {
                            return (
                                <Form.Item
                                    key={formLabel}
                                    label={formLabel}
                                    name={formLabel}>
                                    <Input placeholder={formLabel} />
                                </Form.Item>
                            );
                        })}

                    </Col>
                    <Col span={11} offset={2}>

                        <Form.Item
                            label="Play Type">
                            {/* rules={rules}> */}
                            <Select placeholder="Select Play Type">
                                {playTypes.map(playType => (
                                    <Option
                                        key={playType}
                                        value={playType}>
                                        {playType}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Ratity"
                            name="size">
                            {/* rules={rules}> */}
                            <Radio.Group>
                                {rarity.map(type => (
                                    <Radio.Button
                                        key={type}
                                        value={type}>{type}</Radio.Button>
                                ))}
                            </Radio.Group>
                        </Form.Item>


                        <Form.Item
                            label="Season">
                            {/* rules={rules}> */}
                            <InputNumber placeholder="Season" min="1" />
                        </Form.Item>

                        <Form.Item
                            label="Match Date">
                            {/* rules={rules}> */}
                            <DatePicker />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default TokenDetails;