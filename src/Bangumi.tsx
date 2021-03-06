import { useEffect, useState } from 'react';
import { useQuery } from '@bql/ds';
import { useDebounce, useThrottleFn } from '@bql/hooks';

import { VideoPlayer } from './components';

function useDebounceInput<T>(initialValue: T) {
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebounce(value, { wait: 500 });
  return [value, debouncedValue, setValue] as const;
}

export default function Bangumi() {
  const id = (new URL(location.href)).searchParams.get('id') ?? undefined;
  const [mode, setMode] = useState(id ? 0 : 1);
  const [vid, setVid] = useState(id);
  const play = (id: string) => {
    setVid(id);
    setMode(0);
  };
  return <>
    <div>
      <button onClick={() => setMode(0)}>VideoPlayerModule</button>
      <button onClick={() => setMode(1)}>Resources</button>
      <button onClick={() => setMode(2)}>Collections</button>
      <button onClick={() => setMode(3)}>FFmpeg</button>
      <button onClick={() => setMode(4)}>Search</button>
    </div>
    {(() => {
      switch (mode) {
        case 0: return <VideoPlayerModule id={vid} />;
        case 1: return <ResourceModule play={play} />;
        case 2: return <CollectionModule play={play} />;
        case 3: return <FFmpegModule />;
        default: return <SearchModule />;
      }
    })()}
  </>;
};

const FFmpegModule: React.FC = () => {
  const { data } = useQuery('/api/coss/hls/status', async ({
    queryKey: [base],
    signal,
  }) => {
    const url = new URL(base, location.href);
    const resp = await fetch(url.toString(), { signal });
    return await resp.json() as {
      running: string[]
      waiting: string[]
    };
  });
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

const SyncModule: React.FC<{ collection: Collection }> = ({ collection }) => {
  const { name } = collection;
  const [latest, setLatest] = useState(1);
  const [isSync, setIsSync] = useState(false);
  const [data, setData] = useState();
  const { run } = useThrottleFn(
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
    <SearchModule collection={collection} />
    <div>
      <span>latest:</span>
      <input type="number" value={latest} onInput={e => setLatest(parseInt(e.currentTarget.value, 10))} />
      <button onClick={run}>sync</button>
    </div>
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </div>;
};

interface Collection {
  _id: string
  name: string
  searchKey: string
  reFilter: string
}
const CollectionModule: React.FC<{
  play: (id: string) => void
}> = ({ play }) => {
  const [page, debouncedPage, setPage] = useDebounceInput(1);
  const { data, refetch } = useQuery(['/api/bangumi/collections', debouncedPage] as const, async ({
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

  const [collection, setCollection] = useState<Collection>();
  return <div>
    <div>
      <span>page:</span>
      <input type="number" value={page} onInput={e => setPage(parseInt(e.currentTarget.value, 10))} />
      <span>size: 10</span>
      <span>total: {data?.total ?? -1}</span>
    </div>
    <div style={{ overflow: 'scroll', height: '300px' }}>
      {data?.list.map(item => <div
        key={item._id}
        style={{ border: collection?._id === item._id ? '1px solid red' : '1px solid #000' }}
      >
        <div>
          <span>???????????????{item.name}</span>
          <button onClick={() => setCollection(item)}>select</button>
        </div>
        <div>
          <span>?????????????????????{item.searchKey}</span>
          <span>??????????????????{item.reFilter}</span>
        </div>
      </div>) ?? <div>Loading...</div>}
    </div>
    {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    <hr />
    {collection ? <ResourceModule play={play} collection={collection} onDelete={() => {
      setCollection(undefined);
      refetch();
    }} /> : <span>Select Collection Please</span>}
    <hr />
    {collection ? <SyncModule collection={collection} /> : <span>Select Collection Please</span>}
  </div>;
};

const ResourceModule: React.FC<{
  play: (id: string) => void
  collection?: Collection
  onDelete?: () => void
}> = ({ play, collection, onDelete }) => {
  const [page, debouncedPage, setPage] = useDebounceInput(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data } = useQuery([
    `/api/bangumi/resources${collection ? `/${collection._id}` : ''}`, debouncedPage,
  ] as const, async ({
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
        pubDate: string
        files?: Record<string, string>
        hls?: Record<string, boolean>
      }[]
    };
  });
  const del = async () => {
    if (!collection) return;
    const ok = confirm(`DELETE ${collection.name}`);
    if (!ok) return;
    const url = new URL('/api/bangumi/collection', location.href);
    url.searchParams.set('id', collection._id);
    url.searchParams.set('coss', 'true');
    await fetch(url.toString(), { method: 'DELETE' });
    onDelete?.();
  };
  const header = collection ? <div>
    <span>??????????????????</span>
    <span>{collection.name}</span>
    <button onClick={() => {
      del();
    }}>DELETE</button>
  </div> : null;
  return <div>
    {header}
    <div>
      <span>page:</span>
      <input type="number" value={page} onInput={e => setPage(parseInt(e.currentTarget.value, 10))} />
      <span>size: 10</span>
      <span>total: {data?.total ?? -1}</span>
    </div>
    <div style={{ overflow: 'scroll', height: '600px' }}>
      {data?.list.map(item => <div key={item._id} style={{ border: '1px solid #000' }}>
        <div>({new Date(item.pubDate).toLocaleString()})</div>
        <div>?????????{item.title}?????????????????????</div>
        <div>
          {item.files ? Object.entries(item.files).map(([id, name]) => <div key={id} style={{ display: 'flex' }}>
            <span>{name}</span>
            <div>{item.hls?.[id] ? <button onClick={() => play(id)}>?????????</button> : <span>?????????</span>}</div>
          </div>) : <span>NotFound</span>}
        </div>
      </div>) ?? <div>Loading...</div>}
    </div>
  </div>;
};

const VideoPlayerModule: React.FC<{ id?: string }> = ({ id }) => {
  const url = id ? `/storage/bangumi/hls/${id.replace('--', '.')}/index.m3u8` : 'http://localhost:8383/conan.m3u8';
  return <div>
    <div style={{ padding: '10px 20px' }}>
      <span>id: </span>
      <input value={id} readOnly />
    </div>
    <VideoPlayer url={url} />
  </div>;
};

const SearchModule: React.FC<{ collection?: Collection }> = ({ collection }) => {
  const {
    searchKey: defaultKey = 'test',
    reFilter: defaultFilter = '',
    name: defaultName = '',
  } = collection ?? {};
  const reset = () => {
    if (!collection) return;
    setKey(collection.searchKey);
    setFilter(collection.reFilter);
    setCollectionName(collection.name);
  };
  useEffect(reset, [collection]);
  const [key, debouncedKey, setKey] = useDebounceInput(defaultKey);
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

  const [filter, setFilter] = useState(defaultFilter);
  const reFilter = (() => {
    try {
      if (!filter) return;
      return new RegExp(filter);
    } catch {
      return;
    }
  })();
  const listx = list?.map ? list : undefined; // ???????????????????????????
  const filteredList = reFilter && listx ? listx.filter(item => reFilter.test(item.title)) : listx;

  const [collectionName, setCollectionName] = useState(defaultName);
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
        <button onClick={reset}>Reset</button>
      </div>
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
        <button onClick={run}>??????</button>
      </div>
      <div style={{ overflow: 'scroll', height: '600px' }}>
        {filteredList?.map(item => <div key={item.url} style={{ border: '1px solid #000' }}>
          <span>({new Date(item.pubDate).toLocaleString()})</span>
          <span>{item.title}</span>
        </div>) ?? <div>Loading...</div>}
      </div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
