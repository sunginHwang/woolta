import type { Meta, StoryObj } from '@storybook/react-vite';
import * as stylex from '@stylexjs/stylex';
import { expect } from 'storybook/test';
import { colorVars } from '../../style/tokens.stylex';
import { typographyStyles } from '../../style/typography.stylex';
import { Text } from '../Text';
import { Stack } from './index';

const styles = stylex.create({
  box: {
    minWidth: '5.6rem',
    paddingBlock: '1.2rem',
    paddingInline: '1.6rem',
    borderRadius: '0.6rem',
    backgroundColor: colorVars['--color-brandLight'],
    color: colorVars['--color-textActive'],
    textAlign: 'center',
  },
  tall: { paddingBlock: '2.8rem' },
  frame: {
    borderWidth: '1px',
    borderStyle: 'dashed',
    borderColor: colorVars['--color-borderStrong'],
    borderRadius: '0.6rem',
  },
  card: {
    width: '28rem',
    borderRadius: '1.2rem',
    backgroundColor: colorVars['--color-bgSurface'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colorVars['--color-borderSubtle'],
  },
  avatar: {
    width: '4rem',
    height: '4rem',
    borderRadius: '50%',
    backgroundColor: colorVars['--color-brandPrimary'],
    flexShrink: 0,
  },
  button: {
    paddingBlock: '0.8rem',
    paddingInline: '1.2rem',
    borderRadius: '0.6rem',
    borderWidth: 0,
    backgroundColor: colorVars['--color-interactivePrimary'],
    color: colorVars['--color-textInverse'],
    cursor: 'pointer',
  },
  list: { listStyle: 'none', margin: 0, padding: 0 },
});

/** 배치 결과가 보이도록 채워 넣는 더미 블록 */
const Box = ({ children, tall = false }: { children: React.ReactNode; tall?: boolean }) => (
  <div {...stylex.props(typographyStyles.body4Medium, styles.box, tall && styles.tall)}>{children}</div>
);

const Items = () => (
  <>
    <Box>1</Box>
    <Box>2</Box>
    <Box>3</Box>
  </>
);

const meta: Meta<typeof Stack> = {
  title: 'Components/Stack',
  component: Stack,
  argTypes: {
    as: { control: 'text' },
    direction: { control: 'select', options: ['row', 'row-reverse', 'column', 'column-reverse'] },
    wrap: { control: 'select', options: ['nowrap', 'wrap', 'wrap-reverse'] },
    align: { control: 'select', options: ['stretch', 'flex-start', 'center', 'flex-end', 'baseline'] },
    justify: {
      control: 'select',
      options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'],
    },
    gap: { control: 'number' },
    width: { control: 'text' },
    height: { control: 'text' },
    p: { control: 'text' },
    m: { control: 'text' },
    xstyle: { control: false },
    children: { control: false },
  },
  args: { gap: 8 },
  render: (args) => (
    <Stack {...args}>
      <Items />
    </Stack>
  ),
};

export default meta;

type Story = StoryObj<typeof Stack>;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '아무 prop 도 주지 않으면 `display: flex` 의 브라우저 기본값(가로 방향, `align: stretch`)으로 자식을 나란히 놓는다. ' +
          '`gap` 은 숫자를 주면 px 로 해석한다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const stack = canvasElement.querySelector('[data-testid="stack"]') ?? canvasElement.firstElementChild;
    const computed = getComputedStyle(stack as Element);
    await expect(computed.display).toBe('flex');
    await expect(computed.gap).toBe('8px');
  },
};

