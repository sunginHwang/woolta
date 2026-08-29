'use client';

import { delay, useIsDashboardHost } from '@common';
import * as stylex from '@stylexjs/stylex';
import { grayTertiary, Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { typographyStyles } from '@wds/typography.stylex';
import { type ChangeEvent, type KeyboardEvent, type MouseEvent, useEffect, useRef, useState } from 'react';
import { Button } from '../_shared/components/button/Button';
import { ToggleTab } from '../_shared/components/toggle-tab/ToggleTab';
import { useConfirm } from '../_shared/confirm/ConfirmContext';
import { useUserInfo } from '../_shared/hooks/useUserInfo';
import { IconCalendar, IconChevronRight, IconSwap, IconTrashCan } from '../_shared/icons';
import { useToast } from '../_shared/toast/useToast';
import getCategoryMsg from '../_shared/utils/account-books';
import {
  type AccountBookSaveForm,
  type ScheduledPaymentType,
  useAccountBookForm,
} from './_common/hooks/useAccountBookForm';
import { useAccountBookSaveRouterProps } from './_common/hooks/useAccountBookSaveRouterProps';
import { FormField } from './form-field/FormField';
import { FormInput } from './form-field/FormInput';
import { Switch } from './form-field/Switch';
import { FormModal } from './form-modal/FormModal';

const styles = stylex.create({
  form: {
    paddingBlock: 0,
    paddingInline: '1.6rem',
  },
  formDashboard: { marginTop: 0 },
  formDefault: { marginTop: '3rem' },
  // 원본의 `> div + div { margin-top: 4rem }` — 두 번째 div(필드 블록)에 직접 준다
  fieldsBlock: { marginTop: '4rem' },
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
  // 원본의 `.center-box svg { margin-bottom: 2px }`
  centerBoxIcon: { marginBottom: '2px' },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  toggle: {
    width: '120px',
    marginBottom: '2rem',
  },
  title: {
    marginBlock: '3rem',
    marginInline: 0,
    fontSize: '4rem',
  },
  amountRow: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: '0.2rem',
  },
  amountInput: {
    minWidth: '1ch',
    maxWidth: '100%',
    borderStyle: 'none',
    background: 'transparent',
    textAlign: 'right',
    color: colorVars['--color-textPrimary'],
    caretColor: colorVars['--color-orangePrimary'],
    '::placeholder': { color: colorVars['--color-textDisabled'] },
  },
  memo: {
    borderRadius: '1.3rem',
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
    height: '15rem',
    padding: '1.6rem',
    width: '100%',
    boxSizing: 'border-box',
    borderStyle: 'none',
    color: colorVars['--color-textPrimary'],
  },
  formContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBlock: '1.6rem',
    paddingInline: 0,
  },
  buttonArea: {
    position: 'sticky',
    bottom: 0,
    width: '100%',
    height: '5.5rem',
    zIndex: 100,
  },
  bottomWrapper: {
    display: 'flex',
    gap: '0.8rem',
  },
});

const dynamicStyles = stylex.create({
  amountWidth: (ch: number) => ({ width: `${ch}ch` }),
});

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

