import React, { useState, useRef } from "react";

type RatingProps = {
  maxRating?: number; // 최대 별점 (기본값: 5)
  step?: number; // 점수 단위 (기본값: 0.5)
  onChange?: (rating: number) => void; // 점수 변경 시 호출되는 콜백
};

const StarRating: React.FC<RatingProps> = ({
  maxRating = 5,
  step = 0.5,
  onChange,
}) => {
  const [rating, setRating] = useState(0); // 현재 별점 상태
  const [isDragging, setIsDragging] = useState(false); // 드래그 상태
  const containerRef = useRef<HTMLDivElement>(null);

  // 점수 계산
  const calculateRating = (clientX: number) => {
    if (!containerRef.current) return 0;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const relativeX = clientX - left;
    let rawRating = (relativeX / width) * maxRating;
    rawRating = Math.max(0, Math.min(maxRating, rawRating)); // 범위 제한
    return Math.round(rawRating / step) * step; // step 단위로 반올림
  };

  // 드래그 시작
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const newRating = calculateRating(e.clientX);
    setRating(newRating);
    onChange?.(newRating);
  };

  // 드래그 중
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newRating = calculateRating(e.clientX);
    setRating(newRating);
    onChange?.(newRating);
  };

  // 드래그 종료
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      style={{
        display: "inline-flex",
        position: "relative",
        cursor: "pointer",
        userSelect: "none",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {Array.from({ length: maxRating * 2 }).map((_, index) => {
        const value = (index + 1) / 2;
        return (
          <div
            key={index}
            style={{
              width: "20px",
              height: "20px",
              clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
              backgroundColor: value <= rating ? "#FFD700" : "#E0E0E0",
              margin: "0 2px",
            }}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
