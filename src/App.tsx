import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { getAmountOut, getPath } from "./uniswap";


const path = getPath();


function App() {
  console.log('json rpc node')
console.log(process.env.REACT_APP_JSON_RPC_NODE_URL);

  const [usdcAmount, setUsdcAmount] = useState(0);
  const [compAmount, setCompAmount] = useState(0);
  
  const handleUsdcAmountChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const amount = parseFloat(event.target.value);
    setUsdcAmount(amount);
    const amountOut = await getAmountOut(amount);
    console.log('amountOut',amountOut)
    setCompAmount(amountOut);
  };

  return (
    <div>
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
        <input type="number" value={compAmount} />
      </label>
      <br />
      <p>Swap path: {path.join(" -> ")}</p>
    </div>
  );
}

export default App;
