# lockval/apidemo

This is the source code of https://apidemo.lockval.com

Edit client.yaml and public/server/...

to generate the corresponding API demo page

### Quick start

```sh
npm run buildAndPreview
```

## prepare some tools
- Node.js
- curl
- Go (1.19)
- Lua (>=5.1)
- [starc2one](https://github.com/vanishs/starc2one)

### Project Setup

```sh
npm install
```

### Define variables for your Production environment:

```sh
export lockvalUpdatefileDomain=127.0.0.1:8080
export lockvalUpdatefilePassword=123456
export lockvalGwAddrs=http://127.0.0.1:59501,http://127.0.0.1:59502
```


### Download and start your services

- [Linux amd64](https://downloads.lockval.com/v0.0.7.amd64.linux.zip)
- [Linux arm64](https://downloads.lockval.com/v0.0.7.arm64.linux.zip)
- [macOS amd64](https://downloads.lockval.com/v0.0.7.amd64.darwin.zip)
- [macOS arm64](https://downloads.lockval.com/v0.0.7.arm64.darwin.zip)
- [Windows amd64](https://downloads.lockval.com/v0.0.7.amd64.windows.zip)
- [Windows arm64](https://downloads.lockval.com/v0.0.7.arm64.windows.zip)




### Build Client And Preview

```sh
npm run buildClientAndPreview
```

### Build Server(JS) And Upload

```sh
npm run serverJsBuildAndUpload
```

### Build Server(Go) And Upload (Only run on macOS and Linux)

```sh
./serverGoBuildAndUpload.sh
```

### Build Server(Lua) And Upload

```sh
npm run serverLuaBuildAndUpload
```

### Build Server(Starlark) And Upload ([Starlark is a dialect of Python](https://github.com/bazelbuild/starlark))

```sh
npm run serverStarBuildAndUpload
```

### Source Code Paths

- public/server/go
- public/server/lua
- public/server/starlark
- public/server/javascript
- public/client

