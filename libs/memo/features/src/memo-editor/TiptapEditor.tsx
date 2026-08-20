'use client';

import type { JSONContent } from '@tiptap/core';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { Image } from '@tiptap/extension-image';
import { Placeholder } from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { common, createLowlight } from 'lowlight';
import { useRef } from 'react';
import { styled } from 'styled-components';
import { uploadMemoImage } from '../_shared/utils/uploadMemoImage';

const lowlight = createLowlight(common);

interface Props {
  /** 에디터 초기 본문 (Tiptap JSON) */
  initialContent: JSONContent;
  /** 본문 변경 시 호출된다 (debounce는 호출부 책임) */
  onChangeContent: (content: JSONContent) => void;
}

const getImageFiles = (dataTransfer: DataTransfer | null) => {
  return Array.from(dataTransfer?.files ?? []).filter((file) => file.type.startsWith('image/'));
};

export const TiptapEditor = ({ initialContent, onChangeContent }: Props) => {
  const insertImagesRef = useRef<(files: File[]) => void>(() => undefined);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight }),
      Image,
      Placeholder.configure({ placeholder: '내용을 입력하세요. 이미지는 붙여넣기/드래그로 추가할 수 있어요.' }),
    ],
    content: initialContent,
    immediatelyRender: false,
    onUpdate: ({ editor: updatedEditor }) => {
      onChangeContent(updatedEditor.getJSON());
    },
    editorProps: {
      handlePaste: (view, event) => {
        const imageFiles = getImageFiles(event.clipboardData);
        if (imageFiles.length === 0) {
          return false;
        }

        insertImagesRef.current(imageFiles);
        return true;
      },
      handleDrop: (view, event) => {
        const imageFiles = getImageFiles(event.dataTransfer);
        if (imageFiles.length === 0) {
          return false;
        }

        insertImagesRef.current(imageFiles);
        return true;
      },
    },
  });

  insertImagesRef.current = async (files: File[]) => {
    for (const file of files) {
      const imageUrl = await uploadMemoImage(file);

      if (imageUrl) {
        editor?.chain().focus().setImage({ src: imageUrl }).run();
      } else {
        window.alert('이미지 업로드에 실패했어요. blog.woolta.com 로그인이 필요할 수 있어요.');
      }
    }
  };

  return (
    <SC.EditorArea>
      <EditorContent editor={editor} />
    </SC.EditorArea>
  );
};

const SC = {
  EditorArea: styled.div`
    flex: 1;

    .ProseMirror {
      outline: none;
      min-height: 40rem;
      font-size: 1.5rem;
      line-height: 1.7;
      color: ${({ theme }) => theme.colors.textPrimary};

      p {
        margin: 0.4rem 0;
      }

      h1,
      h2,
      h3 {
        margin: 1.6rem 0 0.6rem;
        color: ${({ theme }) => theme.colors.textPrimary};
      }

      h1 {
        font-size: 2.4rem;
      }

      h2 {
        font-size: 2rem;
      }

      h3 {
        font-size: 1.7rem;
      }

      ul,
      ol {
        padding-left: 2.2rem;
        margin: 0.4rem 0;

        li {
          list-style: revert;
        }
      }

      blockquote {
        margin: 0.8rem 0;
        padding-left: 1.2rem;
        border-left: 0.3rem solid ${({ theme }) => theme.colors.borderStrong};
        color: ${({ theme }) => theme.colors.textSecondary};
      }

      code {
        padding: 0.2rem 0.5rem;
        border-radius: 0.4rem;
        font-size: 1.3rem;
        background-color: ${({ theme }) => theme.colors.bgSurfaceSecondary};
      }

      pre {
        margin: 0.8rem 0;
        padding: 1.2rem 1.4rem;
        border-radius: 0.8rem;
        background-color: ${({ theme }) => theme.colors.bgSurfaceSecondary};

        code {
          padding: 0;
          background: none;
        }

        /* lowlight(highlight.js) 신택스 하이라이트 — 시맨틱 토큰으로 다크모드 대응 */
        .hljs-comment,
        .hljs-quote {
          color: ${({ theme }) => theme.colors.textTertiary};
          font-style: italic;
        }

        .hljs-keyword,
        .hljs-selector-tag,
        .hljs-doctag,
        .hljs-tag {
          color: ${({ theme }) => theme.colors.brandPrimary};
        }

        .hljs-string,
        .hljs-regexp,
        .hljs-addition {
          color: ${({ theme }) => theme.colors.statusSuccess};
        }

        .hljs-number,
        .hljs-literal,
        .hljs-symbol,
        .hljs-bullet,
        .hljs-meta {
          color: ${({ theme }) => theme.colors.statusWarning};
        }

        .hljs-title,
        .hljs-section,
        .hljs-name,
        .hljs-function {
          color: ${({ theme }) => theme.colors.statusInfo};
        }

        .hljs-attr,
        .hljs-attribute,
        .hljs-variable,
        .hljs-template-variable,
        .hljs-type,
        .hljs-selector-class,
        .hljs-selector-id,
        .hljs-property {
          color: ${({ theme }) => theme.colors.interactivePrimary};
        }

        .hljs-built_in,
        .hljs-builtin-name {
          color: ${({ theme }) => theme.colors.statusError};
        }

        .hljs-deletion {
          color: ${({ theme }) => theme.colors.statusError};
        }

        .hljs-emphasis {
          font-style: italic;
        }

        .hljs-strong {
          font-weight: 700;
        }
      }

      img {
        max-width: 100%;
        border-radius: 0.8rem;
      }

      hr {
        margin: 1.6rem 0;
        border: 0;
        border-top: 0.1rem solid ${({ theme }) => theme.colors.borderSubtle};
      }

      p.is-editor-empty:first-child::before {
        content: attr(data-placeholder);
        float: left;
        height: 0;
        pointer-events: none;
        color: ${({ theme }) => theme.colors.textTertiary};
      }
    }
  `,
};
