export const isRippleAddress = (address: string) => {
  const ripplePattern = /^r[a-zA-Z0-9]{24,34}$/;
  return ripplePattern.test(address);
};
