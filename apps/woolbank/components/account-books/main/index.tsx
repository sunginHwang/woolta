import { AccountBookActiveTab } from './account-book-active-tab/AccountBookActiveTab';
import { AccountBookTabs } from './AccountBookTabs';
import MonthStatistics from './AccountList/MonthStatistics';
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
      <main>
        <AccountBookTabs />
        <AccountBookActiveTab />
      </main>
      <Footer />
      <AddAccountBookButton />
    </>
  );
};

export default AccountBookListPage;
