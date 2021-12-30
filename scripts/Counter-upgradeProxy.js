/* eslint-disable comma-dangle */
const { ethers, upgrades } = require('hardhat')
const hre = require('hardhat')
const { readFile } = require('fs/promises')

const CONTRACT_NAME = 'Counter'

const main = async () => {
  const CONTRACTS_DEPLOYED = JSON.parse(
    await readFile('./scripts/deployed.json', 'utf-8')
  )
  const DEPLOYED_CONTRACT_ADDRESS =
    CONTRACTS_DEPLOYED[CONTRACT_NAME][hre.network.name].address

  const [deployer] = await ethers.getSigners()
  console.log('Upgrading contracts with the account:', deployer.address)
  const Counter = await hre.ethers.getContractFactory(CONTRACT_NAME)
  const counter = await Counter.attach(DEPLOYED_CONTRACT_ADDRESS)

  const CounterV2 = await hre.ethers.getContractFactory('CounterV2')
  await upgrades.upgradeProxy(counter.address, CounterV2)

  console.log(`Proxy contract: ${counter.address} upgraded`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
