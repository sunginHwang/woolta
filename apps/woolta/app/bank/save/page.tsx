export const dynamic = 'force-dynamic';

import { AccountBookSaveScreen, WoolbankScreensProvider } from '@woolta/woolbank-screens';

export default function BankSavePage() {
  return (
    <WoolbankScreensProvider>
      <AccountBookSaveScreen />
    </WoolbankScreensProvider>
  );
}
