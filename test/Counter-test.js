/* eslint-disable comma-dangle */
/* eslint-disable no-unused-vars */
const { expect } = require('chai')
const { ethers, upgrades } = require('hardhat')

// some tests: https://github.com/RaphaelHardFork/ico-hardhat

const CONTRACT_NAME = 'Counter'

describe('Counter', function () {
  let Counter, counter, dev, owner

  beforeEach(async function () {
    ;[dev, owner] = await ethers.getSigners()
    Counter = await ethers.getContractFactory(CONTRACT_NAME)
    counter = await upgrades.deployProxy(Counter, [], {
      kind: 'uups',
      initializer: '__Counter_init',
    })
    await counter.deployed()
  })

  describe('deployment', () => {
    it('should increment', async () => {
      await counter.connect(owner).increment()

      expect((await counter.readCounter()).toString()).to.equal('1')
    })

    it('should not decrement before upgrade', async () => {
      await counter.connect(owner).increment()
      await counter.connect(owner).increment()
      await counter.connect(owner).increment()

      try {
        await counter.connect(dev).decrement()
      } catch (e) {
        expect(e.message).to.equal(
          'counter.connect(...).decrement is not a function'
        )
      }
    })
  })

  describe('upgrade to V2', () => {
    let counterV2
    beforeEach(async () => {
      await counter.connect(owner).increment()
      await counter.connect(owner).increment()
      await counter.connect(owner).increment()
      const CounterV2 = await ethers.getContractFactory('CounterV2')
      counterV2 = await upgrades.upgradeProxy(counter.address, CounterV2)
    })

    it('should not change proxy address', async () => {
      expect(counterV2.address).to.equal(counter.address)
    })

    it('should not change the previous state', async () => {
      expect((await counterV2.readCounter()).toString()).to.equal('3')
    })

    it('should decrement', async () => {
      await counterV2.connect(owner).decrement()

      expect((await counterV2.readCounter()).toString()).to.equal('2')
    })

    it.skip('should revert if not upgrader', async () => {
      // this need to be tested in true network
    })
  })
})
