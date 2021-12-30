/* eslint-disable comma-dangle */
/* eslint-disable no-unused-vars */
const { expect } = require('chai')
const { ethers, upgrades } = require('hardhat')

// some tests: https://github.com/RaphaelHardFork/ico-hardhat

const CONTRACT_NAME = 'Collection'

describe('Collection', function () {
  let Collection, collection, CollectionV2, dev, owner, user

  beforeEach(async function () {
    ;[dev, owner, user] = await ethers.getSigners()
    Collection = await ethers.getContractFactory(CONTRACT_NAME)
    collection = await upgrades.deployProxy(Collection, ['this is the uri'], {
      kind: 'uups',
      initializer: '__Collection_init',
    })
    await collection.deployed()
  })

  describe('version 1', () => {
    it('should mint NFT', async () => {
      await collection.connect(owner).mintTo(user.address)

      expect((await collection.balanceOf(user.address, 1)).toString()).to.equal(
        '1'
      )
    })

    it('should not burn the token', async () => {
      try {
        await collection.connect(user).burn(1)
      } catch (e) {
        expect(e.message).to.equal(
          'collection.connect(...).burn is not a function'
        )
      }
    })
  })

  describe('version 2', () => {
    beforeEach(async () => {
      await collection.connect(owner).mintTo(user.address)
      await collection.connect(owner).mintTo(user.address)
      await collection.connect(owner).mintTo(owner.address)

      const CollectionV2 = await ethers.getContractFactory('CollectionV2')
      collection = await upgrades.upgradeProxy(collection.address, CollectionV2)
    })

    it('should keep the state', async () => {
      expect((await collection.balanceOf(user.address, 1)).toString()).to.equal(
        '1'
      )
      expect((await collection.balanceOf(user.address, 2)).toString()).to.equal(
        '1'
      )
      expect(
        (await collection.balanceOf(owner.address, 3)).toString()
      ).to.equal('1')
    })

    it('should burn an NFT', async () => {
      await collection.connect(user).burn(2)

      expect((await collection.balanceOf(user.address, 2)).toString()).to.equal(
        '0'
      )
    })
  })
})
