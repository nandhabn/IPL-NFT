import { Spin } from "antd";
import React, { useState } from "react";

export const Image = (props) => {
  const [isLoading, setLoading] = useState(true);

  return (
    <div className="d-flex justify-content-center align-items-center">
      {isLoading && <Spin />}
      <img {...props} onLoad={() => setLoading(false)} />
    </div>
  );
};
