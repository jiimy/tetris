import React from 'react';

const Menu = () => {
  return (
    <div>
      {/* 첫 로그인일 경우 */}
      <div>
        <button>게스트로 하기</button>
        <button >로그인 하기</button>
      </div>
      {/* 그 다음은 자동 로그인 처리 */}
      <ul>
        <li>게임시작</li>
        {/* 회원 로그인 시에만 */}
        <li>랭킹</li>
        <li>옵션</li>
        {/* pwa 에서만 있음 */}
        <li>종료</li>
      </ul>
    </div>
  );
};

export default Menu;