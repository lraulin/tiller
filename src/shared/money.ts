export const parseMoney = (value: string): number => {
  const parsed = parseFloat(value.replace(/[^0-9.-]/g, ""));
  return isNaN(parsed) ? 0 : parsed;
};
