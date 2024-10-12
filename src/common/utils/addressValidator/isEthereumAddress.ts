export const isEthereumAddress = (address: string) => {
  const ethPattern = /^0x[a-fA-F0-9]{40}$/;
  return ethPattern.test(address);
};
