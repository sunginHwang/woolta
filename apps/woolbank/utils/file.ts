export const dataURLtoFile = (dataUrl: string, fileName: string) => {
  const [first, second] = dataUrl.split(',');

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const mime = first && first.match(/:(.*?);/)[1];
  const bstr = atob(second);
  let bstrLength = bstr.length;
  const u8arr = new Uint8Array(bstrLength);

  while (bstrLength--) {
    u8arr[bstrLength] = bstr.charCodeAt(bstrLength);
  }

  return new File([u8arr], fileName, { type: mime });
};

export const getExtensionByDataURL = (dataUrl: string) => {
  return dataUrl.substring('data:image/'.length, dataUrl.indexOf(';base64'));
};

export const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<string> => {
  const reader = new FileReader();
  reader.readAsDataURL(file);

  return new Promise(function (resolve, reject) {
    if (!file.type.match(/image.*/)) {
      reject(new Error('Not an image'));
      return;
    }

    reader.onload = function (e) {
      const img = document.createElement('img');
      img.src = String(e && e.target ? e.target.result : '');

      img.onload = () => {
        const canvas = document.createElement('canvas');
        // 이미지 사이즈를 구하기 위한 1차 canvas 랜더링
        const ctx = canvas.getContext('2d');
        ctx && ctx.drawImage(img, 0, 0);

        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // 최종 확정된 resize 이미지 canvas 랜더링
        ctx && ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL(file.type));
      };
    };
  });
};
