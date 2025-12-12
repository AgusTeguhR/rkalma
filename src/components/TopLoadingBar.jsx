import React, { useEffect, useState } from "react";

const TopLoadingBar = ({ onDone }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setWidth((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          onDone(); // callback ketika loading selesai
          return 100;
        }
        return prev + 3; // speed bar
      });
    }, 30);

    return () => clearInterval(timer);
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "2px",
        width: `${width}%`,
        background: "#244502",
        transition: "width 0.1s ease-out",
        zIndex: 9999,
      }}
    ></div>
  );
};

export default TopLoadingBar;
