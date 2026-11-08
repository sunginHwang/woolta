import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { Button } from './index';

/** 스토리 전용 아이콘 — wds 는 아이콘 세트를 갖지 않으므로 인라인 SVG 로 둔다 */
const PlusIcon = () => (
  <svg width='16' height='16' viewBox='0 0 16 16' fill='none' aria-hidden='true'>
    <path d='M8 3v10M3 8h10' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
  </svg>
);

const ArrowIcon = () => (
  <svg width='16' height='16' viewBox='0 0 16 16' fill='none' aria-hidden='true'>
    <path d='M6 3l5 5-5 5' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
  </svg>
);

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: { control: 'radio', options: ['primary', 'secondary', 'outline', 'outlinePrimary'] },
    size: { control: 'radio', options: ['small', 'medium', 'large'] },
    startIcon: { control: false },
    endIcon: { control: false },
    xstyle: { control: false },
  },
  args: { children: '저장', type: 'button' },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story: '기본은 `primary` · `medium`. 화면에서 가장 중요한 액션(저장·제출) 하나에만 `primary` 를 쓴다.',
      },
    },
  },
};

export const Variants: Story = {
  render: () => (
    <Stack gap={8} wrap='wrap'>
      <Button type='button' variant='primary'>
        primary
      </Button>
      <Button type='button' variant='secondary'>
        secondary
      </Button>
      <Button type='button' variant='outline'>
        outline
      </Button>
      <Button type='button' variant='outlinePrimary'>
        outlinePrimary
      </Button>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '네 가지 변형. woolbank 에서 쓰던 이름과의 대응은 `primary`→primary, `secondaryGray`→secondary, `tertiaryGray`→outline, `tertiaryColor`→outlinePrimary 다. ' +
          '색은 전부 Semantic 토큰(interactive·text·bg·border)이라 다크 테마에서 자동으로 바뀐다.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <Stack gap={8} align='center' wrap='wrap'>
      <Button type='button' size='small'>
        small 36
      </Button>
      <Button type='button' size='medium'>
        medium 42
      </Button>
      <Button type='button' size='large'>
        large 52
      </Button>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '높이 36 / 42 / 52px. 글꼴도 body4Medium / title5Medium / title4Medium 으로 함께 커진다. ' +
          '바텀시트 안의 확인 버튼은 `small`, 폼 제출은 `medium`, 하단 고정 CTA 는 `large` 또는 `medium` + `fill`.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const heights = [...canvasElement.querySelectorAll('button')].map((b) => getComputedStyle(b).height);
    await expect(heights).toEqual(['36px', '42px', '52px']);
  },
};

export const Fill: Story = {
  args: { fill: true, children: '저장하기' },
  parameters: {
    docs: {
      description: {
        story: '`fill` 은 부모 폭을 꽉 채운다. 폼 하단의 제출 버튼, 하단 고정 버튼에 쓴다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button') as HTMLButtonElement;
    await expect(button.getBoundingClientRect().width).toBe(
      (button.parentElement as HTMLElement).getBoundingClientRect().width,
    );
  },
};

export const WithIcons: Story = {
  render: () => (
    <Stack gap={8} wrap='wrap'>
      <Button type='button' startIcon={<PlusIcon />}>
        항목 추가
      </Button>
      <Button type='button' variant='outline' endIcon={<ArrowIcon />}>
        더 보기
      </Button>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`startIcon` / `endIcon` 에 아이콘 노드를 넣는다. 아이콘은 `currentColor` 를 쓰면 변형별 글자색을 그대로 따른다. 아이콘만 있는 버튼은 `aria-label` 을 반드시 준다.',
      },
    },
  },
};

export const Loading: Story = {
  args: { loading: true, children: '저장 중' },
  parameters: {
    docs: {
      description: {
        story:
          '`loading` 이면 스피너를 보이고 `disabled` + `aria-busy` 가 걸린다. 내용은 투명하게만 두어 버튼 폭이 변하지 않는다 — 제출 직후 레이아웃이 흔들리지 않게 하기 위해서다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button') as HTMLButtonElement;
    await expect(button.disabled).toBe(true);
    await expect(button.getAttribute('aria-busy')).toBe('true');
  },
};

export const Disabled: Story = {
  render: () => (
    <Stack gap={8} wrap='wrap'>
      <Button type='button' disabled>
        primary
      </Button>
      <Button type='button' variant='secondary' disabled>
        secondary
      </Button>
      <Button type='button' variant='outline' disabled>
        outline
      </Button>
      <Button type='button' variant='outlinePrimary' disabled>
        outlinePrimary
      </Button>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '비활성 상태. 투명도 대신 `*Disabled` 토큰으로 색을 바꾼다. 폼 유효성이 통과하지 않은 제출 버튼이 대표적이다.',
      },
    },
  },
};

const SubmitFormDemo = () => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('saving');
    setTimeout(() => setStatus('saved'), 1200);
  };

  return (
    <form onSubmit={onSubmit}>
      <Stack direction='column' gap={12} width={320}>
        <Text as='label' variant='body4Medium' color='textSecondary'>
          가계부 이름
          <input
            name='name'
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder='예: 생활비'
            style={{ display: 'block', width: '100%', marginTop: 4, padding: 8, fontSize: 14 }}
          />
        </Text>
        <Stack gap={8}>
          <Button type='button' variant='outline' onClick={() => setName('')}>
            초기화
          </Button>
          <Button type='submit' fill disabled={name.trim() === ''} loading={status === 'saving'}>
            {status === 'saved' ? '저장됨' : '저장'}
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export const SubmitForm: Story = {
  render: () => <SubmitFormDemo />,
  parameters: {
    docs: {
      description: {
        story:
          '실전 예 — woolbank 가계부 폼의 제출 영역. 입력이 비어 있으면 `disabled`, 제출하면 `loading`, 완료 후 문구를 바꾼다. ' +
          '제출 버튼만 `type="submit"` 이고 옆의 초기화는 `type="button"` 이라 Enter 키로 초기화가 눌리지 않는다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const submit = canvas.getByRole('button', { name: '저장' }) as HTMLButtonElement;
    await expect(submit.disabled).toBe(true);
    await userEvent.type(canvas.getByPlaceholderText('예: 생활비'), '생활비');
    await expect(submit.disabled).toBe(false);
    await userEvent.click(submit);
    await waitFor(() => expect(submit.getAttribute('aria-busy')).toBe('true'));
    await waitFor(() => expect(canvas.getByRole('button', { name: '저장됨' })).toBeTruthy(), { timeout: 3000 });
  },
};

export const BottomFloating: Story = {
  render: () => (
    <div style={{ position: 'relative', width: 360, height: 200, border: '1px dashed currentColor', borderRadius: 8 }}>
      <Text variant='body3' color='textTertiary' as='p' mt={16} ml={16}>
        스크롤되는 본문 영역
      </Text>
      <div style={{ position: 'absolute', left: 16, right: 16, bottom: 16 }}>
        <Button type='button' fill size='large'>
          다음
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '실전 예 — woolbank 의 하단 고정 버튼(BottomFloatingButton). 화면 하단에 `fill` + `large` 로 깔고, 위치 잡는 래퍼는 사용하는 쪽이 담당한다.',
      },
    },
  },
};
