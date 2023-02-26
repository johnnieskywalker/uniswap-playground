import React, { useState } from "react";
import "./App.css";
import { getAmountOut, getPath } from "./uniswap";

function App() {
  const SUGGESTED_INITIAL_USDC_AMOUNT = 2000;
  const [usdcAmount, setUsdcAmount] = useState(SUGGESTED_INITIAL_USDC_AMOUNT);
  const [compAmount, setCompAmount] = useState("0");
  const [path, setPath] = useState("Specify USDC amount to find the path...");

  const handleUsdcAmountChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const amount = parseFloat(event.target.value);
    setUsdcAmount(amount);
    const amountOut = await getAmountOut(amount);
    console.log("amountOut", amountOut);
    setCompAmount(amountOut);
    const optimalPath = await getPath();
    setPath(optimalPath);
  };

  return (
    <div>
      <h1>Uniswap Universal Router USDC-COMP</h1>
      Change USDC amount to see the amount of COMP you will get.
      <br />
      <label>
        USDC amount:
        <input
          type="number"
          value={usdcAmount}
          onChange={handleUsdcAmountChange}
        />
      </label>
      <br />
      <label>
        COMP amount:
        <input type="number" value={compAmount} disabled />
      </label>
      <br />
      <p>Swap path: {path}</p>
    </div>
  );
}

export default App;
