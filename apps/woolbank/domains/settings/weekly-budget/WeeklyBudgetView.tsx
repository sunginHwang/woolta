'use client';

import * as stylex from '@stylexjs/stylex';
import { Chip, ChipGroup, FixedBottomCTA, Header, IconInfoCircle, Text, TextInput } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { formatWon, parseWon } from '@woolta/woolbank-features';
import { type ChangeEvent, useState } from 'react';

export interface WeeklyBudgetViewProps {
  /** 저장돼 있는 예산(원). 0 이면 미설정 */
  initialAmount: number;
  /** 저장 요청 진행 중 */
  isSaving: boolean;
  /** 공유코드 세션은 예산을 바꿀 수 없다 */
  isShareUser: boolean;
  onSave: (amount: number) => void;
  onBackClick: () => void;
}

/** 프리셋 칩 — 30/45/50/70/100만원 */
const PRESET_AMOUNTS = [300_000, 450_000, 500_000, 700_000, 1_000_000];

const formatPresetLabel = (amount: number) => `${amount / 10_000}만원`;

const styles = stylex.create({
  main: {
    // FIXED_BOTTOM_CTA_HEIGHT(9.6rem)와 같다 — stylex.create 안에서는 import 상수를 쓸 수 없어 리터럴로 둔다
    paddingBottom: '9.6rem',
  },
  intro: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    paddingTop: '2.4rem',
    paddingInline: '1.6rem',
  },
  field: {
    paddingTop: '3.2rem',
    paddingInline: '1.6rem',
  },
  amountInput: {
    fontSize: '2.8rem',
    lineHeight: '3.6rem',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    fontVariantNumeric: 'tabular-nums',
  },
  unit: {
    color: colorVars['--color-textSecondary'],
  },
  presets: {
    paddingTop: '2rem',
  },
  presetsInner: {
    paddingInline: '1.6rem',
  },
  noticeWrap: {
    paddingTop: '3.2rem',
    paddingInline: '1.6rem',
  },
  notice: {
    display: 'flex',
    gap: '1.2rem',
    padding: '1.6rem',
    borderRadius: '1.2rem',
    backgroundColor: colorVars['--color-fillSubtle'],
  },
  noticeIcon: {
    flexShrink: 0,
    marginTop: '0.1rem',
    color: colorVars['--color-textSecondary'],
  },
  noticeLines: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
});

/**
 * 설정 › 주간 예산 — 금액 입력 + 프리셋 + 안내 + 저장 CTA. 입력 상태만 안에서 들고, 저장은 props 로 올린다.
 * @component
 */
export const WeeklyBudgetView = ({
  initialAmount,
  isSaving,
  isShareUser,
  onSave,
  onBackClick,
}: WeeklyBudgetViewProps) => {
  const [amount, setAmount] = useState(initialAmount);

  const perDay = amount > 0 ? Math.round(amount / 7) : 0;
  const helpText = amount > 0 ? `하루 약 ${formatWon(perDay)}씩 쓸 수 있어요` : '금액을 입력해 주세요';
  const isChanged = amount !== initialAmount;
  const canSave = !isShareUser && isChanged && amount > 0;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAmount(parseWon(event.target.value));
  };

  return (
    <>
      <Header.Sub title='주간 예산' onBackClick={onBackClick} />
      <main {...stylex.props(styles.main)}>
        <section {...stylex.props(styles.intro)}>
          <Text variant='title2Bold' as='h2'>
            한 주에 얼마나 쓸까요?
          </Text>
          <Text variant='body3' color='textSecondary' as='p'>
            정해 두면 가계부 첫 화면에서 남은 금액을 바로 볼 수 있어요
          </Text>
        </section>

        <section {...stylex.props(styles.field)}>
          <TextInput
            label='일주일 예산'
            variant='underline'
            size='large'
            inputMode='numeric'
            value={amount > 0 ? amount.toLocaleString('ko-KR') : ''}
            placeholder='0'
            clearable={false}
            description={helpText}
            suffix={
              <Text variant='title2Bold' xstyle={styles.unit}>
                원
              </Text>
            }
            inputXstyle={styles.amountInput}
            disabled={isShareUser}
            onChange={handleChange}
          />
        </section>

        <section aria-label='예산 빠르게 고르기' {...stylex.props(styles.presets)}>
          <ChipGroup layout='scroll' xstyle={styles.presetsInner}>
            {PRESET_AMOUNTS.map((preset) => (
              <Chip
                key={preset}
                label={formatPresetLabel(preset)}
                variant='outlineWeak'
                size='medium'
                selected={preset === amount}
                disabled={isShareUser}
                onClick={() => setAmount(preset)}
              />
            ))}
          </ChipGroup>
        </section>

        <section {...stylex.props(styles.noticeWrap)}>
          <div {...stylex.props(styles.notice)}>
            <IconInfoCircle size={20} xstyle={styles.noticeIcon} />
            <div {...stylex.props(styles.noticeLines)}>
              <Text variant='body4Regular' color='textSecondary' as='p'>
                예산은 매주{' '}
                <Text variant='body4Bold' color='textPrimary'>
                  월요일
                </Text>
                에 새로 시작해요
              </Text>
              <Text variant='body4Regular' color='textSecondary' as='p'>
                적금·보험 같은 정기지출은 예산에서 빼고 계산해요
              </Text>
            </div>
          </div>
        </section>
      </main>

      <FixedBottomCTA
        disabled={!canSave}
        loading={isSaving}
        note={isShareUser ? '공유 계정은 예산을 바꿀 수 없어요' : undefined}
        onClick={() => onSave(amount)}
      >
        저장하기
      </FixedBottomCTA>
    </>
  );
};
