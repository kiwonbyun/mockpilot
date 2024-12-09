interface Photo {
  id: string;
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

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
        gridAutoRows: "10px",
        gap: "20px",
      }}
    >
      {photos.map((photo) => (
        <div
          key={photo.id}
          style={{
            gridRowEnd: `span ${getSpans((photo.height / photo.width) * 100)}`,
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
        </div>
      ))}
    </div>
  );
};

export default PhotoGrid;
