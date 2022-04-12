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
  const id = (new URL(location.href)).searchParams.get('id')
  const url = id ? `/storage/bangumi/${id}.m3u8` : 'http://localhost:8383/conan.m3u8';
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
    const url = new URL('http://localhost:8080/api/rss/2json');
    url.searchParams.set('url', 'https://acg.rip/.xml?term=Koumei');
    const xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;
    xhr.addEventListener('load', () => resolve(JSON.parse(xhr.responseText)));
    signal?.addEventListener('abort', () => {
      xhr.abort();
      reject();
    });
    xhr.open('GET', url);
    xhr.send();
  }));

  return (
    <pre>
      { JSON.stringify(data, null, 2) }
    </pre>
  );
};

export default App;
