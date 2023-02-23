import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { getAmountOut, getPath } from "./uniswap";


const path = getPath();


function App() {

  const SUGGESTED_INITIAL_USDC_AMOUNT = 2000;
  const [usdcAmount, setUsdcAmount] = useState(SUGGESTED_INITIAL_USDC_AMOUNT);
  const [compAmount, setCompAmount] = useState(0);
  
  const handleUsdcAmountChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const amount = parseFloat(event.target.value);
    setUsdcAmount(amount);
    const amountOut = await getAmountOut(amount);
    console.log('amountOut',amountOut)
    setCompAmount(parseFloat(amountOut)*10*18);
  };

  return (
    <div>
      <h1>Uniswap V2</h1>
      Change USDC amount to see the amount of COMP you will get.
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
        <input type="number" value={compAmount} disabled/>
      </label>
      <br />
      <p>Swap path: {path.join(" -> ")}</p>
    </div>
  );
}

export default App;
