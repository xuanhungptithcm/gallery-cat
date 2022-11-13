import { useState } from "react";
import { Blurhash } from "react-blurhash";
import Image from "next/image";
import { getS3Image } from "../helpers/config";

export default function OptimizeImage({
  image,
  setSourceIndex,
  setToggler,
  index,
}) {
  const [isImageLoad, setIsImageLoad] = useState(false);
  const [isImageLoadEnd, setIsImageLoadEnd] = useState(false);

  const myLoader = (props) => {
    return getS3Image(undefined, undefined, props.src);
  };

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <Image
        key={image.id}
        loader={myLoader}
        src={image.name}
        alt={image?.name}
        width={image?.width}
        height={image.height}
        onClick={() => {
          setSourceIndex(index);
          setToggler((prev) => !prev);
        }}
        onLoad={() => setIsImageLoad(true)}
        onLoadingComplete={() => {
          setIsImageLoadEnd(true);
          setIsImageLoad(false);
        }}
      />
      {isImageLoad || !isImageLoadEnd ? (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 20,
            width: '100%',
            height:'100%',
          }}
        >
          <Blurhash
            hash={image.blurhash || "LZQJQ0x^x^xvD%WBWBax%%M_MxRi"}
            width={image.width}
            height={image.height}
            resolutionX={32}
            resolutionY={32}
            punch={1}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 20,
              width: '100%',
              height:'100%',
            }}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
