import { Helper } from './_helper'
import { base } from '../../src'
import { signerHelper } from '../helpers'

export class Account extends Helper {
  /**
   * @param opts
   * @param opts.id
   * @param opts.roleID
   * @param [opts.accountPolicies]
   * @param [opts.referrer]
   * @param [opts.recoveryKey]
   */
  create (opts) {
    const DEFAULTS = {
      referrer: '',
      signersData: [signerHelper.getBasicSignerData(opts)]
    }

    const operation = base.CreateAccountBuilder.createAccount({
      destination: opts.id,
      roleID: opts.roleID,
      ...opts,
      ...DEFAULTS
    })

    return this.submit(operation)
  }

  createSyndicate (id) {
    return this.create({ id, roleID: '1' })
  }
}
