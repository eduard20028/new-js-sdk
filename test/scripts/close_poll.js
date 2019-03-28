import {
  voteHelper, accountHelper, pollHelper
} from '../helpers'

import { logger } from '../logger'
import { Keypair } from '../../src/base'

/**
 *
 * @param {string} pollID
 * @param {Keypair} resultProviderKp
 */
export async function closePoll (pollID, resultProviderKp) {
  const log = logger.new('createVotes')

  let poll = await pollHelper.mustLoadById(pollID)

  log.info('number of choices ' + poll.numberOfChoices)

  for (let i = 1; i <= poll.numberOfChoices - 1; i++) {
    const voter = Keypair.random()
    await accountHelper.createSyndicate(voter.accountId())
    log.info(`Created the account, id: ${voter.accountId()}`)
    voteHelper.create({ pollID: pollID, choice: i.toString() }, voter)
  }

  const voter = Keypair.random()
  await accountHelper.createSyndicate(voter.accountId())
  log.info(`Created the account, id: ${voter.accountId()}`)
  await voteHelper.create({ pollID: pollID, choice: poll.numberOfChoices.toString() }, voter)

  await pollHelper.close(pollID, resultProviderKp)
  log.info(`Poll closed, id: ${pollID}`)

  return pollHelper.mustLoadClosed(pollID)
}
