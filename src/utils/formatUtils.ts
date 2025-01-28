export const formatText = (text: string) => {
  return text.slice(0, 11).concat("...");
};

export const formatNumber = (count: number): string => {
  if (count < 1000) {
    return count.toString();
  } else if (count >= 1000 && count < 1_000_000) {
    return `${(count / 1000).toFixed(1)}k`;
  } else if (count >= 1_000_000 && count < 1_000_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M`;
  } else {
    return `${(count / 1_000_000_000).toFixed(1)}B`;
  }
};
