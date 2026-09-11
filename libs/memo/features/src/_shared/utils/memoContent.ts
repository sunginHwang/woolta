import type { JSONContent } from '@tiptap/core';

/** 본문이 비어 있을 때 Tiptap 이 요구하는 최소 문서 */
export const EMPTY_MEMO_CONTENT: JSONContent = { type: 'doc', content: [{ type: 'paragraph' }] };

/**
 * 서버의 JSON 스칼라(unknown)를 Tiptap 본문으로 좁힌다.
 * 서버는 스키마상 JSON 을 보장할 뿐 Tiptap 문서 형태까지는 보장하지 않으므로,
 * doc 노드가 아니면 빈 본문으로 대체해 에디터가 깨지지 않게 한다.
 */
export const toMemoContent = (content: unknown): JSONContent => {
  if (typeof content !== 'object' || content === null) {
    return EMPTY_MEMO_CONTENT;
  }

  const { type } = content as JSONContent;
  return type === 'doc' ? (content as JSONContent) : EMPTY_MEMO_CONTENT;
};
