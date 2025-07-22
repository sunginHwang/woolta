import { useAtomValue, useSetAtom } from 'jotai';
import React, { ChangeEvent, ComponentProps, FC, KeyboardEvent, memo, useRef } from 'react';
import styled from 'styled-components';
import BaseInput from '../../../../../components/BaseInput';
import { FormTemplate } from '../../FormTemplate';
import { useBucketFormStep } from '../../hooks/useBucketFormStep';
import { LabelText } from '../../LabelText';
import { bucketFormAtom, setBucketDefaultInfoAtom } from '../../store';

interface Props extends Pick<ComponentProps<typeof FormTemplate>, 'activeForm'> {}

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
      <SC.AccountInfoAddPhase>
        <SC.Content>
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
          <SC.AddInfo>
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
            <SC.BaseTextArea>
              <textarea
                ref={descriptionRef}
                data-cy='name'
                name='name'
                value={description}
                placeholder='내용을 입력하세요.'
                onKeyDown={handleDescriptionEnter}
                onChange={handleChangeDetail}
              />
            </SC.BaseTextArea>
          </SC.AddInfo>
        </SC.Content>
      </SC.AccountInfoAddPhase>
    </FormTemplate>
  );
});

const SC = {
  AccountInfoAddPhase: styled.div`
    height: calc(100vh - 5.5rem);
    padding: 0 2rem;
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }) => theme.colors.white};
  `,
  Content: styled.div`
    padding-top: 2rem;
    height: 80%;
    > div + div {
      margin-top: 4rem;
    }
  `,
  AddInfo: styled.div`
    margin-top: 3rem;
    height: 22rem;
  `,
  BaseTextArea: styled.div`
    display: flex;
    margin: 1rem 0;
    height: 100%;
    flex-direction: column;
    background-color: ${({ theme }) => theme.colors.white};

    textarea {
      border: none;
      resize: none;
      height: 100%;
    }
  `,
};
