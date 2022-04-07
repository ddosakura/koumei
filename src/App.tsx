import { QueryClient, QueryClientProvider, ReactQueryDevtools, useQuery } from '@bql/ds';

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
      <ExampleApp />
    </QueryClientProvider>
  );
}

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
