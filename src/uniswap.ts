import { JsonRpcProvider } from "@ethersproject/providers";
import { ChainId } from "@uniswap/sdk";
import { CurrencyAmount, Percent, Token, TradeType } from "@uniswap/sdk-core";
import { AlphaRouter, SwapType } from "@uniswap/smart-order-router";

const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const USDC = new Token(ChainId.MAINNET, USDC_ADDRESS, 6);
const COMPOUND_ADDRESS = "0xc00e94Cb662C3520282E6f5717214004A7f26888";
const COMP = new Token(ChainId.MAINNET, COMPOUND_ADDRESS, 18);
const DEFAULT_HARDHAT_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // used as recipient for swaps
const PROVIDER = new JsonRpcProvider(process.env.REACT_APP_JSON_RPC_NODE_URL);
const ROUTER = new AlphaRouter({ chainId: 1, provider: PROVIDER });
const SWAP_OPTIONS = {
  recipient: DEFAULT_HARDHAT_ADDRESS,
  slippageTolerance: new Percent(1, 100),
  deadline: Math.floor(Date.now() / 1000 + 1800),
  type: SwapType.UNIVERSAL_ROUTER,
};

let swapPathOutput = "Fetching path data...";

async function getAmountOut(usdcAmount: number): Promise<string> {
  console.log("usdcAmount", usdcAmount);
  const usdcInputConverted = (
    usdcAmount * Math.pow(10, USDC.decimals)
  ).toString();
  console.log("usdcInputConverted", usdcInputConverted);
  console.log("router", ROUTER);

  const route = await getUsdcCompUniversalRoute(usdcInputConverted);

  if (route) {
    console.log("route", route);
    console.log(
      `Quote Exact In: ${route.quote.toFixed(route.quote.currency.decimals)}`
    );
    console.log(
      `Gas Adjusted Quote In: ${route.quoteGasAdjusted.toFixed(
        route.quote.currency.decimals
      )}`
    );
    console.log(`Gas Used USD: ${route.estimatedGasUsedUSD.toFixed(2)}`);
    console.log(route?.methodParameters?.calldata);
    console.log("the path");
    console.log(route.route[0].tokenPath);
    swapPathOutput = route.route[0].tokenPath
      .map((token) => `${token.address}`)
      .join(" -> ");
  }

  return route
    ? route?.quote.toFixed(route.quote.currency.decimals)
    : "loading";
}
async function getUsdcCompUniversalRoute(usdcInputConverted: string) {
  return await ROUTER.route(
    CurrencyAmount.fromRawAmount(USDC, usdcInputConverted),
    COMP,
    TradeType.EXACT_INPUT,
    SWAP_OPTIONS
  );
}

async function getPath(): Promise<string> {
  return swapPathOutput;
}

export { getAmountOut, getPath };
