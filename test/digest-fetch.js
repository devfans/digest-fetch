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
    client.parseAuth('')
    client.addAuth('', {headers: {}})
    assert.equal(client.digest.nc, 0)
  })

  it('test qop parsing', function () {
    var client = new DigestFetch('test', '123')
    assert.equal(client.parseQop('qop=auth,realm='), 'auth')
    assert.equal(client.parseQop('qop="auth",realm='), 'auth')
    assert.equal(client.parseQop('qop="auth,auth-int",realm='), 'auth')
    assert.equal(client.parseQop('qop="auth-int",realm='), 'auth-int')
  })
})
