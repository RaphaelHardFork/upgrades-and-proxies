/* eslint-disable comma-dangle */
const { ethers, upgrades } = require('hardhat')
const hre = require('hardhat')
const { deployed } = require('./deployed')

const CONTRACT_NAME = 'Collection'

const main = async () => {
  const [deployer] = await ethers.getSigners()
  console.log('Deploying contracts with the account:', deployer.address)
  const Collection = await hre.ethers.getContractFactory(CONTRACT_NAME)
  const collection = await upgrades.deployProxy(
    Collection,
    ['https://ipfs.io'],
    {
      kind: 'uups',
      initializer: '__Collection_init',
    }
  )
  await collection.deployed()
  await deployed(CONTRACT_NAME, hre.network.name, collection.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
