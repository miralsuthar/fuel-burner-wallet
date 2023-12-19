import { Provider } from "fuels";
import { useEffect, useState } from "react";

export const useBalance = (provider: Provider) => {
  const [balance, setBalance] = useState<number>();
  const [blockNumber, setBlockNumber] = useState<string>("");

  provider?.getBlockNumber().then((value) => setBlockNumber(value.toString()));

  useEffect(() => {
    console.log("this is running");
  }, [blockNumber]);
};
