import { useEffect, useRef } from 'react';
import { play } from '@bql/video-player';

const VideoPlayer: React.FC<{ url: string }> = ({ url }) => {
  const container = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!container.current) return;
    play(container.current, url);
  }, []);
  return <div ref={container} />;
};

export default VideoPlayer;
