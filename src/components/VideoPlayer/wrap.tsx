import { lazy, Suspense } from 'react';

const Player = lazy(() => import('./VideoPlayer'));
export const VideoPlayer: React.FC<{ url: string }> = ({ url }) => <Suspense fallback={<>...</>}>
  <Player url={url} />
</Suspense>;
