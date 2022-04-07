/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider, ReactQueryDevtools, useQuery } from '@bql/ds';
import { play } from '@bql/video-player';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <header>
        <p>
          <span>Hello Vite + React!</span>
          <span className="i-koumei:vite" />
        </p>
      </header>
      {/* <ExampleApp /> */}
      <VideoPlayer />
    </QueryClientProvider>
  );
}

const VideoPlayer: React.FC = () => {
  const url = 'http://localhost:8383/conan.m3u8';
  const container = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!container.current) return;
    play(container.current, url);
  }, []);
  return <div ref={container} />;
};

const ExampleApp: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data } = useQuery<XMLHttpRequest>('koumei', ({ signal }) => new Promise((resolve, reject) => {
    reject('CORS');
    // const xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;
    // xhr.addEventListener('load', () => resolve(xhr));
    // signal?.addEventListener('abort', () => {
    //   xhr.abort();
    //   reject();
    // });
    // xhr.open('GET', 'https://acg.rip/.xml?term=Koumei');
    // xhr.send();
  }));

  return (
    <>
      { data }
    </>
  );
};

export default App;
