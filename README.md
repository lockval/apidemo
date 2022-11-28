# lockval/apidemo

This is the source code of https://apidemo.lockval.com

Edit client.yaml and public/server/...

to generate the corresponding API demo page

## Project Setup

```sh
npm install
```

### Build and Preview

```sh
npm run buildAndPreview
```

### Define variables for your Production environment:

```sh
export lockvalUpdatefileDomain=127.0.0.1:8080
export lockvalUpdatefilePassword=123456
export lockvalGwAddrs=http://127.0.0.1:59501,http://127.0.0.1:59502
```
