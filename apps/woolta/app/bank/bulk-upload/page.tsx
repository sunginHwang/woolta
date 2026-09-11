export const dynamic = 'force-dynamic';

import { AccountBookBulkUploadScreen, WoolbankScreensProvider } from '@woolta/woolbank-screens';

export default function BankBulkUploadPage() {
  return (
    <WoolbankScreensProvider>
      <AccountBookBulkUploadScreen />
    </WoolbankScreensProvider>
  );
}
