import { ServerBase } from '../server_base'
import { HorizonResponse } from './response'
import * as errors from './errors'
import * as resources from './resources'

/**
 * Facilitates interaction with a Horizon server instance.
 *
 * @class
 */
export class HorizonServer extends ServerBase {
  /**
   * Create a new Horizon instance.
   *
   * @constructor
   *
   * @param {TokenD} sdk Parent SDK instance.
   * @param {string} serverUrl Horizon server instance URL.
   * @param {boolean} [opts.allowHttp] Allow connecting to http servers, default: `false`. This must be set to false in production deployments!
   * @param {Object} [opts.proxy] Proxy configuration. Look [axios docs](https://github.com/axios/axios#request-config) for more info
   * @param {Object} [opts.httpBasicAuth] HTTP basic auth credentials. Look [axios docs](https://github.com/axios/axios#request-config) for more info.
   * @param {Object} [opts.customHeaders] Custom headers for request.
   * @param {boolean} [opts.withCredentials] Indicates whether or not cross-site Access-Control requests should be made using credentials.
   */
  constructor (sdk, serverUrl, opts = {}) {
    opts.responseType = 'json'
    super(sdk, serverUrl, opts)

    this.useResponseInterceptor(
      (response) => new HorizonResponse(response, this),
      (error) => this._parseResponseError(error)
    )
  }

  /**
   * Get network details.
   *
   * @return {HorizonResponse} Network details.
   */
  getNetworkDetails () {
    return this._makeCallBuilder().get()
  }

  /**
   * Balances.
   *
   * @return {Balances}
   */
  get balances () {
    return new resources.Balances(this, this._sdk)
  }

  /**
   * Account details.
   *
   * @return {Account}
   */
  get account () {
    return new resources.Account(this, this._sdk)
  }

  /**
   * Transactions.
   *
   * @return {Account}
   */
  get transactions () {
    return new resources.Transactions(this, this._sdk)
  }

  _parseResponseError (error) {
    if (error.response && error.response.status) {
      switch (error.response.status) {
        case 400:
          error = new errors.BadRequestError(error)
          break
        case 401:
          error = new errors.UnauthorizedError(error)
          break
        case 404:
          error = new errors.NotFoundError(error)
          break
        case 500:
          error = new errors.InternalServerError(error)
      }
    }

    return Promise.reject(error)
  }
}