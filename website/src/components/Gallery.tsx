"use client";
import { useImageDimensions } from "../hooks/useImageDimensions";
import PhotoGrid from "./PhotoGrid";
import { useSuspenseQuery } from "@tanstack/react-query";

function Gallery() {
  const { data } = useSuspenseQuery({
    queryKey: ["photos"],
    queryFn: () =>
      fetch("https://fake-api.com/photos").then((res) => {
        if (!res.ok) {
          throw new Error(`${res.statusText}`);
        }
        return res.json();
      }),
  });

  const aspectRatioPhotos = useImageDimensions(data);

  return <PhotoGrid photos={aspectRatioPhotos} />;
}

export default Gallery;
