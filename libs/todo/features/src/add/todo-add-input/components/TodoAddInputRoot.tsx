'use client';

import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { ChangeEvent, KeyboardEvent, UIEvent, useRef } from 'react';
import { FiCalendar, FiHash, FiPlus, FiX } from 'react-icons/fi';
import { TodoListKey } from '../../../_shared/types';
import { formatDueDate } from '../../../_shared/utils/formatDueDate';
import { getTodayKey } from '../../../_shared/utils/todoDate';
import { useTodoAddParser } from '../../_shared/hooks/useTodoAddParser';
import { buildHighlightSegments, type HighlightVariant } from '../../_shared/utils/buildHighlightSegments';

/** 입력창 표시 방식. inline 은 리스트 상단 상시 노출, overlay 는 Q 단축키로 떠오르는 큰 입력창 */
type TodoAddVariant = 'inline' | 'overlay';

interface Props {
  /** 현재 보고 있는 리스트 키 (기본 마감일/카테고리 결정에 사용) */
  listKey: TodoListKey;
  /**
   * 표시 방식. overlay 는 더 크고 배경과 구분되는 스타일을 쓴다
   * @default 'inline'
   */
  variant?: TodoAddVariant;
  /**
   * 마운트 시 입력창에 포커스를 줄지 여부
   * @default false
   */
  autoFocus?: boolean;
  /** 할 일이 실제로 추가된 뒤 호출. 오버레이 닫기 등에 사용 */
  onSubmitted?: () => void;
}

/**
 * 할 일 추가 입력창 본체.
 * 외부에서는 compound 컴포넌트 `TodoAddInput` 으로 사용한다.
 * "내일", "8월 25일" 같은 날짜 표현과 기존 카테고리 이름("업무", "#업무")을 감지해
 * 인라인 하이라이트하고 하단에 칩으로 노출한다.
 * 제출 시 감지된 토큰은 제목에서 제거되고 각각 마감일/카테고리로 설정된다.
 */
