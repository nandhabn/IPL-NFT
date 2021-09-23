import {
    Descriptions
} from "antd";
// import { startCase } from "lodash";
import { useSelector } from "react-redux";
import { selectTokenDetails, selectFile } from "../../../app.selector";

const PreviewAndMint = () => {

    const tokenDetails = useSelector(selectTokenDetails);
    const fileSelected = useSelector(selectFile);

    return (
        <div>
            <Descriptions title="Token Details">
                {/* {setDesc} */}
                {
                    tokenDetails && Object.entries(tokenDetails).map(([key, value]) => {
                        return (<Descriptions.Item key={key} label={key}>{value}</Descriptions.Item>)
                    })
                }
            </Descriptions>
            {fileSelected && <img src={URL.createObjectURL(fileSelected)}></img>}
        </div>
    );
}

export default PreviewAndMint;