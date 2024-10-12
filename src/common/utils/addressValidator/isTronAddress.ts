export const isTronAddress = (address: string) => {
  const tronPattern = /^T[1-9A-HJ-NP-Za-km-z]{33}$/;
  return tronPattern.test(address);
};
