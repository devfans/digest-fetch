# digest-fetch

[![Join the chat at https://gitter.im/devfans/digest-fetch](https://badges.gitter.im/devfans/digest-fetch.svg)](https://gitter.im/devfans/digest-fetch?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Test Coverage][coveralls-image]][coveralls-url]

digest auth request plugin for fetch/node-fetch also supports http basic authentication

## Installation

For digest-fetch 3.0.0 or above
```sh
npm install digest-fetch@latest node-fetch@latest

```

For digest-fetch 2.0.3 or below
```sh
npm install digest-fetch@v2 node-fetch@v2

```

## Get Started

```js
// Use require for digest-fetch 2.0.3 or below
const DigestClient = require('digest-fetch')

// Use import
import DigestClient from "digest-fetch"

```

#### Typescript 

For digest-fetch 3.0.0 or above

Since digest-fetch becomes ES module starting 3.0.0, you need to set your project as module to use import. 

- Specify ```"type": "module"``` in your package.json
- Specify ```--esm``` for ts-node like ```npx ts-node --esm src/index.ts```
- Specify ```"module": "ESNext", "moduleResolution": "node"``` in your tsconfig.json

```sh
// Install dependencies
npm install digest-fetch@latest node-fetch@latest

// Import
import DigestClient from "digest-fetch"

```

For digest-fetch 2.0.3 or below

```sh
// Install dependencies
npm install digest-fetch@v2 node-fetch@v2

// Import
import DigestClient from "digest-fetch"

```

#### Http Basic Authentication
Create a client using basic authentication challenge

```js
const client = new DigestClient('user', 'password', { basic: true })
client.fetch(url, options).then(res => res.json).then(console.dir)
```

#### Digest Access Authentication

Create a digest authentication request client with default options

```js
const client = new DigestClient('user', 'password') 
```

Specify options for digest authentication

``` js
const client = new DigestClient('user', 'password', { algorithm: 'MD5' }) 
```

Supported Algorithm
```js
['MD5', 'MD5-sess', 'SHA-256', 'SHA-256-sess', 'SHA-512-256', 'SHA-512-256-sess']
```

Options fields:

| field           | type         | default       |  description |
| :-------------  | :----------  | :-----------: | :----------  |
|  algorithm      | string       | 'MD5'         | algorithm to be used: 'MD5', 'SHA-256', 'SHA-512-256' or with '-sess' |
|  statusCode     | number       | 401           | custom alternate authentication failure code for avoiding browser prompt, see details below |
|  cnonceSize     | number       | 32            | length of the cnonce |
|  logger         | object       | none          | logger for debug, can use `console`, default no logging |
|  basic          | bool         | false         | switch to use basic authentication |
|  precomputeHash | bool         | false         | wether to attach hash of credentials to the client instance instead of raw credential |

Details:
 +  When using digest authentication in browsers, may encounter prompt window in foreground. Check: https://stackoverflow.com/questions/9859627/how-to-prevent-browser-to-invoke-basic-auth-popup-and-handle-401-error-using-jqu


Do request same way as fetch or node-fetch

```js
const url = ''
const options = {}
client.fetch(url, options)
  .then(resp=>resp.json())
  .then(data=>console.log(data))
  .catch(e=>console.error(e))
```

Pass in refresh request options factory function for conditions options needs be refreshed when trying again.
For example when posting with file stream:
```js
const factory = () => ({ method: 'post', body: fs.createReadStream('path-to-file') })
client.fetch(url, {factory})
  .then(resp=>resp.json())
  .then(data=>console.log(data))
  .catch(e=>console.error(e))
```

## About

Digest authentication: https://en.wikipedia.org/wiki/Digest_access_authentication or https://www.rfc-editor.org/rfc/rfc7616
This plugin is implemented following RFC2069, RFC2617 and RFC7616 supports http basic authentication as well!


Please open issues if you find bugs or meet problems during using this plugin.
Feel free to open PRs whenever you have better ideas on this project!


[npm-image]: https://img.shields.io/npm/v/digest-fetch.svg
[npm-url]: https://npmjs.org/package/digest-fetch
[coveralls-image]: https://img.shields.io/coveralls/devfans/digest-fetch/master.svg
[coveralls-url]: https://coveralls.io/r/devfans/digest-fetch?branch=master
[downloads-image]: https://img.shields.io/npm/dm/digest-fetch.svg
[downloads-url]: https://npmjs.org/package/digest-fetch

