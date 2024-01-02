import styled from '@emotion/styled';
import { useRouter } from 'next/navigation';
import { ChipItemWithLink } from '../common/Chips/Item';
import RecentPostList from './RecentPostList';
import CategoryChips from './common/CategoryChips';
import { useHomeRouterProps } from './hooks/useHomeRouterProps';

const Home = () => {
  const { replace } = useRouter();
  const { categoryId } = useHomeRouterProps();

  const handleChipClick = (chip: ChipItemWithLink) => {
    replace(`/?category=${chip.value}`);
  };

  return (
    <SC.Container>
      <CategoryChips active_category={categoryId} onChipClick={handleChipClick} />
      <RecentPostList />
    </SC.Container>
  );
};

export default Home;

const SC = {
  Container: styled.div`
    margin-top: 2rem;
  `,
};