export const AccountBookForm = ({ accountBookForm, submitForm, removeAccountBookForm }: Props) => {
  const {
    formData,
    isActiveSubmit,
    isFormChanged,
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
  const isDashboardHost = useIsDashboardHost();

  // 대시보드에서는 바텀시트 대신 금액을 인라인 input 으로 직접 입력한다
  const handleAmountInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/[^0-9]/g, '').slice(0, 12);
    setAmount(digits === '' ? 0 : Number(digits));
  };

  const amountDisplayLength = formData.amount === 0 ? 1 : formData.amount.toLocaleString('ko-KR').length;
  const { is_insert_mode: isInsertMode } = useAccountBookSaveRouterProps();
  // 대시보드 패널은 URL 쿼리가 없어 isInsertMode 가 항상 true 이므로, 작성 여부는 초기 폼 유무로 판단한다
  const isCreateForm = !accountBookForm;
  const [openModalName, setModalName] = useState('');
  const title_ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 대시보드에서는 금액을 인라인 input 으로 받으므로 금액 바텀시트를 자동으로 열지 않는다
    if (isInsertMode && !isDashboardHost) {
      setModalName('amount');
    }
  }, [isInsertMode, isDashboardHost]);

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

  // 원본 앱의 "금액 시트 완료 → 지출처 포커스" 연속 흐름을 인라인 input 의 Enter 로 재현한다.
  // keydown 에서 포커스를 옮기면 이어지는 keyup 이 지출처 FormInput 에 전달되어
  // 내부 Enter-blur 로직이 포커스를 즉시 해제하므로, keyup 시점에 옮긴다.
  const handleAmountKeyUpEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') {
      return;
    }
    if (isCreateForm) {
      title_ref.current?.focus();
      return;
    }
    e.currentTarget.blur();
  };

  // AOS에서는 이 이벤트 가 동작하지 않는다 (IOS키보드 오픈)
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

  return (
    <>
      <main {...stylex.props(styles.form, isDashboardHost ? styles.formDashboard : styles.formDefault)}>
        <div {...stylex.props(styles.content)}>
          <div {...stylex.props(styles.toggle)}>
            <ToggleTab size='small' tabs={TAB_LIST} value={formData.type} onChangeTab={setType} />
          </div>
          <div {...stylex.props(styles.centerBox)} onClick={openFormBottomSheet('registerDateTime')}>
            <Text variant='body3' color='textTertiary' as='p'>
              {formData.registerDateTime.format('YYYY-MM-DD')}
            </Text>
            <IconCalendar width={12} height={12} fill={grayTertiary} {...stylex.props(styles.centerBoxIcon)} />
          </div>
          {isDashboardHost ? (
            <div {...stylex.props(styles.amountRow)}>
              <input
                inputMode='numeric'
                placeholder='0'
                autoFocus={isCreateForm}
                enterKeyHint='next'
                value={formData.amount === 0 ? '' : formData.amount.toLocaleString('ko-KR')}
                onChange={handleAmountInputChange}
                onKeyUp={handleAmountKeyUpEnter}
                {...stylex.props(
                  typographyStyles.title1Bold,
                  styles.amountInput,
                  dynamicStyles.amountWidth(Math.max(1, amountDisplayLength)),
                )}
              />
              <Text variant='title1Bold' color='textPrimary'>
                원
              </Text>
            </div>
          ) : (
            <Text
              xstyle={styles.title}
              variant='title1Bold'
              color='textPrimary'
              onClick={openFormBottomSheet('amount')}
              as='p'
            >
              {`${formData.amount.toLocaleString('ko-KR')}원`}
            </Text>
          )}
        </div>
        <div {...stylex.props(styles.fieldsBlock)}>
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
              <Text variant='body1' color='textPrimary'>
                {formData.category.name}
              </Text>
              <IconChevronRight width={16} height={16} fill={grayTertiary} />
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
              {isInsertMode && <IconSwap width={16} height={16} fill={grayTertiary} />}
            </div>
          </FormField>
          <FormField title='메모' />
          <textarea
            name='memo'
            value={formData.memo}
            tabIndex={-1}
            maxLength={100}
            onChange={onChange}
            {...stylex.props(styles.memo)}
          />
        </div>
        {!isShareUser && (
          <footer {...stylex.props(styles.buttonArea)}>
            <div {...stylex.props(styles.bottomWrapper)}>
              {!isCreateForm && (
                <Button variant='tertiaryGray' onClick={handleRemoveClick} disabled={!isActiveSubmit}>
                  <IconTrashCan />
                </Button>
              )}
              {/* 수정 폼은 실제 변경이 있을 때만 제출 가능하다 */}
              <Button fill onClick={handleSubmitClick} disabled={!isActiveSubmit || !isFormChanged}>
                {isCreateForm ? '작성하기' : '수정하기'}
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
