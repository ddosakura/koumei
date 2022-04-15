# 派对浪客 Koumei Project

## Links

+ [Eiko Services](https://github.com/ddosakura/eiko)
+ [Nanami Images](https://github.com/ddosakura/nanami)

## QuickStart

1. 安装依赖

```bash
./install.sh
```

2. 安装 vscode 插件

+ eslint

3. 环境变量设置

```conf
# e.g.
API_ROOT=http://localhost:8088
```

### QA

本仓库支持通过 Docker Dev Environments (Windows) 开发

1. `git pull/push` fail

继承的 Windows Git 配置可能有问题，可通过如下配置解决：

```
# .git/config
[core]
  autocrlf = false
[http]
  proxy =
  sslcainfo =
  sslBackend = gnutls
  sslVerify = false
```

2. 终端打不开

镜像内无 `zsh`，只有 `bash`，vscode 需配置 `bash` 为默认终端

```json
{
  "terminal.integrated.defaultProfile.linux": "bash"
}
```

## Modules

+ bangumi
+ rss
+ https://lexical.dev/
