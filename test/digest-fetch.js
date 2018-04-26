process.env.NO_DEPRECATION = 'digest-fetch';

var after = require('after')
var assert = require('assert')
var DigestFetch = require('../')

describe('digest-fetch', function(){
  it('get function', function(){
    assert.equal(typeof DigestFetch, 'function')
  })

  it('should success', function() {
    var client = new DigestFetch('test', '123')
    assert.equal(typeof client.fetch, 'function')
    client.parseAuth({headers: {}})
    client.addAuth({headers: {}})
    assert.equal(client.digest.nc, 0)
  })
})
