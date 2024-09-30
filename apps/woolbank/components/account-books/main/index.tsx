import { AccountBookTabs } from './AccountBookTabs';
import MonthStatistics from './AccountList/MonthStatistics';
import { AccountBookActiveTab } from './account-book-active-tab/AccountBookActiveTab';
import { AddAccountBookButton } from './add-account-book-button/AddAccountBookButton';
import { Footer } from './footer/Footer';

/**
 * 가계부
 * @component
 */
const AccountBookListPage = () => {
  return (
    <>
      <MonthStatistics />
      <AccountBookTabs />
      <AccountBookActiveTab />
      <Footer />
      <AddAccountBookButton />
    </>
  );
};

export default AccountBookListPage;