export const Column: Story = {
  args: { direction: 'column' },
  parameters: {
    docs: {
      description: {
        story: '`direction="column"` 으로 세로로 쌓는다. 폼 필드·설정 목록처럼 위에서 아래로 흐르는 레이아웃에 쓴다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(getComputedStyle(canvasElement.firstElementChild as Element).flexDirection).toBe('column');
  },
};

export const Centered: Story = {
  args: { justify: 'center', align: 'center', gap: 10, height: 160, xstyle: styles.frame },
  parameters: {
    docs: {
      description: {
        story:
          '`justify="center" align="center"` — 주축·교차축 모두 가운데. 빈 상태 안내, 로딩 표시처럼 영역 한가운데 놓을 때 쓴다. ' +
          '점선은 Stack 의 영역이다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const computed = getComputedStyle(canvasElement.firstElementChild as Element);
    await expect(computed.justifyContent).toBe('center');
    await expect(computed.alignItems).toBe('center');
    await expect(computed.height).toBe('160px');
  },
};

export const SpaceBetween: Story = {
  args: { justify: 'space-between', align: 'center', xstyle: styles.frame },
  parameters: {
    docs: {
      description: {
        story: '`justify="space-between"` — 양 끝으로 밀어낸다. 제목 + 액션 버튼이 있는 헤더, 라벨 + 값 행에 쓴다.',
      },
    },
  },
};

export const AlignStart: Story = {
  args: { align: 'flex-start', xstyle: styles.frame },
  render: (args) => (
    <Stack {...args}>
      <Box>1</Box>
      <Box tall>2 (높음)</Box>
      <Box>3</Box>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`align="flex-start"` — 높이가 다른 자식을 위쪽 기준으로 맞춘다. 기본값 `stretch` 는 모든 자식을 가장 높은 자식 높이로 늘린다는 점과 비교해 보라.',
      },
    },
  },
};

export const Wrap: Story = {
  args: { wrap: 'wrap', gap: 8, width: 240, xstyle: styles.frame },
  render: (args) => (
    <Stack {...args}>
      {Array.from({ length: 8 }, (_, i) => (
        <Box key={String(i)}>{i + 1}</Box>
      ))}
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: '`wrap="wrap"` — 폭을 넘치면 다음 줄로 내린다. 태그·칩 목록처럼 개수가 가변인 항목에 쓴다.',
      },
    },
  },
};

export const Spacing: Story = {
  args: { gap: 8, p: 16, mt: 12, xstyle: styles.frame },
  parameters: {
    docs: {
      description: {
        story:
          '`p`/`m` 과 방향별 `pt pl pr pb` / `mt ml mr mb` 로 여백을 준다. 숫자는 px, 문자열은 그대로(`p="1.6rem 2.4rem"`) 적용된다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const computed = getComputedStyle(canvasElement.firstElementChild as Element);
    await expect(computed.padding).toBe('16px');
    await expect(computed.marginTop).toBe('12px');
  },
};

export const Inline: Story = {
  args: { inline: true, gap: 4, p: 8, xstyle: styles.frame },
  render: (args) => (
    <Text variant='body2' as='div'>
      문장 안에{' '}
      <Stack {...args}>
        <Box>a</Box>
        <Box>b</Box>
      </Stack>{' '}
      끼워 넣을 때는 inline
    </Text>
  ),
  parameters: {
    docs: {
      description: {
        story: '`inline` — `display: inline-flex`. 블록을 만들지 않고 텍스트 흐름 안에 놓는다.',
      },
    },
  },
};

export const FlexChildren: Story = {
  args: { gap: 8, xstyle: styles.frame },
  render: (args) => (
    <Stack {...args}>
      <Stack flex={1} justify='center' xstyle={styles.box}>
        flex=1
      </Stack>
      <Stack flex={2} justify='center' xstyle={styles.box}>
        flex=2
      </Stack>
      <Stack flex='0 0 80px' justify='center' xstyle={styles.box}>
        80px 고정
      </Stack>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`flex` 는 자식 Stack 이 부모 안에서 차지할 비율이다. 단위 없는 숫자가 정상 값이므로 px 를 붙이지 않는다. 문자열(`"0 0 80px"`)로 고정 폭도 줄 수 있다.',
      },
    },
  },
};

export const AsList: Story = {
  args: { as: 'ul', direction: 'column', gap: 4, xstyle: styles.list },
  render: (args) => (
    <Stack {...args}>
      <li>
        <Box>첫 번째 항목</Box>
      </li>
      <li>
        <Box>두 번째 항목</Box>
      </li>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`as` 로 렌더 요소를 바꾼다. 목록은 `ul`, 내비게이션은 `nav`, 섹션은 `section` 처럼 의미에 맞는 태그를 쓰면 접근성 트리가 올바르게 남는다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('ul')).not.toBeNull();
  },
};

export const Composition: Story = {
  render: () => (
    <Stack direction='column' gap={12} p={16} xstyle={styles.card}>
      <Stack align='center' gap={12}>
        <div {...stylex.props(styles.avatar)} />
        <Stack direction='column' gap={2} flex={1}>
          <Text variant='title5Bold' color='textPrimary'>
            이번 달 예산
          </Text>
          <Text variant='small1Regular' color='textTertiary'>
            30만원 남음
          </Text>
        </Stack>
        <Text variant='body4Medium' color='brandPrimary'>
          62%
        </Text>
      </Stack>
      <Stack justify='flex-end' gap={8}>
        <button type='button' {...stylex.props(typographyStyles.body4Medium, styles.button)}>
          기록하기
        </button>
      </Stack>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '실전 예 — Stack 만으로 카드를 조립한다. 바깥은 세로 Stack, 상단 행은 가로 Stack(아바타 + `flex=1` 텍스트 영역 + 수치), 하단은 오른쪽 정렬 버튼 행이다.',
      },
    },
  },
};
