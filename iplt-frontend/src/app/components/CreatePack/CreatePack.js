import { Input, Form, Card, InputNumber, Button } from "antd";
import { get, isEmpty } from "lodash";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useInjectReducer, useInjectSaga } from "redux-injectors";
import { rarity } from "../../../utils/constants.json";
import { PacksSaga } from "./createPack.saga";
import { selectPackDetails } from "./createPack.selector";
import { packReducer, setcreatePackDetails } from "./createPack.slice";

export const CreatePack = () => {
  useInjectReducer({ key: "pack", reducer: packReducer });
  useInjectSaga({ key: "pack", saga: PacksSaga });

  const dispatch = useDispatch();
  const packDetailsRes = useSelector(selectPackDetails);

  useEffect(() => {
    if (!isEmpty(get(packDetailsRes, "err", {}))) {
    }
    if (!isEmpty(get(packDetailsRes, "data", {}))) {
    }
  });

  const createPack = ({ packName, common, epic, legendary, rare, price }) => {
    dispatch(
      setcreatePackDetails({
        packName,
        cardsPerType: [
          { tokenType: 0, tokensToMint: common },
          { tokenType: 1, tokensToMint: epic },
          { tokenType: 2, tokensToMint: legendary },
          { tokenType: 3, tokensToMint: rare },
        ],
        price,
      })
    );
  };

  return (
    <Card className="col-md-6 d-inline-flex flex-column mt-3">
      <Form name="basic" autoComplete="off" layout="vertical" onFinish={createPack}>
        <Form.Item label="Pack Name" name="packName">
          <Input style={{ width: "75%" }} placeholder="Pack Name" />
        </Form.Item>
        <Form.Item label="Price" name="price">
          <InputNumber style={{ width: "75%" }} placeholder="Price" />
        </Form.Item>
        {rarity.map((type) => (
          <Form.Item key={type.toLowerCase()} name={type.toLowerCase()} label={type}>
            <InputNumber style={{ width: "75%" }} placeholder={type} min="1" max="10" />
          </Form.Item>
        ))}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create Pack
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreatePack;
