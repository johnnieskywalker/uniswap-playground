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
} from "@uniswap/sdk";
import { ethers } from "ethers";

const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const USDC = new Token(ChainId.MAINNET, USDC_ADDRESS, 6);

const COMPOUND_ADDRESS = "0xc00e94Cb662C3520282E6f5717214004A7f26888";
const COMP = new Token(ChainId.MAINNET, COMPOUND_ADDRESS, 18);

// Uniswap V2 router on Ethereum mainnet
const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const provider = new JsonRpcProvider(process.env.REACT_APP_JSON_RPC_NODE_URL)

async function getAmountOut(usdcAmount: number): Promise<number> {
    const usdc = new TokenAmount(USDC, usdcAmount.toString());
    const [pairUSDCWETH, pairWETHCOMP] = await Promise.all([
      Fetcher.fetchPairData(USDC, WETH[1], provider),
      Fetcher.fetchPairData(WETH[1], COMP, provider),
    ]);
  
    const route = new Route([pairUSDCWETH, pairWETHCOMP], COMP);
    const trade = new Trade(route, usdc, TradeType.EXACT_INPUT);
  
    return parseFloat(trade.outputAmount.toSignificant(6));
  }
function getPath(): Array<string> {
  return [USDC.address, WETH[1].address, COMP.address];
}

export { getAmountOut, getPath };
