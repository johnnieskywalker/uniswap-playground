import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import {
  ChainId,
  Token,
  Fetcher,
  Route,
  Trade,
  TokenAmount,
  TradeType,
  WETH,
  Pair,
} from "@uniswap/sdk";
import { ethers } from "ethers";

const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
const USDC = new Token(ChainId.MAINNET, USDC_ADDRESS, 6);

const COMPOUND_ADDRESS = "0xc00e94Cb662C3520282E6f5717214004A7f26888"
const COMP = new Token(ChainId.MAINNET, COMPOUND_ADDRESS, 18);

// Uniswap V2 router on Ethereum mainnet
const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const provider = new JsonRpcProvider(process.env.REACT_APP_JSON_RPC_NODE_URL)

async function getAmountOut(usdcAmount: number): Promise<string> {
  const usdc = new TokenAmount(USDC, usdcAmount.toString());
  const [pairUSDCWETH, pairWETHCOMP] = await Promise.all([
      Fetcher.fetchPairData(USDC, WETH[1], provider),
      Fetcher.fetchPairData(WETH[1], COMP, provider),
  ]);

  if (!pairUSDCWETH || !pairWETHCOMP) {
      throw new Error("Failed to fetch pair data for USDC-WETH-COMP route");
  }

  console.log("pairUSDCWETH", pairUSDCWETH);
  console.log("pairWETHCOMP", pairWETHCOMP);

  const twoThousandUsdc = (2000 * 10 * 18).toString();
//   const HOT = new Token(ChainId.MAINNET, '0xc0FFee0000000000000000000000000000000000', 18, 'HOT', 'Caffeine')
//   const NOT = new Token(ChainId.MAINNET, '0xDeCAf00000000000000000000000000000000000', 18, 'NOT', 'Caffeine')
//   const HOT_NOT = new Pair(new TokenAmount(HOT, '2000000000000000000'), new TokenAmount(NOT, '1000000000000000000'))
//   const route = new Route([HOT_NOT], NOT)
// console. 

  const USDC_COMP = new Pair(new TokenAmount(USDC, twoThousandUsdc), new TokenAmount(COMP, '1000000000000000000'))
  const route = new Route([USDC_COMP], COMP)
  console.log("route", route)
  // const route = new Route([pairUSDCWETH, pairWETHCOMP], COMP);
  // const trade = new Trade(route, usdc, TradeType.EXACT_INPUT);
const  bestTrade = Trade.bestTradeExactIn([USDC_COMP], twoThousandUsdc, COMP, { maxHops: 3, maxNumResults: 1 })
console.log("bestTrade", bestTrade)
  // const bestTradeExactIn = Trade.bestTradeExactIn([pairUSDCWETH, pairWETHCOMP], usdc, { maxHops: 3, maxNumResults: 1 })[0]
  // console.log("trade", trade)
  return bestTrade[0].outputAmount.toSignificant(6);
}
function getPath(): Array<string> {
  return [USDC.address, WETH[1].address, COMP.address]
}

export { getAmountOut, getPath }
