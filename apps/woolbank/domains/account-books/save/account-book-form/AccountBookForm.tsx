import { delay } from '@common';
import * as stylex from '@stylexjs/stylex';
import { colors, Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { type KeyboardEvent, type MouseEvent, useEffect, useRef, useState } from 'react';
import { Button } from '../../../../components/atom/Button';
import { IconTrashCan } from '../../../../components/atom/Icon';
import { IconCalendar } from '../../../../components/atom/Icon/Calendar';
import { IconChevronRight } from '../../../../components/atom/Icon/ChevronRight';
import { IconSwap } from '../../../../components/atom/Icon/Swap';
import { useConfirm } from '../../../../components/Confirm/ConfirmContext';
import { ToggleTab } from '../../../../components/toggle-tab/ToggleTab';
import { useUserInfo } from '../../../../hooks/queries/useUserInfo';
import { useToast } from '../../../../hooks/useToast';
import getCategoryMsg from '../../../../utils/account-books';
import { useAccountBookSaveRouterProps } from '../_common/hooks/useAccountBookSaveRouterProps';
import {
  type AccountBookSaveForm,
  type ScheduledPaymentType,
  useAccountBookForm,
} from './_common/hooks/useAccountBookForm';
import { FormField } from './form-field/FormField';
import { FormInput } from './form-field/FormInput';
import { Switch } from './form-field/Switch';
import { FormModal } from './form-modal/FormModal';

const TAB_LIST = [
  {
    type: 'income',
    name: '수입',
  },
  {
    type: 'expenditure',
    name: '지출',
  },
];

const SCHEDULED_PAYMENT_LABEL_MAPPER: Record<ScheduledPaymentType, string> = { repeat: '매월', installment: '할부' };

interface Props {
  accountBookForm?: AccountBookSaveForm;
  submitForm: (accountForm: AccountBookSaveForm) => void;
  removeAccountBookForm: (id: string) => void;
}

const styles = stylex.create({
  form: {
    marginTop: '3rem',
    paddingBlock: 0,
    paddingInline: '1.6rem',
  },
  contentWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    gap: '1rem',
  },
  centerBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
  },
  svgIcon: {
    display: 'inline-flex',
    marginBottom: '2px',
  },
  formSection: {
    marginTop: '4rem',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  toggleWrapper: {
    width: '120px',
    marginBottom: '2rem',
  },
  titleAmount: {
    marginBlock: '3rem',
    marginInline: 0,
    fontSize: '4rem',
  },
  memoWrapper: {
    height: '15rem',
    width: '100%',
  },
  memo: {
    borderRadius: '1.3rem',
    backgroundColor: colorVars['--color-gray100'],
    height: '15rem',
    paddingBlock: '1.6rem',
    paddingInline: '1.6rem',
    width: 'calc(100% - 3.2rem)',
    borderStyle: 'none',
  },
  formContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBlock: '1.6rem',
    paddingInline: 0,
  },
  buttonArea: {
    position: 'fixed',
    bottom: 'calc(env(safe-area-inset-bottom) + 2rem)',
    width: '100%',
    height: '5.5rem',
    zIndex: 100,
    left: 0,
  },
  bottomWrapper: {
    display: 'flex',
    gap: '0.8rem',
    paddingBlock: 0,
    paddingInline: '1.6rem',
  },
});

