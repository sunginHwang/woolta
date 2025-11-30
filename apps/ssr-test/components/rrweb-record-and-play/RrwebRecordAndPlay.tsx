'use client';

import { listenerHandler, eventWithTime } from '@rrweb/types';
import { useRef, useState } from 'react';
import { record } from 'rrweb';
import { RwebPlayer } from './RwebPlayer';
import { UiComponents } from './ui-components/UiComponents';

export const RrwebRecordAndPlay = () => {
  const [events, setEvents] = useState<eventWithTime[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const stopRecordingRef = useRef<listenerHandler | undefined>(undefined);

  const handleStartRecordingClick = () => {
    if (isRecording) return;

    setIsRecording(true);

    stopRecordingRef.current = record({
      emit(event: eventWithTime) {
        setEvents((prev) => [...prev, event]);
      },
    });
  };

  const handleStopRecordingClick = () => {
    if (stopRecordingRef.current) {
      stopRecordingRef.current();
      stopRecordingRef.current = undefined;
    }
    setIsRecording(false);
  };

  return (
    <div>
      <button onClick={handleStartRecordingClick}>기록 시작</button>
      <button onClick={handleStopRecordingClick}>기록 중지</button>
      <button onClick={() => setIsPlaying((p) => !p)}>{isPlaying ? '일반뷰보기' : '플레이어보기'}</button>
      {isPlaying ? <RwebPlayer events={events} /> : <UiComponents />}
    </div>
  );
};
