import { toast } from "@b-origin/ming-toast";
import { useMutation } from "@tanstack/react-query";
import { MouseEvent, useState } from "react";
import { Triangle } from "react-loader-spinner";
import GalleryDeleteErrorUI from "./GalleryDeleteErrorUI";

interface Photo {
  id: number;
  url: string;
  width: number;
  height: number;
}

const PhotoGrid = ({ photos }: { photos: Photo[] }) => {
  // 이미지 로드 전에 aspect ratio 계산
  const getSpans = (height: number) => {
    const rowHeight = 10; // Grid row height in pixels
    return Math.ceil(height / rowHeight);
  };
  const [hideIds, setHideIds] = useState<number[]>([]);
  const [showMutateInfo, setShowMutateInfo] = useState(false);
  const hideTarget = Array.from(hideIds);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) =>
      fetch(`https://fake-api.com/photos/${id}?sort=desc`, {
        method: "DELETE",
      }),
  });

  const deleteImage = async (e: MouseEvent<HTMLButtonElement>) => {
    const targetId = e.currentTarget.id;
    try {
      const res = await mutateAsync(targetId);
      if (!res.ok) throw new Error(res.statusText);
      const result = await res.json();
      const deletedId = Number(result.id);
      toast.success("Success!", {
        description: `Image number ${deletedId} is removed.`,
      });
      setHideIds((prev) => [...prev, deletedId]);
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Fail!", {
          description: error.message,
        });
        if (error.name === "TypeError") {
          setShowMutateInfo(true);
        }
      }
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
        gridAutoRows: "10px",
        gap: "20px",
      }}
    >
      {photos
        .filter((photo) => !hideTarget.includes(photo.id))
        .map((photo) => (
          <div
            className="relative"
            key={photo.id}
            style={{
              gridRowEnd: `span ${getSpans(
                (photo.height / photo.width) * 100
              )}`,
            }}
          >
            <img
              src={photo.url}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              loading="lazy"
            />
            <button
              className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md border-solid border-black border-[1px] text-sm active:bg-gray-600"
              onClick={deleteImage}
              id={String(photo.id)}
            >
              delete
            </button>
          </div>
        ))}
      {isPending && (
        <div className="absolute top-0 left-0 size-full bg-black/50 flex justify-center items-center">
          <Triangle height={100} width={100} color="white" />
        </div>
      )}
      {showMutateInfo && (
        <GalleryDeleteErrorUI setShowMutateInfo={setShowMutateInfo} />
      )}
    </div>
  );
};

export default PhotoGrid;
