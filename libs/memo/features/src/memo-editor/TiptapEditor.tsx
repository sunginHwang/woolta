'use client';

import type { JSONContent } from '@tiptap/core';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { Image } from '@tiptap/extension-image';
import { Placeholder } from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { common, createLowlight } from 'lowlight';
import { useRef } from 'react';
import { uploadMemoImage } from '../_shared/utils/uploadMemoImage';
import editorCss from './tiptapEditor.module.css';

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
    <div className={editorCss.editorArea}>
      <EditorContent editor={editor} />
    </div>
  );
};
