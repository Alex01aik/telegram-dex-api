export const isBitcoinAddress = (address: string) => {
  // Legacy (P2PKH) and P2SH regex
  const legacyPattern = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  // Bech32 regex
  const bech32Pattern = /^(bc1)[a-zA-HJ-NP-Z0-9]{25,39}$/;

  // Check for either Legacy or Bech32 address
  return legacyPattern.test(address) || bech32Pattern.test(address);
};
