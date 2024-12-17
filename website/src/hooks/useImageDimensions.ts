import { useEffect, useState } from "react";

interface Photo {
  id: string;
  url: string;
  width: number;
  height: number;
}

const getImageDimensions = (
  url: string
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.onerror = reject;
    img.src = url;
  });
};

export const useImageDimensions = (images: Photo[]) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  useEffect(() => {
    const loadImages = async () => {
      const loadedPhotos = await Promise.all(
        images.map(async (image, index) => {
          const dimensions = await getImageDimensions(image.url);
          return {
            ...image,
            width: dimensions.width,
            height: dimensions.height,
            id: String(index),
          };
        })
      );
      setPhotos(loadedPhotos);
    };
    loadImages();
  }, []);

  return photos;
};
