import { Text } from '@wds';
import { FC, PropsWithChildren } from 'react';

export const SubLabelText: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Text variant='small1Regular' color='gray700' as='p' mb={25} mt={-10}>
      {children}
    </Text>
  );
};
