import { useState } from "react";
import { buildS3URL } from "../utils/s3";
import Image from "next/image";

const S3Image = ({ path, alt, width, height, blurDataURL }) => {
  const [isLoading, setLoading] = useState(true);

  return (
    <Image
      src={buildS3URL(path)}
      alt={alt}
      width={width}
      height={height}
      layout="intrinsic"
      placeholder={!!blurDataURL && "blur"}
      blurDataURL={blurDataURL}
      className={`duration-500 ${isLoading ? "scale-125" : "scale-100"}`}
      onLoadingComplete={() => setLoading(false)}
    ></Image>
  );
};

export default S3Image;
