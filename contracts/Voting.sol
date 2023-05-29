// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract Voting is Ownable {
  // Voting is a simple state machine traversing each one of these workflow statuses
  enum WorkflowStatus {
    RegisteringVoters,
    ProposalsRegistrationStarted,
    ProposalsRegistrationEnded,
    VotingSessionStarted,
    VotingSessionEnded,
    VotesTallied
  }
  WorkflowStatus public status; // defaults to RegisteringVoters
  // voters are stored using their address and we keep track of their registration status, voting
  // status and the proposal they voted for
  struct Voter {
    bool isRegistered;
    bool hasVoted;
    uint votedProposalId;
  }
  mapping(address => Voter) public voters;
  // proposals are added using a unique description (non-empty string) and the contract stores the
  // vote count for every proposal
  struct Proposal {
    string description;
    uint voteCount;
  }
  Proposal[] public proposals;
  // counter incremented each time a new proposal is added
  using Counters for Counters.Counter;
  Counters.Counter proposalIds;
  // the proposal which received the most vote count during the voting phase
  // MAX_UINT is used to encode an invalid proposal id, 0 <= proposalId <= proposals.length - 1
  uint public winningProposalId = type(uint).max;
  // event declarations
  event VoterRegistered(address voterAddress);
  event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
  event ProposalRegistered(uint proposalId);
  event Voted(address voter, uint proposalId);
  // error declarations
  error InvalidWorkflowStatusError();
  error InvalidProposalError();
  error DuplicateProposalError();
  error VoterNotRegisteredError();
  error NotEnoughProposalsError();
  error InvalidProposalId();
  error VoterAlreadyVotedError();

  // enforce a specific status before execution
  modifier onlyStatus(WorkflowStatus enforcedStatus) {
    if (status != enforcedStatus) {
      revert InvalidWorkflowStatusError();
    }
    _;
  }

  // require that only registered voters are able to call the function
  modifier onlyRegisteredVoter() {
    if (!voters[msg.sender].isRegistered) {
      revert VoterNotRegisteredError();
    }
    _;
  }

  // helper function to change status
  function changeStatus(WorkflowStatus newStatus) internal {
    WorkflowStatus previousStatus = status;
    status = newStatus;
    emit WorkflowStatusChange(previousStatus, newStatus);
  }

  function registerVoters(
    address[] memory _voters
  ) public onlyStatus(WorkflowStatus.RegisteringVoters) onlyOwner {
    for (uint i = 0; i < _voters.length; ++i) {
      address voterAddress = _voters[i];
      voters[voterAddress] = Voter({
        isRegistered: true,
        hasVoted: false,
        votedProposalId: type(uint).max
      });
      emit VoterRegistered(voterAddress);
    }
  }

  function registerVoter(
    address _voter
  ) external onlyStatus(WorkflowStatus.RegisteringVoters) onlyOwner {
    address[] memory _voters = new address[](1);
    _voters[0] = _voter;
    registerVoters(_voters);
  }

  function startProposalsRegistration()
    external
    onlyStatus(WorkflowStatus.RegisteringVoters)
    onlyOwner
  {
    changeStatus(WorkflowStatus.ProposalsRegistrationStarted);
  }

  function registerProposal(
    string calldata description
  ) external onlyStatus(WorkflowStatus.ProposalsRegistrationStarted) onlyRegisteredVoter {
    if (bytes(description).length == 0) {
      revert InvalidProposalError();
    }
    bytes32 descriptionHash = keccak256(abi.encodePacked(description));
    for (uint i = 0; i < proposals.length; ++i) {
      if (descriptionHash == keccak256(abi.encodePacked(proposals[i].description))) {
        revert DuplicateProposalError();
      }
    }
    proposals.push(Proposal({description: description, voteCount: 0}));
    uint proposalId = proposalIds.current();
    proposalIds.increment();
    emit ProposalRegistered(proposalId);
  }

  function endProposalsRegistration()
    external
    onlyStatus(WorkflowStatus.ProposalsRegistrationStarted)
    onlyOwner
  {
    // a minimum of 2 proposals are required for the vote to begin
    if (proposals.length < 2) {
      revert NotEnoughProposalsError();
    }
    changeStatus(WorkflowStatus.ProposalsRegistrationEnded);
  }

  function startVotingSession()
    external
    onlyStatus(WorkflowStatus.ProposalsRegistrationEnded)
    onlyOwner
  {
    changeStatus(WorkflowStatus.VotingSessionStarted);
  }

  function vote(
    uint proposalId
  ) external onlyStatus(WorkflowStatus.VotingSessionStarted) onlyRegisteredVoter {
    if (proposalId >= proposals.length) {
      revert InvalidProposalId();
    }
    Voter storage voter = voters[msg.sender];
    if (voter.hasVoted) {
      revert VoterAlreadyVotedError();
    }
    voter.hasVoted = true;
    voter.votedProposalId = proposalId;
    Proposal storage proposal = proposals[proposalId];
    proposal.voteCount++;
    emit Voted(msg.sender, proposalId);
  }

  function endVotingSession() external onlyStatus(WorkflowStatus.VotingSessionStarted) onlyOwner {
    changeStatus(WorkflowStatus.VotingSessionEnded);
  }

  function tallyVotes() external onlyStatus(WorkflowStatus.VotingSessionEnded) onlyOwner {
    // at least two proposals have been enforced before so we can safely access the first proposal
    uint winningProposalVoteCount = proposals[0].voteCount;
    winningProposalId = 0;
    bool tie = false;
    for (uint i = 1; i < proposals.length; ++i) {
      if (proposals[i].voteCount > winningProposalVoteCount) {
        winningProposalVoteCount = proposals[i].voteCount;
        winningProposalId = i;
        tie = false;
      } else if (proposals[i].voteCount == winningProposalVoteCount) {
        tie = true;
      }
    }
    if (tie) {
      winningProposalId = type(uint).max;
    }
    changeStatus(WorkflowStatus.VotesTallied);
  }

  function getWinner()
    external
    view
    onlyStatus(WorkflowStatus.VotesTallied)
    returns (Proposal memory)
  {
    if (winningProposalId == type(uint).max) {
      return Proposal({description: '', voteCount: 0});
    }
    return proposals[winningProposalId];
  }
}
