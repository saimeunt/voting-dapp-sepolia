import { ethers } from 'hardhat';

async function main() {
  const contract = await ethers.deployContract('Voting');
  await contract.waitForDeployment();
  /* const [signer1, signer2, signer3] = await ethers.getSigners();
  await Promise.all([contract.addVoter(signer2.address), contract.addVoter(signer3.address)]);
  await contract.startProposalsRegistering();
  await Promise.all([
    contract.connect(signer2).addProposal('proposal1'),
    contract.connect(signer3).addProposal('proposal2'),
  ]);
  await contract.endProposalsRegistering();
  await contract.startVotingSession();
  await Promise.all([contract.connect(signer2).setVote(1), contract.connect(signer3).setVote(1)]); */
  console.log(`Voting successfully deployed to ${contract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
