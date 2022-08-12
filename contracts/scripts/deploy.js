const hre = require('hardhat')

const main = async () => {
  // get contract to deploy
  const CrowdfundingApp = await hre.ethers.getContractFactory('CrowdfundingApp')
  const crowdFundingApp = await CrowdfundingApp.deploy()

  await crowdFundingApp.deployed()
  console.log('CrowdfundingApp deployed to: ' + crowdFundingApp.address)
}

const runMain = async () => {
  try {
    await main()
    process.exit(0)
  } catch(error) {
    console.log('Error deploying contract: ' + error)
    process.exit(1)
  }
}

runMain()