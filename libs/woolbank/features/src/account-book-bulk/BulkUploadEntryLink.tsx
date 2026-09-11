'use client';

import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import Link from 'next/link';
import { FiUploadCloud } from 'react-icons/fi';
import { useWoolbankRoutes } from '../_shared/routes/context';

const styles = stylex.create({
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.6rem',
    paddingBlock: '0.6rem',
    paddingInline: '1rem',
    borderWidth: '0.1rem',
    borderStyle: 'solid',
    borderColor: colorVars['--color-borderSubtle'],
    borderRadius: '0.8rem',
    color: {
      default: colorVars['--color-textSecondary'],
      ':hover': colorVars['--color-textPrimary'],
    },
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-bgSurfaceSecondary'],
    },
    fontSize: '1.3rem',
    whiteSpace: 'nowrap',
  },
});

/**
 * 가계부 헤더에서 벌크 업로드로 넘어가는 진입점.
 *
 * 메뉴가 둘뿐인 2depth 사이드바를 만드는 대신 본화면 도구 모음에 둔다 —
 * 벌크 업로드는 가계부와 나란한 메뉴가 아니라 가계부에 딸린 작업이다.
 * 벌크 업로드 화면이 없는 호스트는 routes.bulkUpload 를 비워 이 버튼을 숨긴다.
 */
export const BulkUploadEntryLink = () => {
  const routes = useWoolbankRoutes();

  if (routes.bulkUpload === '') {
    return null;
  }

  return (
    <Link href={routes.bulkUpload} title='엑셀 내역서로 한 번에 등록하기' {...stylex.props(styles.link)}>
      <FiUploadCloud size={15} />
      벌크 업로드
    </Link>
  );
};
