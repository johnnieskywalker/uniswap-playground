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

const provider = new JsonRpcProvider(process.env.REACT_APP_JSON_RPC_NODE_URL)

async function getAmountOut(usdcAmount: number): Promise<string> {
  console.log("usdcAmount", usdcAmount)
  const usdcInputConverted = (usdcAmount*10*18).toString();
  const usdcTokenAmount = new TokenAmount(USDC, usdcInputConverted);
  
  const USDC_WETH = await Fetcher.fetchPairData(USDC, WETH[1], provider)
  const WETH_COMP = await Fetcher.fetchPairData(WETH[1], COMP, provider)
  const USDC_COMP = await Fetcher.fetchPairData(USDC, COMP, provider)

  const usdcCompRoute = new Route([USDC_COMP], COMP)
  console.log("direct usdcCompRoute", usdcCompRoute)
  console.log("usdc price for 1 comp in usdcCompRoute")
  console.log(usdcCompRoute.midPrice.toSignificant(6))
  console.log("path", usdcCompRoute.path.map(token => token.address))
  
  try {
  // FIXME - Why whenever I try to create new Trade object, it throws an error?
  const trade = new Trade(usdcCompRoute, usdcTokenAmount, TradeType.EXACT_INPUT)
  console.log('executionPrice',trade.executionPrice.toSignificant(6))
  console.log('nextMidPrice', trade.nextMidPrice.toSignificant(6))
  }
  catch (e) {
    console.log("error when creating Trade object\n", e)
  }
    const  bestTrade = Trade.bestTradeExactIn([USDC_COMP ], usdcTokenAmount, COMP, { maxHops: 3, maxNumResults: 2 })
    console.log("bestTrade", bestTrade)
    console.log("best trade execution price for 1 comp in usdc")
    console.log(bestTrade[0].executionPrice.toSignificant(6))
    console.log("best trade next mid price for 1 comp in usdc")
    console.log(bestTrade[0].nextMidPrice.toSignificant(6))
  return bestTrade[0].outputAmount.toSignificant(18);
}
// function getRouteForPair(USDC_COMP: Pair) {
//   return new Route([USDC_COMP], COMP);
// }

// async function getPath(): Promise<Array<string>> {
//   const USDC_COMP = await Fetcher.fetchPairData(USDC, COMP, provider)
//   const usdcCompRoute = getRouteForPair(USDC_COMP)
//   return usdcCompRoute.path.map(token => token.address)
// }

function getPath(): Array<string> {
  return [USDC.address, WETH[1].address, COMP.address]
}

export { getAmountOut, getPath }
