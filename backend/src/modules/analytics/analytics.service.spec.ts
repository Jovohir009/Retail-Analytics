import { calculateTrendPercent } from './analytics.service';

describe('calculateTrendPercent', () => {
  it('returns zero when both periods are empty', () => {
    expect(calculateTrendPercent(0, 0)).toBe(0);
  });

  it('returns 100 when previous period is empty and current has visitors', () => {
    expect(calculateTrendPercent(5, 0)).toBe(100);
  });

  it('calculates rounded percentage delta', () => {
    expect(calculateTrendPercent(15, 10)).toBe(50);
  });
});
