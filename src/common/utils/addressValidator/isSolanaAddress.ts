export const isSolanaAddress = (address: string) => {
  const solanaPattern = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return solanaPattern.test(address);
};
