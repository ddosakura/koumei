import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider, ReactQueryDevtools } from '@bql/ds';
import { MicroRouter, Routes, Route } from '@bql/micro';

const Bangumi = lazy(() => import('./Bangumi'));

// import { GameEngine } from '@bql/game-engine';
const GameEngine = lazy(async () => ({ default: await (await import('@bql/game-engine')).GameEngine }));

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
          <Route path="/game" element={<Suspense fallback={<>...</>}><GameEngine /></Suspense>} />
        </Routes>
      </MicroRouter>
    </QueryClientProvider>
  );
}

export default App;
