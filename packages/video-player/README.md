# Koumei 视频播放方案整合

## 候选方案

+ https://github.com/MoePlayer/DPlayer
+ https://github.com/bytedance/xgplayer

## Plugins

+ https://github.com/video-dev/hls.js
+ https://github.com/Dash-Industry-Forum/dash.js
+ https://github.com/google/shaka-player
+ https://github.com/Bilibili/flv.js
+ https://github.com/webtorrent/webtorrent

## 视频处理

```bash
# https://hub.docker.com/r/jrottenberg/ffmpeg
docker run -v $(pwd):$(pwd) -w $(pwd) jrottenberg/ffmpeg \
	-i conan.mp4 \
	-c:v libx264 -hls_time 10 -hls_list_size 0 -c:a aac -strict -2 -f hls \
	conan.m3u8
# https://hub.docker.com/r/denoland/deno
# https://www.denojs.cn/manual/examples/file_server#using-the-stdhttp-file-server
docker run -v $(pwd):/data -it --init -p 8383:8383 denoland/deno:1.20.4 \
	run --allow-net --allow-read https://deno.land/std@0.134.0/http/file_server.ts /data -p 8383
```

其他：转成ts文件时进行加密（考虑直接 header 头加 token 做 acl）

https://blog.csdn.net/shamqu/article/details/114042996
https://www.52pojie.cn/thread-1090132-1-1.html
https://www.zhihu.com/question/20697986
