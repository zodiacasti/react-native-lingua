import { Image as ExpoImage } from "expo-image";
import { useCssElement } from "nativewind";
import type { ComponentProps } from "react";

type ImageProps = ComponentProps<typeof ExpoImage> & { className?: string };

// expo-image is a third-party component, so NativeWind needs to be told to map className -> style
export function Image(props: ImageProps) {
  return useCssElement(ExpoImage, props, { className: "style" });
}
