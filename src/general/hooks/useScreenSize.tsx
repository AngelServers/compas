import React, { useState, useEffect } from "react";

const xsmall = 480;
const small = 568;
const medium = 768;
const large = 1024;
const xlarge = 1280;

const getSize = ():
  | "xsmall"
  | "small"
  | "medium"
  | "large"
  | "xlarge"
  | "xxlarge" => {
  const width = window.innerWidth;

  if (width < xsmall) {
    return "xsmall";
  } else if (width < small) {
    return "small";
  } else if (width < medium) {
    return "medium";
  } else if (width < large) {
    return "large";
  } else if (width < xlarge) {
    return "xlarge";
  } else {
    return "xxlarge";
  }
};

const useScreenSize = (): {
  width: number;
  height: number;
  size: "xsmall" | "small" | "medium" | "large" | "xlarge" | "xxlarge";
} => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    size: getSize(),
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
        size: getSize(),
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  return screenSize;
};

export { useScreenSize };
