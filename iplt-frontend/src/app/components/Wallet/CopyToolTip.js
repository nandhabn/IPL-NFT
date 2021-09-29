import React, { useState } from "react";
import { Tooltip } from "antd";
import copy from "../../../assets/icons/copy.svg"

const CopyToolTip = ({ address }) => {
  const [message, setMessage] = useState("Copy To Clipboard");

  const handleCopy = async (e) => {
    await navigator.clipboard.writeText(e.target.id);
    setMessage("Copied");
  };

  return (
    <Tooltip title={message}>
      <img
        className="cursor-pointer copy-icon"
        src={copy}
        alt="copy"
        id={address}
        onClick={handleCopy}
        onMouseLeave={() => { setMessage("Copy To Clipboard") }}
      >
      </img>
    </Tooltip>
  );
};

export default CopyToolTip;