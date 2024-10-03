import { useCallback, useEffect } from 'react';
import useImageUpload from '../../../hooks/useImageUpload';

type Props = {
  onUpdating: () => void;
  onUpdateImage: (value: string) => void;
};

export const useImageDndAndPaste = ({ onUpdating, onUpdateImage }: Props) => {
  const { onImageUpload } = useImageUpload();

  const onPaste = useCallback(
    async (e: ClipboardEvent) => {
      e.preventDefault();
      const { items } = e.clipboardData || { items: null };

      if (!items) {
        return;
      }

      const uploadItem = items[0];
      if (uploadItem.kind !== 'file') {
        return;
      }

      const file = uploadItem.getAsFile();

      if (!file) {
        return;
      }

      onUpdating();
      const markdownImg = await onImageUpload(file);
      onUpdateImage(markdownImg);
    },
    [onImageUpload, onUpdating, onUpdateImage],
  );

  const onDnd = useCallback(
    async (e: DragEvent) => {
      e.preventDefault();

      const { files } = e.dataTransfer || { files: null };
      if (!files) return;
      const imagePromises = [];
      for (let i = 0; i < files.length; i++) {
        imagePromises.push(onImageUpload(files[i]));
      }

      onUpdating();
      const images = await Promise.all(imagePromises);
      const markDownImages = images.reduce((prev, image) => {
        return `${prev}${convertImageToCodeImage(image)}`;
      }, '');
      onUpdateImage(markDownImages);
    },
    [onImageUpload, onUpdating, onUpdateImage],
  );

  useEffect(() => {
    window && window.addEventListener('drop', onDnd); //dnd Event
    document && document.body && document.body.addEventListener('paste', onPaste); // paste Event

    return () => {
      window && window.removeEventListener('drop', onDnd);
      document && document.body && document.body.removeEventListener('paste', onPaste);
    };
  }, [onDnd, onPaste]);
};

function convertImageToCodeImage(imageUrl: string) {
  return `![](${imageUrl})\n`;
}
