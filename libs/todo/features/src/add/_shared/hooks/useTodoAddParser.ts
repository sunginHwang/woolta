'use client';

import { useMemo, useState } from 'react';
import { useCategoryList } from '../../../_shared/hooks/useCategoryList';
import { useTodoStore } from '../../../_shared/stores/useTodoStore';
import { TodoListKey } from '../../../_shared/types';
import { getDefaultTodoDraft } from '../../../_shared/utils/getDefaultTodoDraft';
import { parseCategoryTokens } from '../../../_shared/utils/parseCategoryFromText';
import { parseDateTokens } from '../../../_shared/utils/parseDateFromText';
import { getTodayKey } from '../../../_shared/utils/todoDate';

interface TokenRange {
  /** 토큰 시작 인덱스 */
  startIndex: number;
  /** 토큰 끝 인덱스 (exclusive) */
  endIndex: number;
}

/** 두 토큰 구간이 겹치는지 판정한다. */
const isOverlapped = (a: TokenRange, b: TokenRange) => a.startIndex < b.endIndex && a.endIndex > b.startIndex;

/**
 * 할 일 추가 입력의 토큰 파싱/무시 목록/제출 로직을 담당한다.
 * - 텍스트에서 날짜 표현과 기존 카테고리 이름을 각각 하나씩 활성 토큰으로 추적한다.
 * - 칩의 X 를 누르면 해당 토큰 문자열을 무시 목록에 넣어 일반 텍스트로 취급한다.
 * - 제출 시 활성 토큰들을 제목에서 제거하고 각각 마감일/카테고리로 설정한다.
 *   토큰이 없는 항목은 리스트별 기본값을 쓴다.
 * - submit 은 실제로 할 일이 추가됐는지 여부를 반환한다.
 * @param listKey 현재 보고 있는 리스트 키 (기본 마감일/카테고리 결정에 사용)
 */
export const useTodoAddParser = (listKey: TodoListKey) => {
  const addTodo = useTodoStore((state) => state.addTodo);
  const selectTodo = useTodoStore((state) => state.selectTodo);
  const categoryList = useCategoryList();

  const [text, setText] = useState('');
  const [ignoredTexts, setIgnoredTexts] = useState<string[]>([]);

  const { dateToken, categoryToken } = useMemo(() => {
    const matchedDate = parseDateTokens(text, getTodayKey()).find(({ token }) => !ignoredTexts.includes(token.text));

    const matchedCategory = parseCategoryTokens(text, categoryList).find(
      ({ token }) =>
        !ignoredTexts.includes(token.text) && (matchedDate === undefined || !isOverlapped(token, matchedDate.token)),
    );

    const category =
      matchedCategory === undefined
        ? null
        : {
            ...matchedCategory,
            name: categoryList.find(({ id }) => id === matchedCategory.categoryId)?.name ?? '',
          };

    return { dateToken: matchedDate ?? null, categoryToken: category };
  }, [text, ignoredTexts, categoryList]);

  const changeText = (nextText: string) => {
    setText(nextText);
    if (nextText.trim().length === 0) {
      setIgnoredTexts([]);
    }
  };

  const ignoreToken = (tokenText: string) => {
    setIgnoredTexts((prev) => [...prev, tokenText]);
  };

  const submit = () => {
    // 뒤쪽 토큰부터 제거해 앞쪽 토큰의 인덱스가 밀리지 않게 한다.
    const tokenRanges = [
      ...(dateToken === null ? [] : [dateToken.token]),
      ...(categoryToken === null ? [] : [categoryToken.token]),
    ].sort((a, b) => b.startIndex - a.startIndex);

    const title = tokenRanges
      .reduce((acc, { startIndex, endIndex }) => acc.slice(0, startIndex) + acc.slice(endIndex), text)
      .replace(/\s+/g, ' ')
      .trim();

    if (title.length === 0) {
      return false;
    }

    const draft = getDefaultTodoDraft(listKey, getTodayKey());
    const todoId = addTodo({
      title,
      dueDate: dateToken?.date ?? draft.dueDate,
      categoryId: categoryToken?.categoryId ?? draft.categoryId,
    });
    selectTodo(todoId);
    setText('');
    setIgnoredTexts([]);
    return true;
  };

  return { text, dateToken, categoryToken, changeText, ignoreToken, submit };
};
