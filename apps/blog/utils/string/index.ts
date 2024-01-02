export const convertToPlainText = (markdown: string): string => {
  if (!markdown) return '';
  return markdown.replace(/\n/g, ' ')
    .replace(/```(.*)```/g, '')
    .replace(/#/g, '')
    .replace(/[*]/g, '')
    .replace(/[![*]/g, ' ')
    .replace(/[(.*)]/g, ' ');
};



export function splitWithIndex(str: string, index: number) {
  const result = [str.slice(0, index), str.slice(index)];

  return result;
}
