import { describe, it, expect } from 'vitest';
import { pxtorem } from '..';

describe('pxtorem', () => {
  it('should return undefined for 0px', () => {
    expect(pxtorem(0)).toBeUndefined();
  });

  it('should convert px to rem with default precision', () => {
    expect(pxtorem(192)).toBe('1.00000rem');
    expect(pxtorem(96)).toBe('0.50000rem');
    expect(pxtorem(384)).toBe('2.00000rem');
  });

  it('should convert px to rem with specified precision', () => {
    expect(pxtorem(192, 2)).toBe('1.00rem');
    expect(pxtorem(96, 1)).toBe('0.5rem');
    expect(pxtorem(384, 3)).toBe('2.000rem');
  });

  it('should handle very large px values', () => {
    expect(pxtorem(192000)).toBe('1000.00000rem');
    expect(pxtorem(384000, 6)).toBe('2000.000000rem');
  });

  it('should handle negative px values', () => {
    expect(pxtorem(-192)).toBe('-1.00000rem');
    expect(pxtorem(-96, 2)).toBe('-0.50rem');
  });
});
