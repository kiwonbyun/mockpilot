import { useRef } from "react";

const GallerySkeleton = () => {
  // 스켈레톤 아이템의 개수
  const items = Array.from({ length: 8 }, (_, i) => i);

  // 랜덤한 span 값을 생성하되, 한번 생성된 값은 유지
  const spans = useRef(
    items.map(() => Math.floor(Math.random() * 1.2 + 2) * 10)
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
        gridAutoRows: "10px",
        gap: "20px",
      }}
    >
      {items.map((_, index) => (
        <div
          key={index}
          style={{
            gridRowEnd: `span ${spans.current[index]}`,
            backgroundColor: "#f0f0f0",
            borderRadius: "8px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite linear",
            }}
          />
        </div>
      ))}

      <style>
        {`
          @keyframes shimmer {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default GallerySkeleton;
