process.env.NO_DEPRECATION = 'digest-fetch';

import after from 'after';
import assert from 'assert';
import DigestFetch from '../digest-fetch-src.js';
import factory from './test-server.js';
import chai from 'chai';
var expect = chai.expect
import chaiHttp from 'chai-http';
chai.use(chaiHttp)
chai.should()
var app = factory.getApp('auth')

describe('digest-fetch-rfc7616-sha512-256', function(){

  it('Test RFC7616-sha512-256', function() {
    var client = new DigestFetch('test', 'test', {algorithm: 'SHA-512-256'})
    return chai.request(app).get('/auth').then(res => {
      expect(res).to.have.status(401)
      client.lastAuth = res.res.headers['www-authenticate']
    })
    .then(() => {
      client.parseAuth(client.lastAuth)
      const auth = client.addAuth('/auth', { method: 'GET' }).headers.Authorization
      return chai.request(app).get('/auth').set('Authorization', auth).then(res => {
        expect(res).to.have.status(200)
      })
    })
  })

  it('Test RFC7616-sha512-256 with precomputed hash', function() {
    const precomputedHash = (new DigestFetch('test', 'test', {algorithm: 'SHA-512-256'})).computeHash('test', 'Users', 'test');
    var client = new DigestFetch('test', precomputedHash, { precomputedHash: true, algorithm: 'SHA-512-256'})
    return chai.request(app).get('/auth').then(res => {
      expect(res).to.have.status(401)
      client.lastAuth = res.res.headers['www-authenticate']
    })
    .then(() => {
      client.parseAuth(client.lastAuth)
      const auth = client.addAuth('/auth', { method: 'GET' }).headers.Authorization
      return chai.request(app).get('/auth').set('Authorization', auth).then(res => {
        expect(res).to.have.status(200)
      })
    })
  })

  it('Test RFC7616-sha512-256 with wrong credential', function() {
    var client = new DigestFetch('test', 'test-null', {algorithm: 'SHA-512-256'})
    return chai.request(app).get('/auth').then(res => {
      expect(res).to.have.status(401)
      client.lastAuth = res.res.headers['www-authenticate']
    })
    .then(() => {
      client.parseAuth(client.lastAuth)
      const auth = client.addAuth('/auth', { method: 'GET' }).headers.Authorization
      return chai.request(app).get('/auth').set('Authorization', auth).then(res => {
        expect(res).to.have.status(401)
      })
    })
  })
})
