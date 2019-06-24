# digest-fetch

[![Join the chat at https://gitter.im/devfans/digest-fetch](https://badges.gitter.im/devfans/digest-fetch.svg)](https://gitter.im/devfans/digest-fetch?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

digest auth request plugin for fetch/node-fetch.

## Installation
```
// dependencies for node
npm install node-fetch

// for browers, if to use it directly, please indcude file `digest-fetch.js` in a <script/> 
<script type="application/javascript" src="path-to-digest-fetch.js'></script>
```

## Get Started
```
const DigestFetch = require('digest-fetch')
// In browser: const DigestFetch = window.DigestFetch;

const digestOptions = {
  cnonceSize: 32,    // length of cnonce, default: 32
  logger: console,   // logger for debug, default: none
  algorithm: 'MD5',  // only 'MD5' is supported now

  // Custom authentication failure code for avoiding browser prompt:
  // https://stackoverflow.com/questions/9859627/how-to-prevent-browser-to-invoke-basic-auth-popup-and-handle-401-error-using-jqu
  statusCode: 401    // default 401
}

const client = new DigestFetch('user', 'password', digestOptions) 

// do request same way as fetch or node-fetch
const url = ''
const options = {}
client.fetch(url, options)
  .then(resp=>resp.json())
  .then(data=>console.log(data))
  .catch(e=>console.error(e))

// pass in refresh request options factory function for conditions options needs be refreshed when trying again.
// etc: when posting with file stream
const factory = () => ({ method: 'post', body: fs.createReadStream('path-to-file') })
client.fetch(url, {factory})
  .then(resp=>resp.json())
  .then(data=>console.log(data))
  .catch(e=>console.error(e))

```


[npm-image]: https://img.shields.io/npm/v/digest-fetch.svg
[npm-url]: https://npmjs.org/package/digest-fetch
[travis-image]: https://img.shields.io/travis/devfans/digest-fetch/master.svg
[travis-url]: https://travis-ci.org/devfans/digest-fetch
[coveralls-image]: https://img.shields.io/coveralls/devfans/digest-fetch/master.svg
[coveralls-url]: https://coveralls.io/r/devfans/digest-fetch?branch=master
[downloads-image]: https://img.shields.io/npm/dm/digest-fetch.svg
[downloads-url]: https://npmjs.org/package/digest-fetch

