import { JsonRpcProvider } from "@ethersproject/providers";
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

const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const USDC = new Token(ChainId.MAINNET, USDC_ADDRESS, 6);

const COMPOUND_ADDRESS = "0xc00e94Cb662C3520282E6f5717214004A7f26888";
const COMP = new Token(ChainId.MAINNET, COMPOUND_ADDRESS, 18);

const provider = new JsonRpcProvider(process.env.REACT_APP_JSON_RPC_NODE_URL);

async function getAmountOut(usdcAmount: number): Promise<string> {
  console.log("usdcAmount", usdcAmount);
  const usdcInputConverted = (
    usdcAmount * Math.pow(10, USDC.decimals)
  ).toString();
  console.log("usdcInputConverted", usdcInputConverted);
  const usdcTokenAmount = new TokenAmount(USDC, usdcInputConverted);

  const USDC_WETH = await Fetcher.fetchPairData(USDC, WETH[1], provider);
  const WETH_COMP = await Fetcher.fetchPairData(WETH[1], COMP, provider);
  const USDC_COMP = await Fetcher.fetchPairData(USDC, COMP, provider);

  const usdcCompRoute = new Route([USDC_COMP], COMP);
  console.log("direct usdcCompRoute", usdcCompRoute);
  console.log("usdc price for 1 comp in usdcCompRoute");
  console.log(usdcCompRoute.midPrice.toSignificant(6));
  console.log(
    "path",
    usdcCompRoute.path.map((token) => token.address)
  );

  const usdcWethRoute = new Route([USDC_WETH], WETH[1]);
  const usdcWethTrade = new Trade(
    usdcWethRoute,
    new TokenAmount(WETH[USDC.chainId], usdcInputConverted),
    TradeType.EXACT_INPUT
  );
  console.log("usdcWethTrade", usdcWethTrade);
  console.log("usdcWethTrade execution price for 1 weth in usdc");
  console.log(usdcWethTrade.executionPrice.toSignificant(USDC.decimals));
  console.log("usdcWethTrade next mid price for 1 weth in usdc");
  console.log(usdcWethTrade.nextMidPrice.toSignificant(USDC.decimals));

  const wethCompRoute = new Route([WETH_COMP], COMP);
  const wethCompTrade = new Trade(
    wethCompRoute,
    new TokenAmount(COMP, usdcInputConverted),
    TradeType.EXACT_INPUT
  );
  console.log("wethCompTrade", wethCompTrade);
  console.log("wethCompTrade execution price for 1 comp in weth");
  console.log(wethCompTrade.executionPrice.toSignificant(WETH[1].decimals));
  console.log("wethCompTrade next mid price for 1 comp in weth");
  console.log(wethCompTrade.nextMidPrice.toSignificant(WETH[1].decimals));

  try {
    const usdcWethCompRoute = new Route([USDC_WETH, WETH_COMP], COMP);
    const usdcWethCompTrade = new Trade(
      usdcWethCompRoute,
      new TokenAmount(COMP, usdcInputConverted),
      TradeType.EXACT_INPUT
    );
    console.log("usdcWethCompTrade", usdcWethCompTrade);
    console.log("usdcWethCompTrade execution price for 1 comp in usdc");
  } catch (e) {
    console.log("error when creating usdcWethCompRoute\n", e);
  }
  try {
    // FIXME - Why whenever I try to create new Trade object, for both USDC-COMP and it throws an error?
    //   at getAmountOut
    // it works for route from tutorial, but doesn't work for my route https://docs.uniswap.org/sdk/v2/guides/trading
    const trade = new Trade(
      usdcCompRoute,
      usdcTokenAmount,
      TradeType.EXACT_INPUT
    );
    console.log("executionPrice", trade.executionPrice.toSignificant(6));
    console.log("nextMidPrice", trade.nextMidPrice.toSignificant(6));
  } catch (e) {
    console.log("error when creating Trade object\n", e);
  }
  const bestTrade = Trade.bestTradeExactIn([USDC_COMP], usdcTokenAmount, COMP, {
    maxHops: 3,
    maxNumResults: 100,
  });
  console.log("bestTrade", bestTrade);
  console.log("best trade execution price for 1 comp in usdc");
  console.log(bestTrade[0].executionPrice.toSignificant(6));
  console.log("best trade next mid price for 1 comp in usdc");
  console.log(bestTrade[0].nextMidPrice.toSignificant(6));
  console.log("best trade path");
  console.log(bestTrade[0].route.path.map((token) => token.address));

  return bestTrade[0].outputAmount.toSignificant(COMP.decimals);
}

async function getPath(): Promise<string> {
  // TODO - get path from bestTrade, consider using memo
  const USDC_COMP = await Fetcher.fetchPairData(USDC, COMP, provider);
  const usdcCompRoute = new Route([USDC_COMP], COMP);
  return usdcCompRoute.path.map((token) => token.address).join(" => ");
}

export { getAmountOut, getPath };
