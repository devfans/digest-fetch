/// !-----------------------------------------------------------------------------------------------------------
/// |  
//  |  `digest-fetch` is a wrapper of `node-fetch` or `fetch` to provide http digest authentication boostraping.
//  |
/// !-----------------------------------------------------------------------------------------------------------

const canRequire = typeof(require) == 'function'
if (typeof(fetch) !== 'function' && canRequire) var fetch = require('node-fetch')
// if (typeof(cryptojs) !== 'function' && canRequire) var cryptojs = require('crypto-js')
const cryptojs = require('crypto-js')
const base64 = require('base-64')

const supported_algorithms = ['MD5', 'MD5-sess']

// challenge = auth-scheme 1*SP 1#auth-param

const tokenRegexp = '[!#-\'*+-.0-9A-Z^_`a-z~]+'
const schemeRegexp = tokenRegexp
const paramRegexp = tokenRegexp+'='+'('+tokenRegexp+'|"([^"\\\\]|\\\\.)*")'

const challengeRegexp = new RegExp('^(('+schemeRegexp+') +'+paramRegexp+'( *, *'+paramRegexp+')*) *(, *'+schemeRegexp+' .*)?$')

const parse = (raw, field, trim=true) => {
  const regex = new RegExp(`${field}=("[^"]*"|[^,]*)`, "i")
  const match = regex.exec(raw)
  if (match)
    return trim ? match[1].replace(/[\s"]/g, '') : match[1]
  return null
}

class DigestClient {
  constructor(user, password, options={}) {
    this.user = user
    this.password = password
    this.nonceRaw = 'abcdef0123456789'
    this.logger = options.logger
    this.precomputedHash = options.precomputedHash

    let algorithm = options.algorithm || 'MD5'
    if (!supported_algorithms.includes(algorithm)) {
      if (this.logger) this.logger.warn(`Unsupported algorithm ${algorithm}, will try with MD5`)
      algorithm = 'MD5'
    }
    this.digest = { nc: 0, algorithm, realm: '' }
    this.hasAuth = false
    const _cnonceSize = parseInt(options.cnonceSize)
    this.cnonceSize = isNaN(_cnonceSize) ? 32 : _cnonceSize // cnonce length 32 as default

    // Custom authentication failure code for avoiding browser prompt:
    // https://stackoverflow.com/questions/9859627/how-to-prevent-browser-to-invoke-basic-auth-popup-and-handle-401-error-using-jqu
    this.statusCode = options.statusCode || 401
    this.basic = options.basic || false
  }

  async fetch (url, options={}) {
    if (this.basic) return fetch(url, this.addBasicAuth(options))
    const resp = await fetch(url, this.addAuth(url, options))
    if (resp.status == this.statusCode) {
      this.hasAuth = false
      await this.parseAuth(resp.headers.get('www-authenticate'))
      if (this.hasAuth) {
        const respFinal = await fetch(url, this.addAuth(url, options))
        if (respFinal.status == this.statusCode) {
          this.hasAuth = false
        } else {
          this.digest.nc++
        }
        return respFinal
      }
    } else this.digest.nc++
    return resp
  }

  addBasicAuth (options={}) {
    let _options = {}
    if (typeof(options.factory) == 'function') {
      _options = options.factory()
    } else {
      _options = options
    }

    const auth = 'Basic ' + base64.encode(this.user + ":" + this.password)
    _options.headers = _options.headers || {}
    _options.headers.Authorization = auth

    if (this.logger) this.logger.debug(options)
    return _options
  }

  static computeHash(user, realm, password) {
    return cryptojs.MD5(`${user}:${realm}:${password}`).toString();
  }

  addAuth (url, options) {
    if (typeof(options.factory) == 'function') options = options.factory()
    if (!this.hasAuth) return options
    if (this.logger) this.logger.info(`requesting with auth carried`)

    const isRequest = typeof(url) === 'object' && typeof(url.url) === 'string'
    const urlStr = isRequest ? url.url : url
    const _url = urlStr.replace('//', '')
    const uri = _url.indexOf('/') == -1 ? '/' : _url.slice(_url.indexOf('/'))
    const method = options.method ? options.method.toUpperCase() : 'GET'

    let ha1 = this.precomputedHash ? this.password : DigestClient.computeHash(this.user, this.digest.realm, this.password)
    if (this.digest.algorithm === 'MD5-sess') {
      ha1 = cryptojs.MD5(`${ha1}:${this.digest.nonce}:${this.digest.cnonce}`).toString()
    }

    // optional MD5(entityBody) for 'auth-int'
    let _ha2 = '' 
    if (this.digest.qop === 'auth-int') {
      // not implemented for auth-int
      if (this.logger) this.logger.warn('Sorry, auth-int is not implemented in this plugin')
      // const entityBody = xxx
      // _ha2 = ':' + cryptojs.MD5(entityBody).toString()
    }
    const ha2 = cryptojs.MD5(`${method}:${uri}${_ha2}`).toString()

    const ncString = ('00000000'+this.digest.nc).slice(-8)

    let _response = `${ha1}:${this.digest.nonce}:${ncString}:${this.digest.cnonce}:${this.digest.qop}:${ha2}`
    if (!this.digest.qop) _response = `${ha1}:${this.digest.nonce}:${ha2}`
    const response = cryptojs.MD5(_response).toString()

    const opaqueString = this.digest.opaque !== null ? `opaque="${this.digest.opaque}",` : ''
    const qopString = this.digest.qop ? `qop="${this.digest.qop}",` : ''
    const digest = `Digest username="${this.user}",realm="${this.digest.realm}",\
nonce="${this.digest.nonce}",uri="${uri}",${opaqueString}${qopString}\
algorithm="${this.digest.algorithm}",response="${response}",nc=${ncString},cnonce="${this.digest.cnonce}"`
    options.headers = options.headers || {}
    options.headers.Authorization = digest
    if (this.logger) this.logger.debug(options)

    // const {factory, ..._options} = options
    const _options = {}
    Object.assign(_options, options)
    delete _options.factory
    return _options;
  }

  async parseAuth (h) {
    this.lastAuth = h

    if (!h || h.length < 5) {
      this.hasAuth = false
      return
    }

    this.hasAuth = true
    while (true) {
      const challengeMatch = h.match(challengeRegexp)
      if (!challengeMatch) {
        break
      }
      const challenge = challengeMatch[1]
      const scheme = challengeMatch[2]

      if (scheme.match(/^Digest$/i)) {

        this.digest.realm = (parse(challenge, 'realm', false) || '').replace(/["]/g, '')

        this.digest.qop = this.parseQop(challenge)

        this.digest.opaque = parse(challenge, 'opaque')

        this.digest.nonce = parse(challenge, 'nonce') || ''

        this.digest.cnonce = this.makeNonce()
        this.digest.nc++
      }
      h = h.substr(challenge.length)
      if (!h) {
        break
      }
      const comma = h.match("^( *, *).*")
      if (!comma) {
        // TODO: parse error
        break
      }
      h = h.substr(comma[1].length)
    }
  }

  parseQop (rawAuth) {
    // Following https://en.wikipedia.org/wiki/Digest_access_authentication
    // to parse valid qop
    // Samples 
    // : qop="auth,auth-init",realm=
    // : qop=auth,realm=
    const _qop = parse(rawAuth, 'qop')

    if (_qop !== null) {
      const qops = _qop.split(',')
      if (qops.includes('auth')) return 'auth'
      else if (qops.includes('auth-int')) return 'auth-int'
    }
    // when not specified
    return null
  }

  makeNonce () {
    let uid = ''
    for (let i = 0; i < this.cnonceSize; ++i) {
      uid += this.nonceRaw[Math.floor(Math.random() * this.nonceRaw.length)];
    }
    return uid
  }

  static parse(...args) {
    return parse(...args)
  }
}

if (typeof(window) === "object") window.DigestFetch = DigestClient
module.exports = DigestClient
