import {
  Descriptions
} from "antd";
// import { startCase } from "lodash";
import { useSelector } from "react-redux";
import { selectTokenDetails, selectFile } from "../../../app.selector";
import { playFormProperties } from "../../../../utils/constants.json"

const PreviewAndMint = () => {

  const tokenDetails = useSelector(selectTokenDetails);
  const fileSelected = useSelector(selectFile);

  return (
    <div>
      <Descriptions title="Token Details">
        {
          tokenDetails && Object.entries(tokenDetails).map(([key, value]) => {
            return (
              <Descriptions.Item
                key={key}
                label={playFormProperties[key]}>
                {key === "matchDate" ? value.toDate().toLocaleDateString() : value}
              </Descriptions.Item>
            )
          })
        }
      </Descriptions>
      {fileSelected && tokenDetails &&
        <img
          height="300px"
          width="200px"
          src={URL.createObjectURL(fileSelected)}
          alt={tokenDetails.playName}></img>
      }
    </div>
  );
}

export default PreviewAndMint;