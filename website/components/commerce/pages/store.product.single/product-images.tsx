import { Image, ImageViewModal, SwipeableViews } from "@components/generic";
import { Divider } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import React, { useState } from "react";

type IProductImagesState = "default" | "image-modal-opened";

export const useProductImagesState = () => {
  const [state, setState] = useState<IProductImagesState>("default");

  const [index, setIndex] = useState(0);

  return {
    state,
    setState,
    index,
    setIndex,
  };
};

export const ProductImages = ({
  images,
  state,
}: {
  images: { src: string; alt: string }[];
  state: ReturnType<typeof useProductImagesState>;
}) => {
  return (
    <>
      <ImageViewModal
        startIndex={state.index}
        open={state.state === "image-modal-opened"}
        onClose={() => state.setState("default")}
        images={images.map((image) => ({
          src: image.src,
          width: 1000,
          height: 1000,
        }))}
      />

      <SwipeableViews index={state.index} onChangeIndex={state.setIndex}>
        {images.map((image) => (
          <Image
            onClick={() => state.setState("image-modal-opened")}
            key={image.src}
            aspectRatio={1}
            src={image.src}
            alt={image.alt}
          />
        ))}
      </SwipeableViews>

      <Divider />

      <Box display="flex">
        {images.map((image, index) => (
          <Box width="120px" onClick={() => state.setIndex(index)}>
            <Image aspectRatio={1} src={image.src} alt={image.alt} />
          </Box>
        ))}
      </Box>
    </>
  );
};
