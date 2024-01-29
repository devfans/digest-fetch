process.env.NO_DEPRECATION = 'digest-fetch';

import after from 'after';
import assert from 'assert';
import DigestFetch from '../digest-fetch-src.js';
import factory from './test-server.js';
import chai from 'chai';
var expect = chai.expect
import chaiHttp from 'chai-http';

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

  it('test parse string fields', function () {
    assert.equal(DigestFetch.parse('a=,', 'a'), '')
    assert.equal(DigestFetch.parse('a=v1,', 'a'), 'v1')
    assert.equal(DigestFetch.parse('a=""', 'b'), null)
    assert.equal(DigestFetch.parse('a="v2",', 'a'), 'v2')
    assert.equal(DigestFetch.parse('a="v1,v2"', 'a'), 'v1,v2')
    const client = new DigestFetch("", "")
    client.parseAuth('Digest qop=auth-int,realm=test',1)
    assert.equal(client.digest.realm, "test")
    client.parseAuth('Digest qop="auth",realm="v1 v2"')
    assert.equal(client.digest.realm, "v1 v2")
  })

  it('test qop parsing', function () {
    var client = new DigestFetch('test', '123')
    assert.equal(client.parseQop('qop=auth,realm='), 'auth')
    assert.equal(client.parseQop('qop="auth",realm='), 'auth')
    assert.equal(client.parseQop('qop="auth,auth-int",realm='), 'auth')
    assert.equal(client.parseQop('qop="auth-int",realm='), 'auth-int')
  })
})
