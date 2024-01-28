import { FC, PropsWithChildren } from 'react';
import ReactDOM from 'react-dom';

interface Props extends PropsWithChildren {
  targetId: string;
}

/**
 * Portal 공통 사용 컴포넌트
 * @component
 */
export const Portal: FC<Props> = ({ targetId, children }) => {
  if (typeof window === 'undefined') {
    return null;
  }

  const targetNode = document.getElementById(targetId);

  if (!targetNode) {
    return null;
  }

  return ReactDOM.createPortal(children, targetNode);
};
