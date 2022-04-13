/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider, ReactQueryDevtools, useQuery, axios } from '@bql/ds';
import { play } from '@bql/video-player';
import { useDebounce, useThrottleFn } from '@bql/hooks';

function useDebounceInput<T>(initialValue: T) {
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebounce(value, { wait: 500 });
  return [value, debouncedValue, setValue] as const;
}

const queryClient = new QueryClient();

function App() {
  const id = (new URL(location.href)).searchParams.get('id') ?? undefined;
  const [mode, setMode] = useState(id ? 0 : 1);
  const [vid, setVid] = useState(id);
  const play = (id: string) => {
    setVid(id);
    setMode(0);
  };
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
      <div>
        <button onClick={() => setMode(0)}>VideoPlayer</button>
        <button onClick={() => setMode(1)}>Resources</button>
        <button onClick={() => setMode(2)}>Collections</button>
        <button onClick={() => setMode(3)}>Search</button>
      </div>
      {(() => {
        switch (mode) {
          case 0: return <VideoPlayer id={vid} />;
          case 1: return <ResourceModule play={play} />;
          case 2: return <CollectionModule play={play} />;
          default: return <SearchModule />;
        }
      })()}
    </QueryClientProvider>
  );
}

const SyncModule: React.FC<{ name: string }> = ({ name }) => {
  const [latest, setLatest] = useState(1);
  const [isSync, setIsSync] = useState(false);
  const [data, setData] = useState();
  const { run, cancel, flush } = useThrottleFn(
    async () => {
      if (isSync) return;
      setIsSync(true);
      const url = new URL('/api/bangumi/sync', location.href);
      url.searchParams.set('name', name);
      url.searchParams.set('latest', `${latest}`);
      const resp = await fetch(url.toString());
      const data = await resp.json();
      setData(data);
      setIsSync(false);
    },
    { wait: 1000 },
  );

  return <div>
    <div>
      <span>latest:</span>
      <input type="number" value={latest} onInput={e => setLatest(parseInt(e.currentTarget.value, 10))} />
      <button onClick={run}>sync</button>
    </div>
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </div>;
};

const CollectionModule: React.FC<{
  play: (id: string) => void
}> = ({ play }) => {
  const [page, debouncedPage, setPage] = useDebounceInput(1);
  const { data } = useQuery(['/api/bangumi/collections', debouncedPage] as const, async ({
    queryKey: [base, page],
    signal,
  }) => {
    const url = new URL(base, location.href);
    url.searchParams.set('page', `${page}`);
    const resp = await fetch(url.toString(), { signal });
    return await resp.json() as {
      total: number
      list: Collection[]
    };
  });
  interface Collection {
    _id: string
    name: string
    searchKey: string
    reFilter: string
  }

  const [collection, setCollection] = useState<Collection>();
  return <div>
    <div>
      <span>page:</span>
      <input type="number" value={page} onInput={e => setPage(parseInt(e.currentTarget.value, 10))} />
      <span>size: 10</span>
      <span>total: {data?.total ?? -1}</span>
    </div>
    <div style={{ overflow: 'scroll', height: '300px' }}>
      {data?.list.map(item => <div key={item._id} style={{ border: '1px solid #000' }}>
        <div>
          <span>合集名：{item.name}</span>
          <button onClick={() => setCollection(item)}>select</button>
        </div>
        <div>
          <span>搜索关键词：{item.searchKey}</span>
          <span>过滤正则：{item.reFilter}</span>
        </div>
      </div>) ?? <div>Loading...</div>}
    </div>
    {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    <hr />
    {collection ? <ResourceModule play={play} cid={collection._id} /> : <span>Select Collection Please</span>}
    <hr />
    {collection ? <SyncModule name={collection.name} /> : <span>Select Collection Please</span>}
  </div>;
};

const ResourceModule: React.FC<{
  play: (id: string) => void
  cid?: string
}> = ({ play, cid }) => {
  const [page, debouncedPage, setPage] = useDebounceInput(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data } = useQuery([`/api/bangumi/resources${cid ? `/${cid}` : ''}`, debouncedPage] as const, async ({
    queryKey: [base, page],
    signal,
  }) => {
    const url = new URL(base, location.href);
    url.searchParams.set('page', `${page}`);
    const resp = await fetch(url.toString(), { signal });
    return await resp.json() as {
      total: number
      list: {
        _id: string
        title: string
        files?: Record<string, string>
        hls?: Record<string, boolean>
      }[]
    };
  });
  return <div>
    <div>
      <span>page:</span>
      <input type="number" value={page} onInput={e => setPage(parseInt(e.currentTarget.value, 10))} />
      <span>size: 10</span>
      <span>total: {data?.total ?? -1}</span>
    </div>
    <div style={{ overflow: 'scroll', height: '600px' }}>
      {data?.list.map(item => <div key={item._id} style={{ border: '1px solid #000' }}>
        <div>资源【{item.title}】已同步数据：</div>
        <div>
          {item.files ? Object.entries(item.files).map(([id, name]) => <div key={id} style={{ display: 'flex' }}>
            <span>{name}</span>
            <div>{ item.hls?.[id] ? <button onClick={() => play(id)}>已切片</button> : <span>未切片</span>}</div>
          </div>) : <span>NotFound</span>}
        </div>
      </div>) ?? <div>Loading...</div>}
    </div>
  </div>;
};

const VideoPlayer: React.FC<{ id?: string }> = ({ id }) => {
  const url = id ? `/storage/bangumi/hls/${id}/index.m3u8` : 'http://localhost:8383/conan.m3u8';
  const container = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!container.current) return;
    play(container.current, url);
  }, []);
  return <div ref={container} />;
};

