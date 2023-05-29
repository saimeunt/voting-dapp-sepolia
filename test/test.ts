import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Event, BigNumber } from 'ethers';
import { WorkflowStatuses as WorkflowStatus } from '../lib/types';

type VoterStructOutput = [boolean, boolean, BigNumber] & {
  isRegistered: boolean;
  hasVoted: boolean;
  votedProposalId: BigNumber;
};

const rawVoterToVoter = (rawVoter: VoterStructOutput) => ({
  isRegistered: rawVoter.isRegistered,
  hasVoted: rawVoter.hasVoted,
  votedProposalId: rawVoter.votedProposalId.toBigInt(),
});

type ProposalStructOutput = [string, BigNumber] & {
  description: string;
  voteCount: BigNumber;
};

const rawProposalToProposal = (rawProposal: ProposalStructOutput) => ({
  description: rawProposal.description,
  voteCount: rawProposal.voteCount.toBigInt(),
});

describe('Voting', () => {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractAndSetVariables() {
    const factory = await ethers.getContractFactory('Voting');
    const contract = await factory.deploy();
    await contract.deployed();
    const [signer1, signer2, signer3] = await ethers.getSigners();
    return { contract, signer1, signer2, signer3 };
  }
  const startProposalsRegistrationFixture = async () => {
    const { contract, signer1, signer2, signer3 } = await deployContractAndSetVariables();
    await contract.registerVoters([signer2.address, signer3.address]);
    return { contract, signer1, signer2, signer3 };
  };
  const registerProposalFixture = async () => {
    const { contract, signer1, signer2, signer3 } = await startProposalsRegistrationFixture();
    await contract.startProposalsRegistration();
    return { contract, signer1, signer2, signer3 };
  };
  const endProposalsRegistrationFixture = async () => {
    const { contract, signer1, signer2, signer3 } = await registerProposalFixture();
    await Promise.all([
      contract.connect(signer2).registerProposal('proposal1'),
      contract.connect(signer3).registerProposal('proposal2'),
    ]);
    return { contract, signer1, signer2, signer3 };
  };
  const startVotingSessionFixture = async () => {
    const { contract, signer1, signer2, signer3 } = await endProposalsRegistrationFixture();
    await contract.endProposalsRegistration();
    return { contract, signer1, signer2, signer3 };
  };
  const voteFixture = async () => {
    const { contract, signer1, signer2, signer3 } = await startVotingSessionFixture();
    await contract.startVotingSession();
    return { contract, signer1, signer2, signer3 };
  };
  const endVotingSessionFixture = async () => {
    const { contract, signer1, signer2, signer3 } = await voteFixture();
    await Promise.all([contract.connect(signer2).vote(0), contract.connect(signer3).vote(0)]);
    return { contract, signer1, signer2, signer3 };
  };
  const tallyVotesFixture = async () => {
    const { contract, signer1, signer2, signer3 } = await endVotingSessionFixture();
    await contract.endVotingSession();
    return { contract, signer1, signer2, signer3 };
  };
  const getWinnerFixture = async () => {
    const { contract, signer1, signer2, signer3 } = await tallyVotesFixture();
    await contract.tallyVotes();
    return { contract, signer1, signer2, signer3 };
  };
  describe('registerVoters', () => {
    it('should revert if status is not RegisteringVoters', async () => {
      const { contract, signer2, signer3 } = await loadFixture(deployContractAndSetVariables);
      await contract.startProposalsRegistration();
      await expect(
        contract.registerVoters([signer2.address, signer3.address]),
      ).to.be.revertedWithCustomError(contract, 'InvalidWorkflowStatusError');
    });
    it('should revert if not called by owner', async () => {
      const { contract, signer2, signer3 } = await loadFixture(deployContractAndSetVariables);
      await expect(
        contract.connect(signer2).registerVoters([signer2.address, signer3.address]),
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
    it('should register voters', async () => {
      const { contract, signer2, signer3 } = await loadFixture(deployContractAndSetVariables);
      await contract.registerVoters([signer2.address, signer3.address]);
      const [rawVoter1, rawVoter2] = await Promise.all([
        contract.voters(signer2.address),
        contract.voters(signer3.address),
      ]);
      const registeredVoter = {
        isRegistered: true,
        hasVoted: false,
        votedProposalId: ethers.constants.MaxUint256,
      };
      expect(rawVoterToVoter(rawVoter1)).to.deep.equal(registeredVoter);
      expect(rawVoterToVoter(rawVoter2)).to.deep.equal(registeredVoter);
    });
    it('should emit VoterRegistered', async () => {
      const { contract, signer2 } = await loadFixture(deployContractAndSetVariables);
      await expect(contract.registerVoters([signer2.address]))
        .to.emit(contract, 'VoterRegistered')
        .withArgs(signer2.address);
    });
  });
  describe('registerVoter', () => {
    it('should revert if status is not RegisteringVoters', async () => {
      const { contract, signer2 } = await loadFixture(deployContractAndSetVariables);
      await contract.startProposalsRegistration();
      await expect(contract.registerVoter(signer2.address)).to.be.revertedWithCustomError(
        contract,
        'InvalidWorkflowStatusError',
      );
    });
    it('should revert if not called by owner', async () => {
      const { contract, signer2 } = await loadFixture(deployContractAndSetVariables);
      await expect(contract.connect(signer2).registerVoter(signer2.address)).to.be.revertedWith(
        'Ownable: caller is not the owner',
      );
    });
    it('should register a voter', async () => {
      const { contract, signer2 } = await loadFixture(deployContractAndSetVariables);
      await contract.registerVoter(signer2.address);
      const rawVoter = await contract.voters(signer2.address);
      const registeredVoter = {
        isRegistered: true,
        hasVoted: false,
        votedProposalId: ethers.constants.MaxUint256,
      };
      expect(rawVoterToVoter(rawVoter)).to.deep.equal(registeredVoter);
    });
  });
  describe('startProposalsRegistration', () => {
    it('should revert if status is not RegisteringVoters', async () => {
      const { contract } = await loadFixture(startProposalsRegistrationFixture);
      await contract.startProposalsRegistration();
      await expect(contract.startProposalsRegistration()).to.be.revertedWithCustomError(
        contract,
        'InvalidWorkflowStatusError',
      );
    });
    it('should revert if not called by owner', async () => {
      const { contract, signer2 } = await loadFixture(startProposalsRegistrationFixture);
      await expect(contract.connect(signer2).startProposalsRegistration()).to.be.revertedWith(
        'Ownable: caller is not the owner',
      );
    });
    it('should change status to ProposalsRegistrationStarted', async () => {
      const { contract } = await loadFixture(startProposalsRegistrationFixture);
      await contract.startProposalsRegistration();
      const status = await contract.status();
      expect(status).to.equal(WorkflowStatus.ProposalsRegistrationStarted);
    });
  });
  describe('registerProposal', () => {
    it('should revert if status is not ProposalsRegistrationStarted', async () => {
      const { contract, signer2 } = await loadFixture(deployContractAndSetVariables);
      await expect(
        contract.connect(signer2).registerProposal('proposal1'),
      ).to.be.revertedWithCustomError(contract, 'InvalidWorkflowStatusError');
    });
    it('should revert if not called by registered voter', async () => {
      const { contract } = await loadFixture(registerProposalFixture);
      await expect(contract.registerProposal('proposal1')).to.be.revertedWithCustomError(
        contract,
        'VoterNotRegisteredError',
      );
    });
    it('should revert if registering an empty proposal', async () => {
      const { contract, signer2 } = await loadFixture(registerProposalFixture);
      await expect(contract.connect(signer2).registerProposal('')).to.be.revertedWithCustomError(
        contract,
        'InvalidProposalError',
      );
    });
    it('should revert if registering a duplicate proposal', async () => {
      const { contract, signer2 } = await loadFixture(registerProposalFixture);
      await contract.connect(signer2).registerProposal('proposal1');
      await expect(
        contract.connect(signer2).registerProposal('proposal1'),
      ).to.be.revertedWithCustomError(contract, 'DuplicateProposalError');
    });
    it('should add proposals', async () => {
      const { contract, signer2, signer3 } = await loadFixture(registerProposalFixture);
      const [tx1, tx2] = await Promise.all([
        contract.connect(signer2).registerProposal('proposal1'),
        contract.connect(signer3).registerProposal('proposal2'),
      ]);
      const [receipt1, receipt2] = await Promise.all([tx1.wait(), tx2.wait()]);
      const [event1] = receipt1.events as Event[];
      const proposal1Id = BigNumber.from(event1.data);
      const [event2] = receipt2.events as Event[];
      const proposal2Id = BigNumber.from(event2.data);
      const [rawProposal1, rawProposal2] = await Promise.all([
        contract.proposals(proposal1Id),
        contract.proposals(proposal2Id),
      ]);
      expect(rawProposalToProposal(rawProposal1)).to.deep.equal({
        description: 'proposal1',
        voteCount: 0,
      });
      expect(rawProposalToProposal(rawProposal2)).to.deep.equal({
        description: 'proposal2',
        voteCount: 0,
      });
    });
    it('should emit ProposalRegistered', async () => {
      const { contract, signer2 } = await loadFixture(registerProposalFixture);
      await expect(contract.connect(signer2).registerProposal('proposal1'))
        .to.emit(contract, 'ProposalRegistered')
        .withArgs(0);
    });
  });
  describe('endProposalsRegistration', () => {
    it('should revert if status is not ProposalsRegistrationStarted', async () => {
      const { contract } = await loadFixture(deployContractAndSetVariables);
      await expect(contract.endProposalsRegistration()).to.be.revertedWithCustomError(
        contract,
        'InvalidWorkflowStatusError',
      );
    });
    it('should revert if not called by owner', async () => {
      const { contract, signer2 } = await loadFixture(endProposalsRegistrationFixture);
      await expect(contract.connect(signer2).endProposalsRegistration()).to.be.revertedWith(
        'Ownable: caller is not the owner',
      );
    });
    it('should revert if less than 2 proposals registered', async () => {
      const { contract } = await loadFixture(registerProposalFixture);
      await expect(contract.endProposalsRegistration()).to.be.revertedWithCustomError(
        contract,
        'NotEnoughProposalsError',
      );
    });
    it('should change status to ProposalsRegistrationEnded', async () => {
      const { contract } = await loadFixture(endProposalsRegistrationFixture);
      await contract.endProposalsRegistration();
      const status = await contract.status();
      expect(status).to.equal(WorkflowStatus.ProposalsRegistrationEnded);
    });
  });
  describe('startVotingSession', () => {
    it('should revert if status is not ProposalsRegistrationEnded', async () => {
      const { contract } = await loadFixture(deployContractAndSetVariables);
      await expect(contract.startVotingSession()).to.be.revertedWithCustomError(
        contract,
        'InvalidWorkflowStatusError',
      );
    });
    it('should revert if not called by owner', async () => {
      const { contract, signer2 } = await loadFixture(startVotingSessionFixture);
      await expect(contract.connect(signer2).startVotingSession()).to.be.revertedWith(
        'Ownable: caller is not the owner',
      );
    });
    it('should change status to VotingSessionStarted', async () => {
      const { contract } = await loadFixture(startVotingSessionFixture);
      await contract.startVotingSession();
      const status = await contract.status();
      expect(status).to.equal(WorkflowStatus.VotingSessionStarted);
    });
  });
  describe('vote', () => {
    it('should revert if status is not VotingSessionStarted', async () => {
      const { contract, signer2 } = await loadFixture(deployContractAndSetVariables);
      await expect(contract.connect(signer2).vote(0)).to.be.revertedWithCustomError(
        contract,
        'InvalidWorkflowStatusError',
      );
    });
    it('should revert if not called by registered voter', async () => {
      const { contract } = await loadFixture(voteFixture);
      await expect(contract.vote(0)).to.be.revertedWithCustomError(
        contract,
        'VoterNotRegisteredError',
      );
    });
    it('should revert if voting on a non existing proposal', async () => {
      const { contract, signer2 } = await loadFixture(voteFixture);
      await expect(contract.connect(signer2).vote(2)).to.be.revertedWithCustomError(
        contract,
        'InvalidProposalId',
      );
    });
    it('should revert if voter has already voted', async () => {
      const { contract, signer2 } = await loadFixture(voteFixture);
      await contract.connect(signer2).vote(0);
      await expect(contract.connect(signer2).vote(0)).to.be.revertedWithCustomError(
        contract,
        'VoterAlreadyVotedError',
      );
    });
    it('should perform a vote', async () => {
      const { contract, signer2 } = await loadFixture(voteFixture);
      const rawProposalBeforeVote = await contract.proposals(0);
      await contract.connect(signer2).vote(0);
      const [rawVoter, rawProposalAfterVote] = await Promise.all([
        contract.voters(signer2.address),
        contract.proposals(0),
      ]);
      expect(rawVoterToVoter(rawVoter)).to.include({
        hasVoted: true,
        votedProposalId: BigInt(0),
      });
      expect(rawProposalToProposal(rawProposalAfterVote).voteCount).equal(
        rawProposalToProposal(rawProposalBeforeVote).voteCount + BigInt(1),
      );
    });
    it('should emit Voted', async () => {
      const { contract, signer2 } = await loadFixture(voteFixture);
      await expect(contract.connect(signer2).vote(0))
        .to.emit(contract, 'Voted')
        .withArgs(signer2.address, 0);
    });
  });
  describe('endVotingSession', () => {
    it('should revert if status is not VotingSessionStarted', async () => {
      const { contract } = await loadFixture(deployContractAndSetVariables);
      await expect(contract.endVotingSession()).to.be.revertedWithCustomError(
        contract,
        'InvalidWorkflowStatusError',
      );
    });
    it('should revert if not called by owner', async () => {
      const { contract, signer2 } = await loadFixture(endVotingSessionFixture);
      await expect(contract.connect(signer2).endVotingSession()).to.be.revertedWith(
        'Ownable: caller is not the owner',
      );
    });
    it('should change status to VotingSessionEnded', async () => {
      const { contract } = await loadFixture(endVotingSessionFixture);
      await contract.endVotingSession();
      const status = await contract.status();
      expect(status).to.equal(WorkflowStatus.VotingSessionEnded);
    });
  });
  describe('tallyVotes', () => {
    it('should revert if status is not VotingSessionEnded', async () => {
      const { contract } = await loadFixture(deployContractAndSetVariables);
      await expect(contract.tallyVotes()).to.be.revertedWithCustomError(
        contract,
        'InvalidWorkflowStatusError',
      );
    });
    it('should revert if not called by owner', async () => {
      const { contract, signer2 } = await loadFixture(tallyVotesFixture);
      await expect(contract.connect(signer2).tallyVotes()).to.be.revertedWith(
        'Ownable: caller is not the owner',
      );
    });
    it('should compute the winning proposal (0)', async () => {
      const { contract } = await loadFixture(tallyVotesFixture);
      await contract.tallyVotes();
      const winningProposalId = await contract.winningProposalId();
      expect(winningProposalId).to.equal(0);
    });
    it('should compute the winning proposal (1)', async () => {
      const { contract, signer2, signer3 } = await loadFixture(voteFixture);
      await Promise.all([contract.connect(signer2).vote(1), contract.connect(signer3).vote(1)]);
      await contract.endVotingSession();
      await contract.tallyVotes();
      const winningProposalId = await contract.winningProposalId();
      expect(winningProposalId).to.equal(1);
    });
    it('should register a tie', async () => {
      const { contract, signer2, signer3 } = await loadFixture(voteFixture);
      await Promise.all([contract.connect(signer2).vote(0), contract.connect(signer3).vote(1)]);
      await contract.endVotingSession();
      await contract.tallyVotes();
      const winningProposalId = await contract.winningProposalId();
      expect(winningProposalId).to.equal(ethers.constants.MaxUint256);
    });
    it('should change status to VotesTallied', async () => {
      const { contract } = await loadFixture(tallyVotesFixture);
      await contract.tallyVotes();
      const status = await contract.status();
      expect(status).to.equal(WorkflowStatus.VotesTallied);
    });
  });
  describe('getWinner', () => {
    it('should revert if status is not VotesTallied', async () => {
      const { contract } = await loadFixture(deployContractAndSetVariables);
      await expect(contract.getWinner()).to.be.revertedWithCustomError(
        contract,
        'InvalidWorkflowStatusError',
      );
    });
    it('should return the winning proposal', async () => {
      const { contract } = await loadFixture(getWinnerFixture);
      const winningProposalId = await contract.winningProposalId();
      const [winner, winningProposal] = await Promise.all([
        contract.proposals(winningProposalId),
        contract.getWinner(),
      ]);
      expect(winner).to.deep.equal(winningProposal);
    });
    it('should not return a valid proposal in case of tie', async () => {
      const { contract, signer2, signer3 } = await loadFixture(voteFixture);
      await Promise.all([contract.connect(signer2).vote(0), contract.connect(signer3).vote(1)]);
      await contract.endVotingSession();
      await contract.tallyVotes();
      const winner = await contract.getWinner();
      expect(rawProposalToProposal(winner)).to.deep.equal({
        description: '',
        voteCount: ethers.constants.Zero,
      });
    });
  });
});
