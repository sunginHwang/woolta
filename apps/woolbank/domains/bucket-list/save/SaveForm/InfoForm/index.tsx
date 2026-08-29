import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { useAtomValue, useSetAtom } from 'jotai';
import React, { ChangeEvent, ComponentProps, FC, KeyboardEvent, memo, useRef } from 'react';
import { BaseInput } from '../../../../../components/base-input/BaseInput';
import { FormTemplate } from '../../FormTemplate';
import { useBucketFormStep } from '../../hooks/useBucketFormStep';
import { LabelText } from '../../LabelText';
import { bucketFormAtom, setBucketDefaultInfoAtom } from '../../store';

interface Props extends Pick<ComponentProps<typeof FormTemplate>, 'activeForm'> {}

const styles = stylex.create({
  phase: {
    height: 'calc(100vh - 5.5rem)',
    paddingBlock: 0,
    paddingInline: '2rem',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colorVars['--color-white'],
  },
  content: {
    paddingTop: '2rem',
    height: '80%',
  },
  addInfo: {
    marginTop: '4rem',
    height: '22rem',
  },
  baseTextArea: {
    display: 'flex',
    margin: '1rem 0',
    height: '100%',
    flexDirection: 'column',
    backgroundColor: colorVars['--color-white'],
  },
  textarea: {
    borderWidth: 0,
    borderStyle: 'none',
    resize: 'none',
    height: '100%',
  },
});

export const InfoForm: FC<Props> = memo(({ activeForm }) => {
  const { title, description } = useAtomValue(bucketFormAtom);
  const { goNextStep } = useBucketFormStep();
  const setBucketDefaultInfo = useSetAtom(setBucketDefaultInfoAtom);

  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const isValidForm = title.length > 0 && description.length > 0;

  const handleChangeDetail = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setBucketDefaultInfo({ description: e.target.value, title });
  };

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setBucketDefaultInfo({ description, title: e.target.value });
  };

  const handleClearTitle = () => {
    setBucketDefaultInfo({ description, title: '' });
  };

  const handleTitleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      descriptionRef.current?.focus();
    }
  };

  const handleDescriptionEnter = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && isValidForm) {
      goNextStep();
    }
  };

  return (
    <FormTemplate title='기본 정보 작성' isValidForm={isValidForm} activeForm={activeForm} usePadding={false}>
      <div {...stylex.props(styles.phase)}>
        <div {...stylex.props(styles.content)}>
          <LabelText>어떤 것을 이루고 싶으신가요?</LabelText>
          <BaseInput
            useLengthInfo
            placeholder='제목을 입력해 주세요.'
            dataType='text'
            name='title'
            maxLength={30}
            value={title}
            onClear={handleClearTitle}
            onKeyDown={handleTitleEnter}
            onChange={handleChangeTitle}
          />
          <div {...stylex.props(styles.addInfo)}>
            <LabelText>
              어떻게 목표를 달성할지
              <br />
              자세히 적어볼까요?
            </LabelText>
            <LabelText.Sub>
              목표 달성을 구체적으로 작성하면
              <br />
              목표를 달성할 가능성이 좀더 높아집니다.
            </LabelText.Sub>
            <div {...stylex.props(styles.baseTextArea)}>
              <textarea
                {...stylex.props(styles.textarea)}
                ref={descriptionRef}
                data-cy='name'
                name='name'
                value={description}
                placeholder='내용을 입력하세요.'
                onKeyDown={handleDescriptionEnter}
                onChange={handleChangeDetail}
              />
            </div>
          </div>
        </div>
      </div>
    </FormTemplate>
  );
});
