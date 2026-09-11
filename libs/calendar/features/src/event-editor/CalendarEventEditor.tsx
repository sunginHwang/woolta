'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars, shadowVars, zIndexConsts } from '@wds/tokens.stylex';
import dayjs from 'dayjs';
import { type FormEvent, useMemo, useState } from 'react';
import { FiTrash2, FiX } from 'react-icons/fi';
import {
  useCreateCalendarEvent,
  useDeleteCalendarEvent,
  useUpdateCalendarEvent,
} from '../_shared/hooks/useCalendarEventMutations';
import { useCalendarEvents } from '../_shared/hooks/useCalendarEvents';
import { useCalendarStore } from '../_shared/stores/useCalendarStore';
import {
  CALENDAR_EVENT_COLORS,
  type CalendarEventColorKey,
  resolveEventColor,
  toColorKey,
} from '../_shared/utils/calendarEventColor';
import { getCalendarRange } from '../_shared/utils/calendarRange';

/** datetime-local 입력 포맷 — 초·타임존을 제외한 로컬 시각 */
const INPUT_FORMAT = 'YYYY-MM-DDTHH:mm';
const DATE_FORMAT = 'YYYY-MM-DD';

const styles = stylex.create({
  backdrop: {
    position: 'absolute',
    inset: 0,
    zIndex: zIndexConsts.layer,
    // overlay 토큰(50% 딤)으로 통일, 블러를 더해 시트가 배경과 명확히 분리되게
    backgroundColor: colorVars['--color-bgOverlay'],
    backdropFilter: 'blur(4px)',
  },
  sheet: {
    position: 'absolute',
    top: '12%',
    left: 0,
    right: 0,
    zIndex: zIndexConsts.layer,
    width: '100%',
    maxWidth: '44rem',
    marginBlock: 0,
    marginInline: 'auto',
    padding: '2.6rem',
    borderRadius: '1.8rem',
    backgroundColor: colorVars['--color-bgSurface'],
    boxShadow: shadowVars['--shadow-overlay'],
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '1.8rem',
  },
  iconButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '3rem',
    height: '3rem',
    borderWidth: 0,
    borderStyle: 'none',
    borderRadius: '0.8rem',
    background: 'none',
    color: {
      default: colorVars['--color-textTertiary'],
      ':hover': colorVars['--color-textPrimary'],
    },
    cursor: 'pointer',
    transition: 'color 0.15s',
  },
  dangerButton: {
    color: {
      default: colorVars['--color-textTertiary'],
      ':hover': colorVars['--color-statusError'],
    },
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    paddingBottom: '1.4rem',
  },
  row: {
    display: 'flex',
    gap: '1.2rem',
  },
  rowItem: {
    flex: 1,
    minWidth: 0,
  },
  input: {
    width: '100%',
    paddingBlock: '0.9rem',
    paddingInline: '1.1rem',
    borderWidth: '0.1rem',
    borderStyle: 'solid',
    // 포커스 시 브랜드색 테두리 + 글로우로 입력 중임을 분명히 표현
    borderColor: {
      default: colorVars['--color-borderSubtle'],
      ':focus-visible': colorVars['--color-interactivePrimary'],
    },
    borderRadius: '0.8rem',
    backgroundColor: colorVars['--color-bgSurface'],
    color: colorVars['--color-textPrimary'],
    fontSize: '1.3rem',
    outline: 'none',
    boxShadow: {
      default: 'none',
      // 토큰 변수 참조를 color-mix 안에 넣어 다크/라이트 모두 브랜드색 계열로 따라가게
      ':focus-visible': `0 0 0 3px color-mix(in srgb, ${colorVars['--color-interactivePrimary']} 18%, transparent)`,
    },
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },
  textarea: {
    minHeight: '8rem',
    resize: 'vertical',
  },
  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.7rem',
    paddingBottom: '1.4rem',
  },
  checkbox: {
    // 브라우저 기본 체크박스를 재정의해 전체 톤과 어울리게
    appearance: 'none',
    width: '1.6rem',
    height: '1.6rem',
    minWidth: '1.6rem',
    borderRadius: '0.4rem',
    borderWidth: '0.15rem',
    borderStyle: 'solid',
    borderColor: colorVars['--color-borderDefault'],
    backgroundColor: colorVars['--color-bgSurface'],
    cursor: 'pointer',
    transition: 'background-color 0.15s, border-color 0.15s',
  },
  checkboxChecked: {
    backgroundColor: colorVars['--color-interactivePrimary'],
    borderColor: colorVars['--color-interactivePrimary'],
    // 따옴표·공백까지 전부 퍼센트 인코딩한다 — 날것의 작은따옴표는 CSS 파싱에서 사라져
    // SVG 속성이 `xmlns=http://...` 형태로 깨지고 체크마크가 렌더되지 않는다.
    backgroundImage:
      "url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2010%208%27%3E%3Cpath%20d=%27M1%204l3%203%205-6%27%20stroke=%27%23fff%27%20stroke-width=%271.8%27%20fill=%27none%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27/%3E%3C/svg%3E')",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: '62%',
  },
  colorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    paddingBottom: '1.6rem',
  },
  colorDot: {
    width: '2.8rem',
    height: '2.8rem',
    borderWidth: 0,
    borderStyle: 'none',
    borderRadius: '50%',
    padding: 0,
    cursor: 'pointer',
    // outline 인프라를 미리 깔아두고 active 시 width 만 열어 부드럽게 나타나게
    outlineWidth: 0,
    outlineStyle: 'solid',
    outlineColor: colorVars['--color-textPrimary'],
    outlineOffset: '3px',
    transition: 'outline-width 0.12s, transform 0.12s',
    ':hover': {
      transform: 'scale(1.1)',
    },
  },
  colorDotActive: {
    // 색만으로 구분하지 않고 outline 링으로 선택 상태를 명시적으로 표현
    outlineWidth: '2.5px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.8rem',
    paddingTop: '0.4rem',
  },
  cancelButton: {
    paddingBlock: '0.8rem',
    paddingInline: '1.4rem',
    borderWidth: '0.1rem',
    borderStyle: 'solid',
    borderColor: colorVars['--color-borderSubtle'],
    borderRadius: '0.8rem',
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-bgSurfaceSecondary'],
    },
    color: colorVars['--color-textSecondary'],
    fontSize: '1.3rem',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  },
  submitButton: {
    paddingBlock: '0.8rem',
    paddingInline: '1.6rem',
    borderWidth: 0,
    borderStyle: 'none',
    borderRadius: '0.8rem',
    backgroundColor: {
      default: colorVars['--color-interactivePrimary'],
      ':hover': colorVars['--color-interactivePrimaryHover'],
    },
    color: colorVars['--color-textInverse'],
    fontSize: '1.3rem',
    cursor: {
      default: 'pointer',
      ':disabled': 'not-allowed',
    },
    opacity: {
      default: 1,
      ':disabled': 0.5,
    },
    transition: 'background-color 0.15s',
  },
  error: {
    paddingBottom: '1.2rem',
  },
});

