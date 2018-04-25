const canRequire = typeof(require) == 'function'
if (typeof(fetch) !== 'function' && canRequire) var fetch = require('node-fetch')
if (typeof(cryptojs) !== 'function' && canRequire) var cryptojs = require('crypto-js')

class DigestClient {
  constructor(user, password, logger) {
    this.user = user
    this.password = password
    this.nonceRaw = 'abcdef0123456789'
    this.digest = { nc: 1 }
    this.hasAuth = false

    this.logger = logger
  }

  async fetch (url, options={}) {
    const resp = await fetch(url, this.addAuth(url, options))
    if (resp.status == 401) {
      this.hasAuth = false
      await this.parseAuth(resp)
      if (this.hasAuth) {
        const respFinal = await fetch(url, this.addAuth(url, options))
        if (respFinal.status == 401) {
          this.hasAuth = false
        } else {
          this.digest.nc++
        }
        return respFinal
      }
    } else this.digest.nc++
    return resp
  }

  addAuth (url, options) {
    if (!this.hasAuth) return options
    const method = options.method ? options.method.toUpperCase() : 'GET'
    const ha1 = cryptojs.MD5(`${this.user}:${this.digest.realm}:${this.password}`).toString()
		const ha2 = cryptojs.MD5(`${options.method || 'GET'}:${url}`).toString()
    const ncString = ('00000000'+this.digest.nc).slice(-8)
		const response = cryptojs.MD5(`${ha1}:${this.digest.nonce}:${ncString}:${this.digest.cnonce}:{this.digest.qop}:${ha2}`).toString()
    const opaqueString = this.digest.opaque? `opaque="${this.digest.opaque}",` : ','
    const digest = `${this.digest.scheme} username="${this.user}",realm="${this.digest.realm}",\
nonce="${this.digest.nonce}",uri="${url}",response="${response}",${opaqueString}\
qop=${this.digest.qop},nc=${ncString},cnonce="${this.digest.cnonce}"`
    options.headers = options.headers || {}
    options.headers.Authorization = digest
    if (this.logger) {
      this.logger.info(options)
      this.logger.info(this.lastAuth)
    }
		return options;
  }

  async parseAuth (data) {
    const h = data.headers.get("www-authenticate")
    this.lastAuth = h

    if (h.length < 5) {
      this.hasAuth = false
      return
    }

    this.hasAuth = true
    
    this.digest.scheme = h.split(/\s/)[0]

    const _realm = /realm=\"([^\"]+)\"/i.exec(h) 
    if (_realm) this.digest.realm = _realm[1]

    const _qop = /qop=\"([^\"]+)\"/i.exec(h) 
    if (_qop) this.digest.qop = _qop[1]

    const _opaque = /opaque=\"([^\"]+)\"/i.exec(h) 
    if (_opaque) this.digest.opaque = _opaque[1]
    
    const _nonce = /nonce=\"([^\"]+)\"/i.exec(h) 
    if (_nonce) this.digest.nonce = _nonce[1]

    this.digest.cnonce = this.makeNonce()
    this.digest.nc++
  }

  makeNonce (length=16) {
    let uid = ''
    for (let i = 0; i < length; ++i) {
      uid += this.nonceRaw[Math.floor(Math.random() * this.nonceRaw.length)];
    }
    return uid
  }

}

module.exports = DigestClient
