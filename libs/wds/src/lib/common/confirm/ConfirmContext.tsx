'use client';

import { ComponentProps, createContext, ReactNode, useContext, useRef, useState } from 'react';
import { Confirm } from './Confirm';

interface ConfirmServiceProps extends ComponentProps<typeof Confirm> {
  /** 확인 버튼 클릭 시 자동으로 모달을 닫을지 여부 */
  useAutoClose?: boolean;
}

const ConfirmationServiceContext = createContext<{
  openConfirm: (options: ConfirmServiceProps) => Promise<boolean>;
  setConfirmLoading: (loading: boolean) => void;
}>({
  openConfirm: () => Promise.resolve(false),
  setConfirmLoading: () => undefined,
});

export const useConfirm = () => useContext(ConfirmationServiceContext);

const initState: ConfirmServiceProps = {
  useAutoClose: true,
  isOpen: false,
  message: '',
};

/**
 * WDS Confirm 서비스 provider.
 * `const isConfirm = await openConfirm({ message: '...' })` 형태로 사용한다.
 */
export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
  const [confirmServiceState, setConfirmServiceState] = useState<ConfirmServiceProps>(initState);
  const awaitingPromiseRef = useRef<{ resolve: (value: boolean) => void } | undefined>(undefined);

  const openConfirm = (confirmProps: ConfirmServiceProps) => {
    setConfirmServiceState((prev) => ({
      ...prev,
      isOpen: true,
      ...confirmProps,
    }));

    return new Promise<boolean>((resolve) => {
      awaitingPromiseRef.current = { resolve };
    });
  };

  const onCancel = () => {
    awaitingPromiseRef.current?.resolve(false);
    setConfirmServiceState(initState);
  };

  const onConfirm = () => {
    awaitingPromiseRef.current?.resolve(true);
    if (confirmServiceState.useAutoClose) {
      setConfirmServiceState(initState);
    }
  };

  const setConfirmLoading = (loading: boolean) => {
    setConfirmServiceState((prev) => ({ ...prev, loading }));
    if (!loading) {
      setConfirmServiceState(initState);
    }
  };

  const providerValue = { openConfirm, setConfirmLoading };
  const { useAutoClose, ...confirmProps } = confirmServiceState;

  return (
    <>
      <ConfirmationServiceContext.Provider value={providerValue}>{children}</ConfirmationServiceContext.Provider>
      <Confirm onConfirm={onConfirm} onCancel={onCancel} {...confirmProps} />
    </>
  );
};
