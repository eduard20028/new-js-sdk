import { logger } from '../logger'
import { accountHelper, dataHelper } from '../helpers'
import { Keypair } from '../../src/base'

describe('Data', () => {
  it('should create, update and remove', async () => {
    const log = logger.new('data-1')

    const actor = Keypair.random()
    await accountHelper.createSyndicate(actor.accountId())
    log.info(`created actor with id: ${actor.accountId()}`)

    const value = { name: 'some-name', state: 'some-state' }
    const dataId = await dataHelper.create({ value }, actor)
    expect(dataId).to.exist
    log.info(`created data entry with ID #${dataId}`)

    let data = await dataHelper.mustLoad(dataId)
    log.info(`fetched data entry with ID #${dataId}: ${JSON.stringify(data)}`)
    expect(data.value).to.eql(value)

    const updatedValue = { name: 'some-name', state: 'some-another-state' }
    await dataHelper.update({ dataId, value: updatedValue }, actor)
    log.info(`updated data entry with ID #${dataId}`)

    await dataHelper.delay(3000)

    data = await dataHelper.mustLoad(dataId)
    log.info(`fetched updated data entry with ID #${dataId}: ${JSON.stringify(data)}`)
    expect(data.value).to.eql(updatedValue)

    await dataHelper.remove(dataId, actor)
    log.info(`removed data entry with ID #${dataId}`)

    await dataHelper.mustNotFound(dataId)
    log.info(`data entry with ID #${dataId} doesn't exist anymore`)
  })
})
