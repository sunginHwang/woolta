'use client';

import * as stylex from '@stylexjs/stylex';
import { Text, Toggle } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { useUserInfo } from '../_shared/hooks/useUserInfo';
import { type PushSettingModel, usePushSetting } from './usePushSetting';

const styles = stylex.create({
  container: {
    paddingBlock: 0,
    paddingInline: 0,
    marginTop: '2.4rem',
  },
  title: {
    paddingBlock: '1rem',
    paddingInline: 0,
  },
  cardWrapper: {
    borderWidth: '0.1rem',
    borderStyle: 'solid',
    borderColor: colorVars['--color-border3'],
    borderRadius: '0.8rem',
    boxShadow: '0 0.1rem 0.3rem 0 rgba(0, 0, 0, 0.1)',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '4.8rem',
    paddingBlock: 0,
    paddingInline: '2rem',
    borderTopWidth: {
      default: '0.1rem',
      ':first-child': 0,
    },
    borderTopStyle: 'solid',
    borderTopColor: colorVars['--color-border4'],
  },
  helper: {
    paddingBlock: '1.2rem',
    paddingInline: '2rem',
    borderTopWidth: '0.1rem',
    borderTopStyle: 'solid',
    borderTopColor: colorVars['--color-border4'],
    backgroundColor: colorVars['--color-bgPrimary'],
    lineHeight: 1.5,
  },
  actionButton: {
    appearance: 'none',
    borderWidth: 0,
    backgroundColor: 'transparent',
    paddingBlock: 0,
    paddingInline: 0,
    width: '100%',
    minHeight: '4.8rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    textAlign: 'left',
  },
});

const HELPER_TEXT: Partial<Record<PushSettingModel['state'], string>> = {
  'unsupported': '이 브라우저는 푸시 알림을 지원하지 않아요.',
  'needs-install':
    'iPhone 은 홈 화면에 추가한 앱에서만 알림을 받을 수 있어요. Safari 의 공유 버튼 → "홈 화면에 추가" 후 앱에서 다시 켜주세요.',
  'denied':
    '알림 권한이 차단되어 있어요. 브라우저(또는 iOS 설정 → 알림)에서 뱅킷리스트 알림을 허용한 뒤 다시 시도해주세요.',
  'unavailable': '알림을 준비하지 못했어요. 새로고침 후 다시 시도해주세요.',
};

export interface PushSettingViewProps extends PushSettingModel {
  /** 공유코드 세션 — 주인 계정의 알림을 받되, 알림 종류 설정은 주인만 바꿀 수 있어 숨긴다 */
  isShareUser: boolean;
}

/**
 * 알림 설정 카드 — 상태 머신은 props 로 받는다(스토리에서 각 상태를 고정하기 위해).
 */
export const PushSettingView = ({
  state,
  setting,
  subscriptionCount,
  isBusy,
  isShareUser,
  enable,
  disable,
  setRegularExpenditure,
  sendTest,
}: PushSettingViewProps) => {
  const isOn = state === 'on';
  const canToggle = state === 'on' || state === 'off';
  const helper = HELPER_TEXT[state];

  const handleMasterChange = (checked: boolean) => {
    // 권한 요청은 이 클릭 핸들러에서 바로 시작돼야 한다(iOS 제스처 규칙)
    void (checked ? enable() : disable());
  };

  return (
    <section {...stylex.props(styles.container)}>
      <Text xstyle={styles.title} variant='body3' color='graySecondary' as='h3'>
        알림
      </Text>
      <div {...stylex.props(styles.cardWrapper)}>
        <div {...stylex.props(styles.item)}>
          <Text variant='body4Regular' color='grayPrimary'>
            푸시 알림
          </Text>
          <Toggle aria-label='푸시 알림' checked={isOn} disabled={!canToggle || isBusy} onChange={handleMasterChange} />
        </div>
        {helper && (
          <Text xstyle={styles.helper} variant='small2Regular' color='graySecondary' as='p'>
            {helper}
          </Text>
        )}
        {state === 'pending' && (
          <Text xstyle={styles.helper} variant='small2Regular' color='graySecondary' as='p'>
            알림 상태를 확인하고 있어요…
          </Text>
        )}
        {isOn && (
          <>
            {!isShareUser && (
              <div {...stylex.props(styles.item)}>
                <Text variant='body4Regular' color='grayPrimary'>
                  정기지출 결제 전날 알림
                </Text>
                <Toggle
                  aria-label='정기지출 결제 전날 알림'
                  checked={setting.regularExpenditure}
                  disabled={isBusy}
                  onChange={(checked) => void setRegularExpenditure(checked)}
                />
              </div>
            )}
            <div {...stylex.props(styles.item)}>
              <button type='button' {...stylex.props(styles.actionButton)} onClick={() => void sendTest()}>
                <Text variant='body4Regular' color='grayPrimary'>
                  테스트 알림 보내기
                </Text>
                <Text variant='small2Regular' color='graySecondary'>
                  기기 {subscriptionCount}대
                </Text>
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

/**
 * 로그인 확인 뒤에만 상태 머신 훅을 돌린다 — 유저를 모르는 사이 토글을 누르면 주인 없는 구독만 남는다.
 * 공유코드 세션도 구독한다(서버 userId 가 주인 계정이라 그 기기가 주인 알림을 받는다).
 * 공개키가 빌드에 없으면(unconfigured) 설정 문제라 사용자에게 아무것도 보여주지 않는다.
 */
const PushSettingForUser = ({ isShareUser }: { isShareUser: boolean }) => {
  const model = usePushSetting();

  if (model.state === 'unconfigured') {
    return null;
  }

  return <PushSettingView {...model} isShareUser={isShareUser} />;
};

/** 마이페이지 알림 설정 */
export const PushSettingSection = () => {
  const { isShareUser, isLoading } = useUserInfo();

  if (isLoading) {
    return null;
  }

  return <PushSettingForUser isShareUser={isShareUser} />;
};
