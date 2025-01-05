import { useEffect } from "react";

export function useOutOfClick(
  ref: React.MutableRefObject<any>, // generic으로 바꿀 예정
  handlerCallback: (event?: CustomEvent<MouseEvent>) => void
): void {
  useEffect(() => {
    // 커스텀 이벤트 선언
    const listener = (event: CustomEvent<MouseEvent>) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handlerCallback(event);
    };

    document.addEventListener("mousedown", listener as EventListener);
    document.addEventListener("touchstart", listener as EventListener);
    return () => {
      document.removeEventListener("mousedown", listener as EventListener);
      document.removeEventListener("touchstart", listener as EventListener);
    };
    // ref나 callback 함수가 변경되었을때 이벤트 새로 생성 및 등록
  }, [ref, handlerCallback]);
}
