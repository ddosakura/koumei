#!/usr/bin/env zx

import FeedParser from 'feedparser';
const feedparser = new FeedParser({});

const resp = await fetch('https://acg.rip/.xml?term=Koumei');
// const text = await resp.text();
// console.log(text);
// const data = (new DOMParser()).parseFromString(text, 'text/xml');

resp.body.pipe(feedparser);

const stream = await (new Promise((r) => {
  feedparser.on('readable', function () {
    r(this);
  });
}));

console.log(stream.read());
