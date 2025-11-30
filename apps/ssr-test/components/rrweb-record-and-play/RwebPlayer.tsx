import { eventWithTime } from '@rrweb/types';
import { useRef } from 'react';
import rrwebPlayer from 'rrweb-player';

interface Props {
  events: eventWithTime[];
}

export const RwebPlayer = ({ events }: Props) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const handlePlayClick = () => {
    // 실제 구현에서는 rrweb-player 사용
    new rrwebPlayer({
      target: playerRef.current!,
      props: {
        events,
        autoPlay: true,
        speedOption: [1, 2, 4, 8],
      },
    });
  };

  return (
    <div>
      RwebPlayer
      <button onClick={handlePlayClick}>재생</button>
      <div ref={playerRef}></div>
    </div>
  );
};
