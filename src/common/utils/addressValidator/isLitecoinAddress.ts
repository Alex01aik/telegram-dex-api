export const isLitecoinAddress = (address: string) => {
  const ltcPattern = /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$/;
  return ltcPattern.test(address);
};
