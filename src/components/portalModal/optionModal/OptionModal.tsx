import React from 'react';
import ModalFrame from '../ModalFrame';
import classNames from 'classnames';
import { ChildrenModalType } from '@/types/modal';

const OptionModal = ({
  setOnModal,
  dimClick,
  isDim = false,
  className,
  children
}: ChildrenModalType) => {

  return (
    <ModalFrame
      setOnModal={setOnModal}
      isDim={isDim}
      onClose
      dimClick={dimClick}
    >
      <div>
        <strong>단계 조절</strong>
        {/* 1단계부터 10단계까지 */}
        <span>1단계</span>
      </div>
      <div>
        <strong>모드</strong>
        
      </div>
    </ModalFrame>
  );
};

export default OptionModal;