# digest-fetch
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

digest auth request plugin for fetch/node-fetch

## Installation
```
// dependencies for node
npm install crypto-js node-fetch

// dependencies for browser
<script src='path-to-crypto-js.js'></script>

npm install digest-fetch
```

## Get Started
```
const DigestFetch = require('digest-fetch')
const client = DigestFetch('user', 'password', console) // console as logger, optional parameter
// do request same way as fetch or node-fetch
const url = ''
const options = {}
client.fetch(url, options)
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

