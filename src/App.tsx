import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider, ReactQueryDevtools } from '@bql/ds';
import { MicroRouter, Routes, Route } from '@bql/micro';

import type { GamePackage } from '@bql/hakke';
const GameEngine = lazy(async () => ({ default: await (await import('@bql/hakke')).GameEngine }));
const Bangumi = lazy(() => import('./Bangumi'));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {/*
      <header>
        <p>
          <span>Hello Vite + React!</span>
          <span className="i-koumei:vite" />
        </p>
      </header>
      */}
      <MicroRouter>
        <Routes>
          <Route path="/" element={<Suspense fallback={<>...</>}><Bangumi /></Suspense>} />
          <Route path="/game" element={<Suspense fallback={<>正在加载 Hakke Core</>}>
            <div style={{ width: '100vw', height: '100vh' }}>
              <GameEngine pkg={gamePackage} saveDataList={[]} />
            </div>
          </Suspense>} />
        </Routes>
      </MicroRouter>
    </QueryClientProvider>
  );
}

export default App;

const gamePackage: GamePackage<'test'> = {
  info: {
    name: 'galtest',
    author: 'unknow',
    description: 'test gal',
    version: { major: 0, minor: 0, patch: 0 },
  },
  version: { major: 0, minor: 0, patch: 0 },
  engines: { test: { type: 'gal', version: { major: 0, minor: 0, patch: 0 } } },
  mode: ['simple'],
  init: {
    newGame: {
      save: { core: { tmp: 0 }, engines: { test: { tmp: 0 } } },
      start: ['test'],
    },
  },
  menu: {
    skipIfNoSaveData: false,
  },
};
