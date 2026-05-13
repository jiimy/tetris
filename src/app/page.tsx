'use client';
import s from './page.module.scss';
import GameView from "@/components/gameView/GameView";

export default function Home() {
  return (
    <>
      <div className={s.content}>
        메인
        <GameView />
      </div>
    </>
  );
}