const SearchModule: React.FC = () => {
  const [key, debouncedKey, setKey] = useDebounceInput('test');
  const { data: list } = useQuery(['/api/bangumi/search', debouncedKey] as const, async ({
    queryKey: [base, key],
    signal,
  }) => {
    const url = new URL(base, location.href);
    url.searchParams.set('name', key);
    const resp = await fetch(url.toString(), { signal });
    return await resp.json() as {
      title: string
      pubDate: string
      url: string
    }[];
  });

  const [filter, setFilter] = useState('');
  const reFilter = (() => {
    try {
      if (!filter) return;
      return new RegExp(filter);
    } catch {
      return;
    }
  })();
  const filteredList = reFilter && list ? list.filter(item => reFilter.test(item.title)) : list;


  const [collectionName, setCollectionName] = useState('');
  const [data, setData] = useState();
  const { run } = useThrottleFn(async () => {
    if (!collectionName) return;
    const url = new URL('/api/bangumi/collection', location.href);
    url.searchParams.set('name', collectionName);
    url.searchParams.set('key', key);
    url.searchParams.set('filter', filter);
    const resp = await fetch(url.toString());
    setData(await resp.json());
  }, { wait: 1000 });

  return (
    <div>
      <div>
        <span>Key</span>
        <input value={key} onInput={e => setKey(e.currentTarget.value)} />
      </div>
      <div>
        <span>Filter</span>
        <input value={filter} onInput={e => setFilter(e.currentTarget.value)} />
      </div>
      <div>
        <span>collectionName</span>
        <input value={collectionName} onInput={e => setCollectionName(e.currentTarget.value)} />
        <button onClick={run}>入库</button>
      </div>
      <div style={{ overflow: 'scroll', height: '600px' }}>
        {filteredList?.map(item => <div key={item.url} style={{ border: '1px solid #000' }}>
          <span>({new Date(item.pubDate).toLocaleString()})</span>
          <span>{item.title}</span>
        </div>) ?? <div>Loading...</div>}
      </div>
      <pre>{JSON.stringify(data, null, 2)}</pre>;
    </div>
  );
};

export default App;
