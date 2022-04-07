import DPlayer from 'dplayer';
import Hls from 'hls.js';

export const play = (container: HTMLElement, url: string) => new DPlayer({
  container,
  video: {
    url,
    type: 'customHls',
    customType: {
      customHls(video: HTMLMediaElement, _player: DPlayer) {
        const hls = new Hls();
        hls.loadSource(video.src);
        hls.attachMedia(video);
      },
    },
  },
});