export const TodoAddInputRoot = ({ listKey, variant = 'inline', autoFocus = false, onSubmitted }: Props) => {
  const { text, dateToken, categoryToken, changeText, ignoreToken, submit } = useTodoAddParser(listKey);
  const mirrorRef = useRef<HTMLDivElement>(null);

  const isOverlay = variant === 'overlay';

  const highlightSegments = buildHighlightSegments(text, [
    ...(dateToken === null ? [] : [{ ...dateToken.token, variant: 'date' as HighlightVariant }]),
    ...(categoryToken === null ? [] : [{ ...categoryToken.token, variant: 'category' as HighlightVariant }]),
  ]);

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    changeText(e.target.value);
  };

  const handleInputScroll = (e: UIEvent<HTMLInputElement>) => {
    if (mirrorRef.current !== null) {
      mirrorRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) {
      return;
    }
    if (e.key === 'Enter' && submit()) {
      onSubmitted?.();
    }
  };

  const hasChip = dateToken !== null || categoryToken !== null;

  return (
    <div {...stylex.props(styles.container, isOverlay ? styles.containerOverlay : styles.containerInline)}>
      <div {...stylex.props(styles.inputRow, isOverlay ? styles.inputRowOverlay : styles.inputRowInline)}>
        <span {...stylex.props(styles.plusIcon)}>
          <FiPlus size={isOverlay ? 20 : 16} />
        </span>
        <div {...stylex.props(styles.inputWrapper)}>
          <div
            ref={mirrorRef}
            aria-hidden
            {...stylex.props(styles.mirror, isOverlay ? styles.typographyOverlay : styles.typographyInline)}
          >
            {highlightSegments.map(({ startIndex, text: segmentText, variant: segmentVariant }) =>
              segmentVariant === null ? (
                <span key={startIndex}>{segmentText}</span>
              ) : (
                <span
                  key={startIndex}
                  {...stylex.props(segmentVariant === 'date' ? styles.tokenHighlightDate : styles.tokenHighlightCategory)}
                >
                  {segmentText}
                </span>
              ),
            )}
          </div>
          <input
            autoFocus={autoFocus}
            placeholder='할 일 추가 — 예: 내일 업무 회의 준비'
            value={text}
            onChange={handleTextChange}
            onScroll={handleInputScroll}
            onKeyDown={handleInputKeyDown}
            {...stylex.props(styles.input, isOverlay ? styles.typographyOverlay : styles.typographyInline)}
          />
        </div>
      </div>
      {hasChip && (
        <div {...stylex.props(styles.chipRow, isOverlay ? styles.chipRowOverlay : styles.chipRowInline)}>
          {dateToken !== null && (
            <span {...stylex.props(styles.chip, styles.chipDate)}>
              <FiCalendar size={12} />
              {formatDueDate(dateToken.date, getTodayKey()).label}
              <button type='button' title='날짜 제거' onClick={() => ignoreToken(dateToken.token.text)} {...stylex.props(styles.chipRemoveButton)}>
                <FiX size={12} />
              </button>
            </span>
          )}
          {categoryToken !== null && (
            <span {...stylex.props(styles.chip, styles.chipCategory)}>
              <FiHash size={12} />
              {categoryToken.name}
              <button
                type='button'
                title='카테고리 제거'
                onClick={() => ignoreToken(categoryToken.token.text)}
                {...stylex.props(styles.chipRemoveButton)}
              >
                <FiX size={12} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

const styles = stylex.create({
  container: {
    transitionProperty: 'border-color',
    transitionDuration: '0.15s',
    transitionTimingFunction: 'ease',
  },
  containerInline: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: {
      default: colorVars['--color-borderSubtle'],
      ':focus-within': colorVars['--color-interactivePrimary'],
    },
    borderRadius: '0.8rem',
    backgroundColor: colorVars['--color-bgSurface'],
  },
  containerOverlay: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: {
      default: colorVars['--color-borderStrong'],
      ':focus-within': colorVars['--color-interactivePrimary'],
    },
    borderRadius: '1.2rem',
    backgroundColor: colorVars['--color-bgElevated'],
  },
  inputRow: {
    display: 'flex',
    alignItems: 'center',
  },
  inputRowInline: {
    gap: '0.8rem',
    paddingBlock: '0.9rem',
    paddingInline: '1.2rem',
  },
  inputRowOverlay: {
    gap: '1.2rem',
    paddingBlock: '1.6rem',
    paddingInline: '1.8rem',
  },
  plusIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    flexShrink: 0,
    color: colorVars['--color-textTertiary'],
  },
  inputWrapper: {
    position: 'relative',
    flex: 1,
    minWidth: 0,
  },
  mirror: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    whiteSpace: 'pre',
    color: 'transparent',
    pointerEvents: 'none',
  },
  /** 입력 텍스트와 mirror 의 글자 위치가 정확히 겹쳐야 하므로 동일한 타이포그래피를 적용한다. */
  typographyInline: {
    fontSize: '1.4rem',
    lineHeight: '2rem',
    fontFamily: 'inherit',
    letterSpacing: 'normal',
  },
  typographyOverlay: {
    fontSize: '1.7rem',
    lineHeight: '2.6rem',
    fontFamily: 'inherit',
    letterSpacing: 'normal',
  },
  tokenHighlightDate: {
    backgroundColor: colorVars['--color-brandLight'],
    borderRadius: '0.3rem',
  },
  tokenHighlightCategory: {
    backgroundColor: colorVars['--color-statusInfo'],
    borderRadius: '0.3rem',
  },
  input: {
    position: 'relative',
    display: 'block',
    width: '100%',
    borderWidth: 0,
    background: 'transparent',
    color: colorVars['--color-textPrimary'],
    outline: 'none',
    padding: 0,
    '::placeholder': {
      color: colorVars['--color-textTertiary'],
    },
  },
  chipRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },
  chipRowInline: {
    paddingTop: 0,
    paddingRight: '1.2rem',
    paddingBottom: '0.9rem',
    paddingLeft: '3.6rem',
  },
  chipRowOverlay: {
    paddingTop: 0,
    paddingRight: '1.8rem',
    paddingBottom: '1.4rem',
    paddingLeft: '5.4rem',
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    paddingBlock: '0.3rem',
    paddingInline: '0.6rem',
    borderRadius: '0.6rem',
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
    fontSize: '1.2rem',
    lineHeight: '1.6rem',
  },
  chipDate: {
    color: colorVars['--color-interactivePrimary'],
  },
  chipCategory: {
    color: colorVars['--color-statusInfo'],
  },
  chipRemoveButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: 0,
    borderWidth: 0,
    background: 'none',
    color: {
      default: colorVars['--color-textTertiary'],
      ':hover': colorVars['--color-textPrimary'],
    },
    cursor: 'pointer',
  },
});
