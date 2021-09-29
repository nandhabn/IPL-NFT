import {
  Input,
  Row,
  Col,
  Form,
  Select,
  Radio,
  DatePicker,
  InputNumber,
} from "antd";
import { setTokenDetails } from "../../../App.slice";
import { useDispatch } from "react-redux";
// import locale from "antd/lib/date-picker/locale/en_GB";
import { playFormProperties, rarity, playTypes } from "../../../../utils/constants.json";

const { Option } = Select;
// const rules = [
//     {
//         required: true,
//         message: 'Please provide a value',
//     },
// ];

const TokenDetails = () => {

  const dispatch = useDispatch();

  const onFieldsChange = (changed, all) => {
    dispatch(setTokenDetails(all));
  }

  return (
    <div>
      <Form
        name="basic"
        autoComplete="off"
        layout="vertical"
        // onFieldsChange={onFields}
        onValuesChange={onFieldsChange}
      >
        <Row>
          <Col span={11}>
            {
              Object.entries(playFormProperties).map(([key, value], index) => {
                return (
                  index < 5 && <Form.Item
                    key={key}
                    label={value}
                    name={key}>
                    <Input placeholder={value} />
                  </Form.Item>
                )
              })
            }

          </Col>
          <Col span={11} offset={2}>

            <Form.Item
              name="playType"
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
              name="rarity">
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
              name="season"
              label="Season">
              {/* rules={rules}> */}
              <InputNumber placeholder="Season" min="1" />
            </Form.Item>

            <Form.Item
              name="matchDate"
              label="Match Date">
              {/* rules={rules}> */}
              <DatePicker picker="date" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default TokenDetails;