export const AccountBookForm = ({ accountBookForm, submitForm, removeAccountBookForm }: Props) => {
  const {
    formData,
    isActiveSubmit,
    onChange,
    setAmount,
    setType,
    validateForm,
    setAccountBookCategoryType,
    setRegisterDateTime,
    setScheduledPayment,
    toggleDisabledBudget,
    onClear,
  } = useAccountBookForm(accountBookForm);
  const { openConfirm } = useConfirm();
  const { onToast } = useToast();
  const { isShareUser } = useUserInfo();
  const { is_insert_mode: isInsertMode } = useAccountBookSaveRouterProps();
  const [openModalName, setModalName] = useState('');
  const title_ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isInsertMode) {
      setModalName('amount');
    }
  }, [isInsertMode]);

  const handleClearClick = (e: MouseEvent<HTMLLIElement>) => {
    const type = e.currentTarget.dataset.type || '';
    onClear(type as keyof AccountBookSaveForm);
  };

  const handleSubmitClick = () => {
    const { isValid, message } = validateForm();

    if (!formData) {
      return;
    }

    if (!isValid) {
      onToast(message);
      return;
    }

    submitForm(formData);
  };

  const handleAmountClick = (amount: number) => {
    setAmount(amount);
    if (isInsertMode && formData.title === '') {
      title_ref.current?.focus();
    }
  };

  const handleTitleKeyDownEnter = async (e: KeyboardEvent<HTMLInputElement>) => {
    const isKeyboardEnter = e.key === 'Enter';
    const isAvailOpenModal = isInsertMode && formData.category.name === '';

    if (isKeyboardEnter && isAvailOpenModal) {
      title_ref.current?.blur();
      await delay(400);
      setModalName('category');
    }
  };

  const handleRemoveClick = async () => {
    if (!accountBookForm?.id) {
      return;
    }

    const isConfirm = await openConfirm({ message: '정말 삭제 하시겠습니까?' });

    if (isConfirm) {
      removeAccountBookForm(String(accountBookForm.id));
    }
  };

  const openFormBottomSheet = (type: 'registerDateTime' | 'amount' | 'category' | 'scheduled') => () => {
    setModalName(type);
  };

  const closeModal = () => {
    setModalName('');
  };

  const typeMsg = getCategoryMsg(formData.type);
  const isUpdateForm = !accountBookForm;

  return (
    <>
      <main {...stylex.props(styles.form)}>
        <div {...stylex.props(styles.content)}>
          <div {...stylex.props(styles.toggleWrapper)}>
            <ToggleTab size='small' tabs={TAB_LIST} value={formData.type} onChangeTab={setType} />
          </div>
          <div {...stylex.props(styles.centerBox)} onClick={openFormBottomSheet('registerDateTime')}>
            <Text variant='body3' color='gray600' as='p'>
              {formData.registerDateTime.format('YYYY-MM-DD')}
            </Text>
            <span {...stylex.props(styles.svgIcon)}>
              <IconCalendar width={12} height={12} fill={colors.gray500} />
            </span>
          </div>
          <Text
            variant='title1Bold'
            color='gray900'
            onClick={openFormBottomSheet('amount')}
            as='p'
            xstyle={styles.titleAmount}
          >
            {`${formData.amount.toLocaleString('ko-KR')}원`}
          </Text>
        </div>
        <div {...stylex.props(styles.formSection)}>
          <FormField title={`${typeMsg}처`}>
            <FormInput
              ref={title_ref}
              name='title'
              disable={isShareUser}
              placeholder={`${typeMsg}처를 선택해 주세요.`}
              maxLength={20}
              value={formData.title}
              onChange={onChange}
              onClear={handleClearClick}
              onKeyDown={handleTitleKeyDownEnter}
              enterKeyHint='done'
            />
          </FormField>
          <FormField title='카테고리' onClick={openFormBottomSheet('category')}>
            <div {...stylex.props(styles.formContent)}>
              <Text variant='body1' color='gray900'>
                {formData.category.name}
              </Text>
              <IconChevronRight width={16} height={16} fill={colors.gray600} />
            </div>
          </FormField>
          <FormField title='예산에서 제외'>
            <div {...stylex.props(styles.contentWrapper)}>
              <Switch checked={formData.isDisabledBudget} onClick={toggleDisabledBudget} />
            </div>
          </FormField>
          <FormField
            title={
              formData.scheduledPaymentType
                ? SCHEDULED_PAYMENT_LABEL_MAPPER[formData.scheduledPaymentType]
                : '반복/할부'
            }
            onClick={isInsertMode ? openFormBottomSheet('scheduled') : undefined}
          >
            <div {...stylex.props(styles.contentWrapper)}>
              {formData.scheduledPaymentDay && (
                <Text variant='body3' color='red500'>
                  {formData.scheduledPaymentType === 'repeat' && `${formData.scheduledPaymentDay}일`}
                  {formData.scheduledPaymentType === 'installment' &&
                    `매월${formData.installmentMonth}일 (1/${formData.scheduledPaymentDay})`}
                </Text>
              )}
              {isInsertMode && <IconSwap width={16} height={16} fill={colors.gray500} />}
            </div>
          </FormField>
          <FormField title='메모' />
          <textarea
            {...stylex.props(styles.memo)}
            name='memo'
            value={formData.memo}
            tabIndex={-1}
            maxLength={100}
            onChange={onChange}
          />
        </div>
        {!isShareUser && (
          <footer {...stylex.props(styles.buttonArea)}>
            <div {...stylex.props(styles.bottomWrapper)}>
              {!isUpdateForm && (
                <Button variant='tertiaryGray' onClick={handleRemoveClick} disabled={!isActiveSubmit}>
                  <IconTrashCan />
                </Button>
              )}
              <Button fill onClick={handleSubmitClick} disabled={!isActiveSubmit}>
                {isUpdateForm ? '작성하기' : '수정하기'}
              </Button>
            </div>
          </footer>
        )}
      </main>
      <FormModal
        openModalName={openModalName}
        formData={formData}
        onCloseModal={closeModal}
        onChangeAmount={handleAmountClick}
        onChangeCategory={setAccountBookCategoryType}
        onChangeDateTime={setRegisterDateTime}
        onChangeScheduledPayment={setScheduledPayment}
      />
    </>
  );
};
