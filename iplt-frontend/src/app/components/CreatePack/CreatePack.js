import {
  Input,
  Form,
  Card,
  InputNumber,
  Button,
} from "antd";
import { setPackDetails } from "../../App.slice";
import { useDispatch } from "react-redux";
import { rarity } from "../../../utils/constants.json";

export const CreatePack = () => {

  const dispatch = useDispatch();

  const createPack = (data) => {
    console.log(data);
    // dispatch(setPackDetails(data));
  };

  return (
    <Card className="col-md-6 d-inline-flex flex-column">
      <Form
        name="basic"
        autoComplete="off"
        layout="vertical"
        onFinish={createPack}>
        <Form.Item
          label="Pack Name"
          name="packName">
          <Input
            style={{ width: "75%" }}
            placeholder="Pack Name" />
        </Form.Item>
        <Form.Item
          label="Price"
          name="price">
          <InputNumber
            style={{ width: "75%" }}
            placeholder="Price" />
        </Form.Item>
        {
          rarity.map((type => (
            <Form.Item
              key={type.toLowerCase()}
              name={type.toLowerCase()}
              label={type}
            >
              <InputNumber
                style={{ width: "75%" }}
                placeholder={type}
                min="1"
                max="10" />
            </Form.Item>
          )))
        }
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create Pack
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default CreatePack;