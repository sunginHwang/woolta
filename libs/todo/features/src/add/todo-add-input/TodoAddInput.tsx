'use client';

import { ChangeEvent, KeyboardEvent, UIEvent, useRef } from 'react';
import { FiCalendar, FiHash, FiPlus, FiX } from 'react-icons/fi';
import { css, styled } from 'styled-components';
import { TodoListKey } from '../../_shared/types';
import { formatDueDate } from '../../_shared/utils/formatDueDate';
import { getTodayKey } from '../../_shared/utils/todoDate';
import { useTodoAddParser } from '../_shared/hooks/useTodoAddParser';
import { buildHighlightSegments, type HighlightVariant } from '../_shared/utils/buildHighlightSegments';

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
 * 할 일 추가 입력창.
 * "내일", "8월 25일" 같은 날짜 표현과 기존 카테고리 이름("업무", "#업무")을 감지해
 * 인라인 하이라이트하고 하단에 칩으로 노출한다.
 * 제출 시 감지된 토큰은 제목에서 제거되고 각각 마감일/카테고리로 설정된다.
 */
export const TodoAddInput = ({ listKey, variant = 'inline', autoFocus = false, onSubmitted }: Props) => {
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
    <SC.Container $isOverlay={isOverlay}>
      <SC.InputRow $isOverlay={isOverlay}>
        <SC.PlusIcon>
          <FiPlus size={isOverlay ? 20 : 16} />
        </SC.PlusIcon>
        <SC.InputWrapper>
          <SC.Mirror ref={mirrorRef} aria-hidden $isOverlay={isOverlay}>
            {highlightSegments.map(({ startIndex, text: segmentText, variant: segmentVariant }) =>
              segmentVariant === null ? (
                <span key={startIndex}>{segmentText}</span>
              ) : (
                <SC.TokenHighlight key={startIndex} $variant={segmentVariant}>
                  {segmentText}
                </SC.TokenHighlight>
              ),
            )}
          </SC.Mirror>
          <SC.Input
            autoFocus={autoFocus}
            placeholder='할 일 추가 — 예: 내일 업무 회의 준비'
            value={text}
            $isOverlay={isOverlay}
            onChange={handleTextChange}
            onScroll={handleInputScroll}
            onKeyDown={handleInputKeyDown}
          />
        </SC.InputWrapper>
      </SC.InputRow>
      {hasChip && (
        <SC.ChipRow $isOverlay={isOverlay}>
          {dateToken !== null && (
            <SC.Chip $variant='date'>
              <FiCalendar size={12} />
              {formatDueDate(dateToken.date, getTodayKey()).label}
              <SC.ChipRemoveButton type='button' title='날짜 제거' onClick={() => ignoreToken(dateToken.token.text)}>
                <FiX size={12} />
              </SC.ChipRemoveButton>
            </SC.Chip>
          )}
          {categoryToken !== null && (
            <SC.Chip $variant='category'>
              <FiHash size={12} />
              {categoryToken.name}
              <SC.ChipRemoveButton
                type='button'
                title='카테고리 제거'
                onClick={() => ignoreToken(categoryToken.token.text)}
              >
                <FiX size={12} />
              </SC.ChipRemoveButton>
            </SC.Chip>
          )}
        </SC.ChipRow>
      )}
    </SC.Container>
  );
};

/**
 * 입력 텍스트와 하이라이트 mirror 의 글자 위치가 정확히 겹쳐야 하므로
 * 두 요소에 동일한 타이포그래피를 적용한다.
 */
const inputTypography = ($isOverlay: boolean) => css`
  font-size: ${$isOverlay ? '1.7rem' : '1.4rem'};
  line-height: ${$isOverlay ? '2.6rem' : '2rem'};
  font-family: inherit;
  letter-spacing: normal;
`;

const SC = {
  Container: styled.div<{ $isOverlay: boolean }>`
    border: 1px solid ${({ theme, $isOverlay }) => ($isOverlay ? theme.colors.borderStrong : theme.colors.borderSubtle)};
    border-radius: ${({ $isOverlay }) => ($isOverlay ? '1.2rem' : '0.8rem')};
    background-color: ${({ theme, $isOverlay }) => ($isOverlay ? theme.colors.bgElevated : theme.colors.bgSurface)};
    transition: border-color 0.15s ease;

    &:focus-within {
      border-color: ${({ theme }) => theme.colors.interactivePrimary};
    }
  `,
  InputRow: styled.div<{ $isOverlay: boolean }>`
    display: flex;
    align-items: center;
    gap: ${({ $isOverlay }) => ($isOverlay ? '1.2rem' : '0.8rem')};
    padding: ${({ $isOverlay }) => ($isOverlay ? '1.6rem 1.8rem' : '0.9rem 1.2rem')};
  `,
  PlusIcon: styled.span`
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.textTertiary};
  `,
  InputWrapper: styled.div`
    position: relative;
    flex: 1;
    min-width: 0;
  `,
  Mirror: styled.div<{ $isOverlay: boolean }>`
    position: absolute;
    inset: 0;
    overflow: hidden;
    white-space: pre;
    color: transparent;
    pointer-events: none;
    ${({ $isOverlay }) => inputTypography($isOverlay)}
  `,
  TokenHighlight: styled.span<{ $variant: HighlightVariant }>`
    background-color: ${({ theme, $variant }) =>
      $variant === 'date' ? theme.colors.brandLight : theme.colors.statusInfo};
    border-radius: 0.3rem;
  `,
  Input: styled.input<{ $isOverlay: boolean }>`
    position: relative;
    display: block;
    width: 100%;
    border: none;
    background: transparent;
    color: ${({ theme }) => theme.colors.textPrimary};
    outline: none;
    padding: 0;
    ${({ $isOverlay }) => inputTypography($isOverlay)}

    &::placeholder {
      color: ${({ theme }) => theme.colors.textTertiary};
    }
  `,
  ChipRow: styled.div<{ $isOverlay: boolean }>`
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: ${({ $isOverlay }) => ($isOverlay ? '0 1.8rem 1.4rem 5.4rem' : '0 1.2rem 0.9rem 3.6rem')};
  `,
  Chip: styled.span<{ $variant: HighlightVariant }>`
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.3rem 0.6rem;
    border-radius: 0.6rem;
    background-color: ${({ theme }) => theme.colors.bgSurfaceSecondary};
    color: ${({ theme, $variant }) =>
      $variant === 'date' ? theme.colors.interactivePrimary : theme.colors.statusInfo};
    font-size: 1.2rem;
    line-height: 1.6rem;
  `,
  ChipRemoveButton: styled.button`
    display: inline-flex;
    align-items: center;
    padding: 0;
    border: none;
    background: none;
    color: ${({ theme }) => theme.colors.textTertiary};
    cursor: pointer;

    &:hover {
      color: ${({ theme }) => theme.colors.textPrimary};
    }
  `,
};
