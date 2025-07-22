import { Text } from '@wds';
import { FC, PropsWithChildren } from 'react';
import { SubLabelText } from './SubLabelText';

const _LabelText: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Text variant='title2Medium' color='red500' as='p' mb={20}>
      {children}
    </Text>
  );
};

export const LabelText = Object.assign(_LabelText, {
  Sub: SubLabelText,
});
