export const ZeroAddress = '0x0000000000000000000000000000000000000000';

export const truncateAddress = (address?: `0x${string}`) =>
  address ? `${address.substring(0, 8)}…${address.substring(address.length - 8)}` : ZeroAddress;
