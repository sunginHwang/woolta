'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { AccountBookBulkUpload, useWoolbankRoutes } from '@woolta/woolbank-features';
import Link from 'next/link';
import { Suspense } from 'react';
import { FiArrowLeft } from 'react-icons/fi';

/**
 * 가계부 벌크 업로드 화면.
 *
 * 카테고리 목록과 중복 검사용 기존 내역을 suspense 로 읽으므로 경계를 여기서 잡는다.
 * 표를 넓게 써야 하는 작업이라 분할 패널 없이 콘텐츠 폭 전체를 쓴다.
 * 전용 사이드바가 없으므로 돌아가는 길은 이 화면이 직접 제공한다.
 */
export const AccountBookBulkUploadScreen = () => {
  const routes = useWoolbankRoutes();

  return (
    <div {...stylex.props(styles.panel)}>
      <div {...stylex.props(styles.backBar)}>
        <Link href={routes.main} {...stylex.props(styles.backLink)}>
          <FiArrowLeft size={15} />
          가계부로
        </Link>
      </div>
      <div {...stylex.props(styles.content)}>
        <Suspense
          fallback={
            <div {...stylex.props(styles.loading)}>
              <Text as='p' variant='body2' color='textTertiary'>
                불러오는 중이에요
              </Text>
            </div>
          }
        >
          <AccountBookBulkUpload />
        </Suspense>
      </div>
    </div>
  );
};

const styles = stylex.create({
  panel: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: colorVars['--color-bgPage'],
  },
  backBar: {
    display: 'flex',
    flexShrink: 0,
    paddingTop: '1.6rem',
    paddingInline: '2rem',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: {
      default: colorVars['--color-textTertiary'],
      ':hover': colorVars['--color-textPrimary'],
    },
    fontSize: '1.3rem',
  },
  // 표가 자체 스크롤을 갖도록 남은 높이를 넘겨준다
  content: {
    flex: 1,
    minHeight: 0,
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
});
