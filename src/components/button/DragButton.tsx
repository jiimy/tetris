import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const DragButton = () => {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState<boolean>(false); // 드래그 상태
  const [startY, setStartY] = useState<number>(0); // 드래그 시작 Y 좌표
  const [dragDistance, setDragDistance] = useState<number>(0); // 드래그된 거리
  const [isClicked, setIsClicked] = useState<boolean>(false); // 클릭 여부

  // 최대 드래그 높이 (px 단위)
  const maxDragHeight = 50;

  const handleDragNavigation = () => {
    // router.push('/scan');
    console.log('드래그');
  };

  const handleClickNavigation = () => {
    // router.push('/scan');
    console.log('클릭');
  };

  // 드래그 시작
  const handleMouseDown = (e: any): void => {
    const isTouch = e.type === "touchstart";
    const start = isTouch ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
    setStartY(start);
    setIsDragging(true);
    setIsClicked(false); // 드래그 시작 시 클릭을 무효화

    // 드래그 중 이벤트 리스너 등록
    if (isTouch) {
      document.addEventListener("touchmove", handleMouseMove);
      document.addEventListener("touchend", handleMouseUp);
    } else {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
  };

  // 드래그 이동
  const handleMouseMove = (e: any): void => {
    const isTouch = e.type === "touchmove";
    const currentY = isTouch ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
    const distance = startY - currentY; // 위로 드래그하면 거리 증가

    // 최대 드래그 높이 제한
    const clampedDistance = Math.min(distance, maxDragHeight);

    setDragDistance(clampedDistance);

    // 드래그가 일정 범위 이상 넘어가면 링크로 이동
    if (clampedDistance > 30) {
      handleDragNavigation(); // 드래그로 이동
    }
  };

  // 드래그 종료
  const handleMouseUp = (): void => {
    setIsDragging(false);
    setDragDistance(0);

    // 드래그 종료 후 이벤트 리스너 제거
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("touchmove", handleMouseMove);
    document.removeEventListener("touchend", handleMouseUp);
  };

  // 클릭 이벤트 (드래그가 없을 경우에만)
  const handleClick = () => {
    if (!isDragging) {
      handleClickNavigation(); // 클릭으로 이동
    }
  };

  return (
    <button
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      onClick={handleClick} // 클릭 시 링크 이동
      style={{
        cursor: "grab",
        transform: `translateY(-${dragDistance}px)`, // 드래그 거리만큼 버튼을 위로 이동
        transition: isDragging ? "none" : "transform 0.3s ease-out", // 드래그 중에는 애니메이션을 없애고, 종료 후 애니메이션 추가
      }}
    >
      아이콘
    </button>
  );
};

export default DragButton;