# koumei

## QuickStart

```bash
```

### QA

本仓库支持通过 Docker Dev Environments (Windows) 开发

1. `git pull/push` fail

继承的 Windows Git 配置可能有问题，可通过如下配置解决：

```
# .git/config
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
