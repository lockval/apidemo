# lockval/apidemo

This is the source code of https://apidemo.lockval.com

Edit client.yaml and public/server/...

to generate the corresponding API demo page

## prepare some tools
- Node.js
- curl

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

- [Linux amd64](https://downloads.lockval.com/v0.0.2.amd64.linux.zip)
- [Linux arm64](https://downloads.lockval.com/v0.0.2.arm64.linux.zip)
- [macOS amd64](https://downloads.lockval.com/v0.0.2.amd64.darwin.zip)
- [macOS arm64](https://downloads.lockval.com/v0.0.2.arm64.darwin.zip)
- [Windows amd64](https://downloads.lockval.com/v0.0.2.amd64.windows.zip)
- [Windows arm64](https://downloads.lockval.com/v0.0.2.arm64.windows.zip)


### Build Client&Server Script to services And Preview

```sh
npm run buildAndPreview
```

