/* eslint-disable comma-dangle */
const { ethers, upgrades } = require('hardhat')
const hre = require('hardhat')
const { readFile } = require('fs/promises')

const CONTRACT_NAME = 'Collection'

const main = async () => {
  const CONTRACTS_DEPLOYED = JSON.parse(
    await readFile('./scripts/deployed.json', 'utf-8')
  )
  const DEPLOYED_CONTRACT_ADDRESS =
    CONTRACTS_DEPLOYED[CONTRACT_NAME][hre.network.name].address

  const [deployer] = await ethers.getSigners()
  console.log('Upgrading contracts with the account:', deployer.address)
  const Collection = await hre.ethers.getContractFactory(CONTRACT_NAME)
  const collection = await Collection.attach(DEPLOYED_CONTRACT_ADDRESS)

  const CollectionV2 = await hre.ethers.getContractFactory('CollectionV2')
  await upgrades.upgradeProxy(collection.address, CollectionV2)

  console.log(`Proxy contract: ${collection.address} upgraded`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
