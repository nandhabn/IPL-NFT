import { Spin } from "antd";
import React, { useState } from "react";

export const Image = (props) => {
  const [isLoading, setLoading] = useState(true);

  return (
    <div className="d-flex justify-content-center align-items-center">
      {isLoading && <Spin />}
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img {...props} onLoad={() => setLoading(false)} />
    </div>
  );
};
