const { ethers, upgrades } = require('hardhat')
const hre = require('hardhat')
const { deployed } = require('./deployed')

const CONTRACT_NAME = 'Counter'

const main = async () => {
  const [deployer] = await ethers.getSigners()
  console.log('Deploying contracts with the account:', deployer.address)
  const Counter = await hre.ethers.getContractFactory(CONTRACT_NAME)
  const counter = await upgrades.deployProxy(Counter, [], {
    kind: 'uups',
    initializer: '__Counter_init',
  })
  await counter.deployed()
  await deployed(CONTRACT_NAME, hre.network.name, counter.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
