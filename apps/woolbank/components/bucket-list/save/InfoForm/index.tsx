import { useInput } from '@common';
import { useAtomValue, useSetAtom } from 'jotai';
import React, { FC, KeyboardEvent, memo, useRef, useState } from 'react';
import styled from 'styled-components';
import BaseInput from '../../../../components/common/BaseInput';
import { FormTemplate } from '../../../../components/common/FormTemplate';
import { useBucketFormStep } from '../hooks/useBucketFormStep';
import { LabelText } from '../LabelText';
import { bucketFormAtom, setBucketDefaultInfoAtom } from '../store';

interface Props {
  step: number;
}

export const InfoForm: FC<Props> = memo(({ step }) => {
  const { title, description } = useAtomValue(bucketFormAtom);
  const { currentStep, goNextStep } = useBucketFormStep();
  const setBucketDefaultInfo = useSetAtom(setBucketDefaultInfoAtom);

  const [bucketListTitle, onBucketListTitleChange, onResetBucketListTitle] = useInput(title);
  const [detail, setDetail] = useState(description);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const isActiveComplete = bucketListTitle.length > 0 && detail.length > 0;

  /**
   * 상세 정보 변경
   */
  const onChangeDetail = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDetail(e.target.value);
  };

  /**
   * 다음 단계(2/4) 이동
   */
  const onCompletePhaseClick = () => {
    setBucketDefaultInfo({ title: bucketListTitle, description: detail });
  };

  const handleTitleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      descriptionRef.current?.focus();
    }
  };

  const handleDescriptionEnter = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && isActiveComplete) {
      goNextStep();
    }
  };

  const isActiveStep = step === currentStep;

  return (
    <FormTemplate
      title='기본 정보 작성'
      isValidForm={isActiveComplete}
      active={isActiveStep}
      usePadding={false}
      onButtonClick={onCompletePhaseClick}
    >
      <SC.AccountInfoAddPhase>
        <SC.Content>
          <LabelText>어떤 것을 이루고 싶으신가요?</LabelText>
          <BaseInput
            useLengthInfo
            placeholder='제목을 입력해 주세요.'
            dataType='text'
            name='title'
            maxLength={30}
            value={bucketListTitle}
            onClear={onResetBucketListTitle}
            onKeyDown={handleTitleEnter}
            onChange={onBucketListTitleChange}
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
                value={detail}
                placeholder='내용을 입력하세요.'
                onKeyDown={handleDescriptionEnter}
                onChange={onChangeDetail}
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