/**
 * 일정 등록/수정 오버레이.
 * store 의 eventDraft 가 있을 때만 뜬다 — 새 일정(eventId null)과 기존 일정 편집을 한 폼으로 처리한다.
 */
export const CalendarEventEditor = () => {
  const eventDraft = useCalendarStore((state) => state.eventDraft);

  if (eventDraft === null) {
    return null;
  }

  // draft 가 바뀌면 폼 상태를 새로 만든다 (다른 일정을 연 채 옛 입력이 남지 않게)
  return <EditorSheet key={eventDraft.eventId ?? `${eventDraft.startAt}-${eventDraft.endAt}`} />;
};

const EditorSheet = () => {
  const eventDraft = useCalendarStore((state) => state.eventDraft)!;
  const viewMode = useCalendarStore((state) => state.viewMode);
  const baseDateIso = useCalendarStore((state) => state.baseDateIso);
  const closeEvent = useCalendarStore((state) => state.closeEvent);

  // 편집 대상은 이미 화면에 그려진 일정이라 같은 범위 캐시에서 찾는다 (추가 조회 없음)
  const range = useMemo(() => getCalendarRange(viewMode, baseDateIso), [viewMode, baseDateIso]);
  const events = useCalendarEvents(range);
  const editingEvent = eventDraft.eventId === null ? null : events.find((item) => item.id === eventDraft.eventId);

  const { createEvent, isCreating } = useCreateCalendarEvent();
  const { updateEvent, isUpdating } = useUpdateCalendarEvent();
  const { deleteEvent, isDeleting } = useDeleteCalendarEvent();

  const [title, setTitle] = useState(editingEvent?.title ?? '');
  const [description, setDescription] = useState(editingEvent?.description ?? '');
  const [isAllDay, setIsAllDay] = useState(editingEvent?.isAllDay ?? eventDraft.isAllDay);
  const [startAt, setStartAt] = useState(editingEvent?.startAt ?? eventDraft.startAt);
  const [endAt, setEndAt] = useState(editingEvent?.endAt ?? eventDraft.endAt);
  const [color, setColor] = useState<CalendarEventColorKey>(toColorKey(editingEvent?.color));
  const [errorMessage, setErrorMessage] = useState('');

  const isSaving = isCreating || isUpdating || isDeleting;
  const canSubmit = title.trim().length > 0 && !isSaving;

  /**
   * 종일 토글.
   * 종일 → 시간제로 바꿀 때 exclusive end 를 그대로 두면 '하루 뒤 00:00' 이 돼 하루를 통째로 덮는다.
   * 그래서 종일 해제 시 기본 1시간으로 줄인다.
   */
  const handleAllDayChange = (nextIsAllDay: boolean) => {
    setIsAllDay(nextIsAllDay);

    if (nextIsAllDay) {
      const start = dayjs(startAt).startOf('day');
      setStartAt(start.toISOString());
      setEndAt(start.add(1, 'day').toISOString());
      return;
    }

    const start = dayjs(startAt).hour(9).minute(0).second(0).millisecond(0);
    setStartAt(start.toISOString());
    setEndAt(start.add(1, 'hour').toISOString());
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!canSubmit) {
      return;
    }
    if (dayjs(endAt).valueOf() <= dayjs(startAt).valueOf()) {
      setErrorMessage('종료 시각은 시작 시각보다 뒤여야 합니다.');
      return;
    }

    const input = {
      title: title.trim(),
      description: description.trim() === '' ? null : description.trim(),
      startAt,
      endAt,
      isAllDay,
      color,
    };

    try {
      if (eventDraft.eventId === null) {
        await createEvent(input);
        return;
      }
      await updateEvent({ id: eventDraft.eventId, ...input });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '일정을 저장하지 못했어요.');
    }
  };

  const handleDelete = async () => {
    if (eventDraft.eventId === null || !window.confirm('이 일정을 삭제할까요?')) {
      return;
    }

    try {
      await deleteEvent(eventDraft.eventId);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '일정을 삭제하지 못했어요.');
    }
  };

  /** 종일이면 날짜만, 아니면 분 단위까지 입력받는다 */
  const inputType = isAllDay ? 'date' : 'datetime-local';
  const toInputValue = (iso: string) => dayjs(iso).format(isAllDay ? DATE_FORMAT : INPUT_FORMAT);

  /** 종일 종료일은 exclusive 라 입력창에는 하루 전(= 사용자가 생각하는 마지막 날)을 보여준다 */
  const endInputValue = isAllDay ? dayjs(endAt).subtract(1, 'day').format(DATE_FORMAT) : toInputValue(endAt);

  const handleEndChange = (value: string) => {
    if (value === '') {
      return;
    }
    setEndAt(isAllDay ? dayjs(value).startOf('day').add(1, 'day').toISOString() : dayjs(value).toISOString());
  };

  return (
    <>
      <div {...stylex.props(styles.backdrop)} onClick={closeEvent} />
      <form {...stylex.props(styles.sheet)} onSubmit={handleSubmit}>
        <div {...stylex.props(styles.header)}>
          <Text as='h3' variant='title5Bold' color='textPrimary'>
            {eventDraft.eventId === null ? '일정 등록' : '일정 수정'}
          </Text>
          <span>
            {eventDraft.eventId !== null && (
              <button
                type='button'
                title='삭제'
                disabled={isSaving}
                {...stylex.props(styles.iconButton, styles.dangerButton)}
                onClick={handleDelete}
              >
                <FiTrash2 size={16} />
              </button>
            )}
            <button type='button' title='닫기' {...stylex.props(styles.iconButton)} onClick={closeEvent}>
              <FiX size={18} />
            </button>
          </span>
        </div>

        <div {...stylex.props(styles.field)}>
          <Text variant='small2Medium' color='textSecondary'>
            제목
          </Text>
          <input
            {...stylex.props(styles.input)}
            autoFocus
            placeholder='일정 제목'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div {...stylex.props(styles.checkboxRow)}>
          <input
            id='calendar-all-day'
            type='checkbox'
            checked={isAllDay}
            {...stylex.props(styles.checkbox, isAllDay && styles.checkboxChecked)}
            onChange={(e) => handleAllDayChange(e.target.checked)}
          />
          <label htmlFor='calendar-all-day'>
            <Text variant='small2Medium' color='textSecondary'>
              종일
            </Text>
          </label>
        </div>

        <div {...stylex.props(styles.row)}>
          <div {...stylex.props(styles.field, styles.rowItem)}>
            <Text variant='small2Medium' color='textSecondary'>
              시작
            </Text>
            <input
              {...stylex.props(styles.input)}
              type={inputType}
              value={toInputValue(startAt)}
              onChange={(e) => e.target.value !== '' && setStartAt(dayjs(e.target.value).toISOString())}
            />
          </div>
          <div {...stylex.props(styles.field, styles.rowItem)}>
            <Text variant='small2Medium' color='textSecondary'>
              종료
            </Text>
            <input
              {...stylex.props(styles.input)}
              type={inputType}
              value={endInputValue}
              onChange={(e) => handleEndChange(e.target.value)}
            />
          </div>
        </div>

        <div {...stylex.props(styles.field)}>
          <Text variant='small2Medium' color='textSecondary'>
            설명
          </Text>
          <textarea
            {...stylex.props(styles.input, styles.textarea)}
            placeholder='메모 (선택)'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div {...stylex.props(styles.colorRow)}>
          {CALENDAR_EVENT_COLORS.map((colorKey) => (
            <button
              key={colorKey}
              type='button'
              title={colorKey}
              style={{ backgroundColor: resolveEventColor(colorKey) }}
              {...stylex.props(styles.colorDot, color === colorKey && styles.colorDotActive)}
              onClick={() => setColor(colorKey)}
            />
          ))}
        </div>

        {errorMessage !== '' && (
          <div {...stylex.props(styles.error)}>
            <Text variant='small2Regular' color='statusError'>
              {errorMessage}
            </Text>
          </div>
        )}

        <div {...stylex.props(styles.footer)}>
          <button type='button' {...stylex.props(styles.cancelButton)} onClick={closeEvent}>
            취소
          </button>
          <button type='submit' disabled={!canSubmit} {...stylex.props(styles.submitButton)}>
            {eventDraft.eventId === null ? '등록' : '저장'}
          </button>
        </div>
      </form>
    </>
  );
};
