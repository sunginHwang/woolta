import { Text, typography } from '@wds';
import { Dayjs } from 'dayjs';
import { styled } from 'styled-components';
import BottomSheet from '../../../../../components/BotttomSheet';

export interface AccountBookSheetItem {
  title: string;
  amount: number;
  registerDateTime: Dayjs;
  iconImageUrl?: string;
}

interface Props {
  title: string;
  titleColor: string;
  list: AccountBookSheetItem[];
  isOpen: boolean;
  onClose: () => void;
}

export const AccountBookBottomSheet = ({ isOpen, title, titleColor, list, onClose }: Props) => {
  return (
    <BottomSheet visible={isOpen} oncloseModal={onClose} contentHeight={600}>
      <S.CategoryBottomSheet>
        <S.Title color={titleColor}>{title}</S.Title>
        <S.List>
          {list.map(({ title, amount, iconImageUrl, registerDateTime }, key) => (
            <S.Item key={key}>
              <div className='left'>
                {iconImageUrl && (
                  <S.IconWrapper>
                    <img src={iconImageUrl} alt={`${title}_아이콘`} />
                  </S.IconWrapper>
                )}
                <div className='info'>
                  <Text variant='body3' color='gray700'>
                    {title}
                  </Text>
                  <Text variant='small1Regular' color='gray400'>
                    {registerDateTime.format('MM-DD')}
                  </Text>
                </div>
              </div>
              <Text variant='body2' color='gray800'>
                {amount.toLocaleString('ko-KR')}원
              </Text>
            </S.Item>
          ))}
        </S.List>
      </S.CategoryBottomSheet>
    </BottomSheet>
  );
};

const S = {
  IconWrapper: styled.div`
    width: 30px;
    height: 30px;
    background-color: ${({ theme }) => theme.colors.red150};
    border-radius: 30px;
    margin-right: 10px;

    img {
      width: 20px;
      height: 20px;
      margin: 5px;
    }
  `,
  CategoryBottomSheet: styled.div`
    padding: 2rem 2rem 0;
  `,
  Title: styled.h3<{
    color: string;
  }>`
    text-align: left;
    ${typography.title3Medium}
    margin-bottom: 1.5rem;
    color: ${({ color }) => color};
  `,
  List: styled.ul`
    margin-bottom: 2rem;
    max-height: 40rem;
    overflow-y: scroll;
    & > * + * {
      margin-top: 1rem;
    }
  `,
  Item: styled.li`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    color: ${({ theme }) => theme.colors.gray700};

    .left {
      display: flex;
      flex-direction: row;
      align-items: center;

      .info {
        display: flex;
        flex-direction: column;
      }
    }
  `,
};
