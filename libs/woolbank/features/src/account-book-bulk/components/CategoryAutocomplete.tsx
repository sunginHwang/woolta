'use client';

import * as stylex from '@stylexjs/stylex';
import { colorVars, shadowVars, zIndexConsts } from '@wds/tokens.stylex';
import { useMemo, useRef, useState } from 'react';
import type { AccountBookCategory } from '../../account-book-form/_common/hooks/useAccountBookCategories';

interface Props {
  /** 선택된 카테고리 id. 미지정이면 null */
  value: number | null;
  /** 이 행의 수입/지출 — 해당 타입의 카테고리만 고를 수 있다 */
  type: 'EXPENDITURE' | 'INCOME';
  categories: AccountBookCategory[];
  onSelect: (categoryId: number) => void;
  /**
   * 키보드로 선택을 확정했을 때 호출된다. 다음 행으로 넘어가는 데 쓴다.
   * 마우스 클릭에서는 부르지 않는다 — 마우스를 쓰는 중이라면 포커스가 멋대로 움직이는 게 방해가 된다.
   */
  onKeyboardCommit?: () => void;
  /** 포커스 이동을 위해 호스트가 붙이는 식별자 */
  inputProps?: Record<string, string | number>;
}

const styles = stylex.create({
  root: {
    position: 'relative',
    minWidth: 0,
  },
  /**
   * 표 안에서는 뒤쪽 행이 나중에 그려져, 앞 행의 드롭다운이 아래 행 입력칸에 가려진다.
   * (목록에 z-index 를 줘도 셀 자체가 쌓임 맥락을 만들지 않아 소용없다)
   * 열려 있는 동안만 셀을 끌어올려 해결한다.
   */
  rootOpen: {
    zIndex: zIndexConsts.layer,
  },
  input: {
    width: '100%',
    paddingBlock: '0.5rem',
    paddingInline: '0.7rem',
    borderWidth: '0.1rem',
    borderStyle: 'solid',
    borderColor: {
      default: colorVars['--color-borderSubtle'],
      ':focus-visible': colorVars['--color-interactivePrimary'],
    },
    borderRadius: '0.6rem',
    backgroundColor: colorVars['--color-bgSurface'],
    color: colorVars['--color-textPrimary'],
    fontSize: '1.2rem',
    outline: 'none',
  },
  // 미지정 행은 눈에 띄어야 한다 — 등록을 막는 유일한 조건이다
  inputEmpty: {
    borderColor: colorVars['--color-statusWarning'],
  },
  list: {
    position: 'absolute',
    top: 'calc(100% + 0.2rem)',
    left: 0,
    right: 0,
    zIndex: zIndexConsts.layer,
    maxHeight: '18rem',
    overflowY: 'auto',
    listStyle: 'none',
    marginBlock: 0,
    marginInline: 0,
    padding: '0.3rem',
    borderWidth: '0.1rem',
    borderStyle: 'solid',
    borderColor: colorVars['--color-borderSubtle'],
    borderRadius: '0.8rem',
    backgroundColor: colorVars['--color-bgSurface'],
    // 하드코딩하면 다크 오버라이드(흰 1px 링이 더해진 그림자)를 못 받는다
    boxShadow: shadowVars['--shadow-popover'],
  },
  option: {
    display: 'block',
    width: '100%',
    paddingBlock: '0.6rem',
    paddingInline: '0.8rem',
    borderWidth: 0,
    borderStyle: 'none',
    borderRadius: '0.6rem',
    background: 'none',
    color: colorVars['--color-textSecondary'],
    fontSize: '1.2rem',
    textAlign: 'left',
    cursor: 'pointer',
  },
  optionActive: {
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
    color: colorVars['--color-textPrimary'],
  },
  empty: {
    paddingBlock: '0.8rem',
    paddingInline: '0.8rem',
    color: colorVars['--color-textTertiary'],
    fontSize: '1.2rem',
  },
});

/**
 * 카테고리 자동완성.
 *
 * 벌크 편집에서 카테고리 고르기가 가장 손이 많이 가는 일이라 키보드만으로 끝낼 수 있게 한다:
 * 타이핑으로 좁히고 → ↓/↑ 또는 → 로 후보를 고르고 → Enter 로 확정한다.
 * 확정하면 호스트가 다음 행 제목으로 포커스를 넘긴다.
 */
export const CategoryAutocomplete = ({ value, type, categories, onSelect, onKeyboardCommit, inputProps }: Props) => {
  const [keyword, setKeyword] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const typeCategories = useMemo(() => categories.filter((category) => category.type === type), [categories, type]);

  const selected = typeCategories.find((category) => Number(category.id) === value) ?? null;

  const matched = useMemo(() => {
    const trimmed = keyword.trim();
    return trimmed === ''
      ? typeCategories
      : typeCategories.filter((category) => category.name.toLowerCase().includes(trimmed.toLowerCase()));
  }, [typeCategories, keyword]);

  const commit = (categoryId: number, isKeyboard: boolean) => {
    onSelect(categoryId);
    setKeyword('');
    setIsOpen(false);

    if (isKeyboard) {
      onKeyboardCommit?.();
    }
  };

  const moveActive = (delta: number) => {
    setIsOpen(true);
    setActiveIndex((prev) => Math.max(0, Math.min(matched.length - 1, prev + delta)));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) {
      return;
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      moveActive(e.key === 'ArrowDown' ? 1 : -1);
      return;
    }

    /**
     * → 로도 후보를 고를 수 있게 한다("지원" 입력 → → → Enter).
     * 단 **캐럿이 끝에 있을 때만** 가로챈다 — 항상 가로채면 입력한 글자 사이를 커서로 못 옮긴다.
     */
    if (e.key === 'ArrowRight') {
      const input = e.currentTarget;
      const isCaretAtEnd = input.selectionStart === input.value.length && input.selectionStart === input.selectionEnd;

      if (isCaretAtEnd) {
        e.preventDefault();
        moveActive(isOpen ? 1 : 0);
      }
      return;
    }

    if (e.key === 'Enter' && isOpen && matched[activeIndex]) {
      e.preventDefault();
      commit(Number(matched[activeIndex].id), true);
      return;
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div {...stylex.props(styles.root, isOpen && styles.rootOpen)}>
      <input
        {...inputProps}
        {...stylex.props(styles.input, value === null && styles.inputEmpty)}
        // 선택된 값이 있으면 그 이름을 보여주고, 타이핑을 시작하면 검색어로 바뀐다
        value={isOpen ? keyword : (selected?.name ?? '')}
        placeholder='카테고리'
        onFocus={() => {
          setKeyword('');
          setActiveIndex(0);
          setIsOpen(true);
        }}
        onChange={(e) => {
          setKeyword(e.target.value);
          setActiveIndex(0);
          setIsOpen(true);
        }}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          // 옵션 클릭이 blur 보다 먼저 죽지 않도록 한 틱 미룬다
          blurTimer.current = setTimeout(() => setIsOpen(false), 120);
        }}
      />
      {isOpen && (
        <ul {...stylex.props(styles.list)}>
          {matched.length === 0 ? (
            <li {...stylex.props(styles.empty)}>일치하는 카테고리가 없어요</li>
          ) : (
            matched.map((category, index) => (
              <li key={category.id}>
                <button
                  type='button'
                  {...stylex.props(styles.option, index === activeIndex && styles.optionActive)}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={() => {
                    // blur 보다 먼저 실행돼야 선택이 유실되지 않는다
                    if (blurTimer.current) {
                      clearTimeout(blurTimer.current);
                    }
                  }}
                  onClick={() => commit(Number(category.id), false)}
                >
                  {category.name}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};
