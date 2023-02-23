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
  console.log("usdcAmount", usdcAmount)
  const usdcInputConverted = (usdcAmount*10*18).toString();
  const usdcTokenAmount = new TokenAmount(USDC, usdcInputConverted);
  // const USDC_COMP = new Pair(new TokenAmount(USDC, usdcInput), new TokenAmount(COMP, '1000000000000000000'))
  
  const USDC_WETH = await Fetcher.fetchPairData(USDC, WETH[1], provider)
  const WETH_COMP = await Fetcher.fetchPairData(WETH[1], COMP, provider)
  const USDC_COMP = await Fetcher.fetchPairData(USDC, COMP, provider)
  const usdcWethRoute = new Route([USDC_WETH], WETH[1])
  console.log("usdcWethRoute", usdcWethRoute)
  console.log("usdc price for 1 weth")
  console.log(usdcWethRoute.midPrice.toSignificant(6))

  const usdcCompRoute = new Route([USDC_COMP], COMP)
  console.log("direct usdcCompRoute", usdcCompRoute)
  console.log("usdc price for 1 comp in usdcCompRoute")
  console.log(usdcCompRoute.midPrice.toSignificant(6))
  // const trade = new Trade(usdcCompRoute, new TokenAmount(USDC, '1000000000000000000'), TradeType.EXACT_INPUT)
  
  // console.log('executionPrice',trade.executionPrice.toSignificant(6))
  // console.log('nextMidPrice', trade.nextMidPrice.toSignificant(6))
  
    const  bestTrade = Trade.bestTradeExactIn([USDC_WETH,WETH_COMP,USDC_COMP ], usdcTokenAmount, COMP, { maxHops: 3, maxNumResults: 2 })
    console.log("bestTrade", bestTrade)
  return bestTrade[0].outputAmount.toSignificant(18);
}
function getPath(): Array<string> {
  return [USDC.address, WETH[1].address, COMP.address]
}

export { getAmountOut, getPath }
