import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { getAmountOut } from './uniswap';

describe('getAmountOut', () => {
  it('should return the correct amount of COMP for a given amount of USDC', async () => {
    const usdcAmount = 1000; // 1000 USDC
    const expectedAmount = 24.627; // Expected amount of COMP based on current exchange rate

    const amountOut = await getAmountOut(usdcAmount);
    console.log('amountOut',amountOut);
    expect(amountOut).toBeCloseTo(expectedAmount, 3);
  });
});