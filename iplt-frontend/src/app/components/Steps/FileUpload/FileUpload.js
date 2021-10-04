import { Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { setFile } from "../../../App.slice";
import { useDispatch } from "react-redux";

const { Dragger } = Upload;

const props = {
  name: "file",
  maxCount: 1,
  customRequest: ({ file, onSuccess }) => {
    setTimeout(() => {
      //override antd default upload action
      onSuccess("ok");
    }, 0);
  },
  beforeUpload: (file) => {
    const isJPG =
      file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg";
    if (!isJPG) {
      message.error("You can only upload JPG or PNG file!");
      return false;
    } else {
      return true;
    }
  },
};

const FileUpload = () => {
  const dispatch = useDispatch();

  const uploadFile = (e) => {
    delete e.fileList[0].originFileObj["uid"];
    const file = e.fileList[0].originFileObj;
    dispatch(setFile(file));
  };

  return (
    <Dragger {...props} onChange={uploadFile}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click or drag file to this area to upload</p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibit from uploading company data or other
        band files
      </p>
    </Dragger>
  );
};

export default FileUpload;
