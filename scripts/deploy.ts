import { ethers } from 'hardhat';

async function main() {
  const contract = await ethers.deployContract('Voting');
  await contract.waitForDeployment();
  console.log(`Voting successfully deployed to ${contract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
